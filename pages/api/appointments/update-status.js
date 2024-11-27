import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { appointmentId, status, reason, newDateTime } = req.body;

        if (!appointmentId || !status) {
            return res.status(400).json({ error: 'Appointment ID and new status are required' });
        }

        // Open database connection
        const db = await open({
            filename: './dentist_office.db',
            driver: sqlite3.Database
        });

        // Get current appointment details
        const currentAppointment = await db.get(`
            SELECT * FROM Appointments WHERE id = ?
        `, [appointmentId]);

        if (!currentAppointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Start a transaction
        await db.run('BEGIN TRANSACTION');

        try {
            if (status === 'Rescheduled' && newDateTime) {
                // Validate new datetime availability
                const newDate = new Date(newDateTime);
                const dayOfWeek = newDate.getDay();
                const time = newDate.toTimeString().split(' ')[0].slice(0, 5);

                // Check doctor's availability
                const availability = await db.get(`
                    SELECT * FROM DoctorAvailability 
                    WHERE doctor_id = ? AND day_of_week = ? AND is_available = 1
                `, [currentAppointment.doctor_id, dayOfWeek]);

                if (!availability) {
                    throw new Error('Doctor is not available on the selected day');
                }

                // Check for time off
                const timeOff = await db.get(`
                    SELECT * FROM DoctorTimeOff 
                    WHERE doctor_id = ? AND ? BETWEEN start_date AND end_date
                `, [currentAppointment.doctor_id, newDate.toISOString().split('T')[0]]);

                if (timeOff) {
                    throw new Error('Doctor is on time off during the selected date');
                }

                // Check existing appointments
                const existingAppointments = await db.get(`
                    SELECT COUNT(*) as count 
                    FROM Appointments 
                    WHERE doctor_id = ? 
                    AND date(appointment_date) = date(?)
                    AND time(appointment_date) = time(?)
                    AND status != 'Cancelled'
                    AND id != ?
                `, [currentAppointment.doctor_id, newDateTime, time, appointmentId]);

                if (existingAppointments.count >= (availability.max_appointments || 1)) {
                    throw new Error('Selected time slot is no longer available');
                }

                // Update appointment with new datetime and status
                await db.run(`
                    UPDATE Appointments 
                    SET appointment_date = ?,
                        status = ?,
                        notes = CASE 
                            WHEN notes IS NULL OR notes = '' THEN ?
                            ELSE notes || '\n' || ?
                        END
                    WHERE id = ?
                `, [
                    newDateTime,
                    status,
                    `Rescheduled: ${reason || 'No reason provided'}`,
                    `Rescheduled: ${reason || 'No reason provided'}`,
                    appointmentId
                ]);
            } else {
                // Simply update the status
                await db.run(`
                    UPDATE Appointments 
                    SET status = ?,
                        notes = CASE 
                            WHEN notes IS NULL OR notes = '' THEN ?
                            ELSE notes || '\n' || ?
                        END
                    WHERE id = ?
                `, [
                    status,
                    `Status changed to ${status}: ${reason || 'No reason provided'}`,
                    `Status changed to ${status}: ${reason || 'No reason provided'}`,
                    appointmentId
                ]);
            }

            // If cancelled, update billing record
            if (status === 'Cancelled') {
                await db.run(`
                    UPDATE BillingRecords 
                    SET status = 'Cancelled'
                    WHERE appointment_id = ?
                `, [appointmentId]);
            }

            // Commit the transaction
            await db.run('COMMIT');

            // Get updated appointment details
            const updatedAppointment = await db.get(`
                SELECT 
                    a.*,
                    d.name as doctor_name,
                    p.name as patient_name,
                    b.status as payment_status
                FROM Appointments a
                JOIN Doctors d ON a.doctor_id = d.id
                JOIN Patients p ON a.patient_id = p.id
                LEFT JOIN BillingRecords b ON a.id = b.appointment_id
                WHERE a.id = ?
            `, [appointmentId]);

            return res.status(200).json({
                message: `Appointment ${status.toLowerCase()} successfully`,
                appointment: updatedAppointment
            });

        } catch (error) {
            // Rollback transaction on error
            await db.run('ROLLBACK');
            throw error;
        }

    } catch (error) {
        console.error('Error updating appointment:', error);
        return res.status(500).json({ 
            error: 'Failed to update appointment',
            details: error.message 
        });
    }
}
