import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { doctorId, date } = req.query;

        if (!doctorId) {
            return res.status(400).json({ error: 'Doctor ID is required' });
        }

        // Open database connection
        const db = await open({
            filename: './dentist_office.db',
            driver: sqlite3.Database
        });

        // Get doctor's availability for the specified date or current date
        const queryDate = date || new Date().toISOString().split('T')[0];
        const dayOfWeek = new Date(queryDate).getDay();

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
        `, [doctorId, queryDate]);

        // Get all appointments for the doctor on the specified date
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
            AND date(a.appointment_date) = date(?)
            ORDER BY a.appointment_date ASC
        `, [doctorId, queryDate]);

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

        // Get daily statistics
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

        // Get next available slots
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
                    const existingAppointments = appointments.filter(a => 
                        new Date(a.appointment_date).toTimeString().startsWith(timeSlot) &&
                        a.status !== 'Cancelled'
                    );

                    if (existingAppointments.length < (availability.max_appointments || 1)) {
                        availableSlots.push(timeSlot);
                    }
                });
            }
        }

        return res.status(200).json({
            date: queryDate,
            availability: availability || null,
            timeOff: timeOff || null,
            appointments: groupedAppointments,
            availableSlots,
            stats,
            message: 'Doctor schedule retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching doctor schedule:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
