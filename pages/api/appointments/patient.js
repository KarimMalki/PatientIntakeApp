import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { patientId } = req.query;

        if (!patientId) {
            return res.status(400).json({ error: 'Patient ID is required' });
        }

        // Open database connection
        const db = await open({
            filename: './dentist_office.db',
            driver: sqlite3.Database
        });

        // Get all appointments for the patient with related information
        const appointments = await db.all(`
            SELECT 
                a.id,
                a.appointment_date,
                a.appointment_type,
                a.status,
                a.notes,
                a.duration_minutes,
                d.name as doctor_name,
                d.specialty as doctor_specialty,
                d.email as doctor_email,
                d.phone as doctor_phone,
                b.amount,
                b.insurance_coverage,
                b.status as payment_status
            FROM Appointments a
            JOIN Doctors d ON a.doctor_id = d.id
            LEFT JOIN BillingRecords b ON a.id = b.appointment_id
            WHERE a.patient_id = ?
            ORDER BY a.appointment_date DESC
        `, [patientId]);

        // Format the appointments data
        const formattedAppointments = appointments.map(appointment => ({
            ...appointment,
            appointment_date: new Date(appointment.appointment_date).toISOString(),
            formatted_date: new Date(appointment.appointment_date).toLocaleDateString(),
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
            upcoming: formattedAppointments.filter(a => 
                new Date(a.appointment_date) > new Date() && 
                a.status !== 'Cancelled'
            ),
            past: formattedAppointments.filter(a => 
                new Date(a.appointment_date) <= new Date() || 
                a.status === 'Cancelled'
            )
        };

        // Get summary statistics
        const stats = {
            total_appointments: appointments.length,
            completed_appointments: appointments.filter(a => a.status === 'Completed').length,
            cancelled_appointments: appointments.filter(a => a.status === 'Cancelled').length,
            upcoming_appointments: groupedAppointments.upcoming.length,
            total_billed: appointments.reduce((sum, a) => sum + (a.amount || 0), 0),
            total_insurance_coverage: appointments.reduce((sum, a) => sum + (a.insurance_coverage || 0), 0),
            total_patient_responsibility: appointments.reduce((sum, a) => 
                sum + ((a.amount || 0) - (a.insurance_coverage || 0)), 0
            )
        };

        return res.status(200).json({
            appointments: groupedAppointments,
            stats,
            message: 'Appointments retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching patient appointments:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
