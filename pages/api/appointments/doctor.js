import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { doctorId, startDate, endDate } = req.query;

        if (!doctorId) {
            return res.status(400).json({ error: 'Doctor ID is required' });
        }

        // Open database connection
        const db = await open({
            filename: './dentist_office.db',
            driver: sqlite3.Database
        });

        // Get start and end dates, default to current date if not provided
        const queryStartDate = startDate || new Date().toISOString().split('T')[0];
        const queryEndDate = endDate || queryStartDate;

        // Get all appointments for the doctor within the date range
        const appointments = await db.all(`
            SELECT 
                a.id,
                a.appointment_date,
                a.appointment_type,
                a.status,
                a.notes,
                a.duration_minutes,
                p.name as patient_name,
                p.phone as patient_phone,
                p.email as patient_email,
                p.insurance_provider,
                p.insurance_id,
                b.amount,
                b.insurance_coverage,
                b.status as payment_status
            FROM Appointments a
            JOIN Patients p ON a.patient_id = p.id
            LEFT JOIN BillingRecords b ON a.id = b.appointment_id
            WHERE a.doctor_id = ?
            AND date(a.appointment_date) BETWEEN date(?) AND date(?)
            ORDER BY a.appointment_date ASC
        `, [doctorId, queryStartDate, queryEndDate]);

        // Format the appointments data
        const formattedAppointments = appointments.map(appointment => ({
            ...appointment,
            appointment_date: new Date(appointment.appointment_date).toISOString(),
            formatted_time: new Date(appointment.appointment_date).toLocaleTimeString(),
            payment_info: {
                amount: appointment.amount,
                insurance_coverage: appointment.insurance_coverage,
                status: appointment.payment_status,
                patient_responsibility: appointment.amount - appointment.insurance_coverage
            }
        }));

        // Group appointments by status
        const groupedAppointments = {
            scheduled: formattedAppointments.filter(a => a.status === 'Scheduled'),
            inProgress: formattedAppointments.filter(a => a.status === 'In Progress'),
            completed: formattedAppointments.filter(a => a.status === 'Completed'),
            cancelled: formattedAppointments.filter(a => a.status === 'Cancelled')
        };

        // Get statistics for the date range
        const stats = {
            total_appointments: appointments.length,
            completed_appointments: groupedAppointments.completed.length,
            cancelled_appointments: groupedAppointments.cancelled.length,
            in_progress_appointments: groupedAppointments.inProgress.length,
            scheduled_appointments: groupedAppointments.scheduled.length,
            total_billed: appointments.reduce((sum, a) => sum + (a.amount || 0), 0),
            total_insurance_coverage: appointments.reduce((sum, a) => sum + (a.insurance_coverage || 0), 0),
            total_patient_responsibility: appointments.reduce((sum, a) => 
                sum + ((a.amount || 0) - (a.insurance_coverage || 0)), 0
            )
        };

        // Get doctor's availability for each day in the range
        const availabilityByDate = {};
        let currentDate = new Date(queryStartDate);
        const endDateObj = new Date(queryEndDate);

        while (currentDate <= endDateObj) {
            const dayOfWeek = currentDate.getDay();
            const currentDateStr = currentDate.toISOString().split('T')[0];

            // Get availability for this day
            const availability = await db.get(`
                SELECT *
                FROM DoctorAvailability
                WHERE doctor_id = ? AND day_of_week = ?
            `, [doctorId, dayOfWeek]);

            // Check for time off
            const timeOff = await db.get(`
                SELECT *
                FROM DoctorTimeOff
                WHERE doctor_id = ?
                AND ? BETWEEN start_date AND end_date
            `, [doctorId, currentDateStr]);

            // Calculate available slots for this day
            const availableSlots = [];
            if (availability && !timeOff) {
                const startHour = parseInt(availability.start_time.split(':')[0]);
                const endHour = parseInt(availability.end_time.split(':')[0]);
                const breakStartHour = availability.break_start ? parseInt(availability.break_start.split(':')[0]) : null;
                const breakEndHour = availability.break_end ? parseInt(availability.break_end.split(':')[0]) : null;

                for (let hour = startHour; hour < endHour; hour++) {
                    // Skip break time
                    if (breakStartHour && breakEndHour && hour >= breakStartHour && hour < breakEndHour) {
                        continue;
                    }

                    // Check both :00 and :30 slots
                    ['00', '30'].forEach(minutes => {
                        const timeSlot = `${hour.toString().padStart(2, '0')}:${minutes}`;
                        const existingAppointments = appointments.filter(a => {
                            const appointmentDate = new Date(a.appointment_date);
                            return appointmentDate.toISOString().split('T')[0] === currentDateStr &&
                                   appointmentDate.toTimeString().startsWith(timeSlot) &&
                                   a.status !== 'Cancelled';
                        });

                        if (existingAppointments.length < (availability.max_appointments || 1)) {
                            availableSlots.push(timeSlot);
                        }
                    });
                }
            }

            availabilityByDate[currentDateStr] = {
                availability: availability || null,
                timeOff: timeOff || null,
                availableSlots
            };

            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return res.status(200).json({
            startDate: queryStartDate,
            endDate: queryEndDate,
            appointments: groupedAppointments,
            availabilityByDate,
            stats,
            message: 'Doctor schedule retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching doctor schedule:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
