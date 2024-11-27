import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { 
            patientId, 
            doctorId, 
            appointmentDate,
            appointmentTime,
            appointmentType,
            notes 
        } = req.body;

        // Validate required fields
        if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !appointmentType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Open database connection
        const db = await open({
            filename: './dentist_office.db',
            driver: sqlite3.Database
        });

        // First check availability again to prevent double booking
        const datetime = `${appointmentDate} ${appointmentTime}`;
        const dayOfWeek = new Date(appointmentDate).getDay();

        // Check doctor's availability
        const availability = await db.get(`
            SELECT * FROM DoctorAvailability 
            WHERE doctor_id = ? AND day_of_week = ? AND is_available = 1
        `, [doctorId, dayOfWeek]);

        if (!availability) {
            return res.status(400).json({ error: 'Doctor is not available on this day' });
        }

        // Check for time off
        const timeOff = await db.get(`
            SELECT * FROM DoctorTimeOff 
            WHERE doctor_id = ? AND ? BETWEEN start_date AND end_date
        `, [doctorId, appointmentDate]);

        if (timeOff) {
            return res.status(400).json({ error: 'Doctor is on time off during this period' });
        }

        // Check existing appointments
        const existingAppointments = await db.all(`
            SELECT COUNT(*) as count 
            FROM Appointments 
            WHERE doctor_id = ? 
            AND date(appointment_date) = date(?)
            AND time(appointment_date) = time(?)
            AND status != 'Cancelled'
        `, [doctorId, datetime, datetime]);

        if (existingAppointments[0].count >= availability.max_appointments) {
            return res.status(400).json({ error: 'No available slots at this time' });
        }

        // If all checks pass, create the appointment
        const result = await db.run(`
            INSERT INTO Appointments (
                patient_id,
                doctor_id,
                appointment_date,
                appointment_type,
                status,
                notes,
                duration_minutes
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            patientId,
            doctorId,
            datetime,
            appointmentType,
            'Scheduled',
            notes || '',
            30 // Default duration
        ]);

        // Create initial billing record
        let amount = 0;
        switch(appointmentType) {
            case 'Regular Checkup':
                amount = 100;
                break;
            case 'Cleaning':
                amount = 150;
                break;
            case 'Root Canal':
                amount = 800;
                break;
            case 'Filling':
                amount = 200;
                break;
            case 'Crown':
                amount = 1000;
                break;
            case 'Extraction':
                amount = 300;
                break;
            default:
                amount = 100;
        }

        await db.run(`
            INSERT INTO BillingRecords (
                patient_id,
                appointment_id,
                amount,
                insurance_coverage,
                status
            ) VALUES (?, ?, ?, ?, ?)
        `, [
            patientId,
            result.lastID,
            amount,
            amount * 0.7, // Assuming 70% insurance coverage
            'Pending'
        ]);

        // Get the created appointment with additional details
        const appointment = await db.get(`
            SELECT 
                a.*,
                p.name as patient_name,
                d.name as doctor_name,
                d.specialty as doctor_specialty
            FROM Appointments a
            JOIN Patients p ON a.patient_id = p.id
            JOIN Doctors d ON a.doctor_id = d.id
            WHERE a.id = ?
        `, [result.lastID]);

        return res.status(201).json({
            message: 'Appointment booked successfully',
            appointment
        });

    } catch (error) {
        console.error('Error booking appointment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
