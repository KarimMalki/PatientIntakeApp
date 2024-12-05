import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Helper function to format date to time string
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Open the database
        const db = await open({
            filename: './dentist_office.db',
            driver: sqlite3.Database
        });

        // Get all appointments with patient names
        const appointments = await db.all(`
            SELECT 
                a.id,
                a.appointment_date,
                a.appointment_type,
                a.status,
                a.notes,
                p.name as patient_name
            FROM Appointments a
            LEFT JOIN Patients p ON a.patient_id = p.id
            ORDER BY a.appointment_date ASC
        `);

        // Format the appointments
        const formattedAppointments = appointments.map(apt => ({
            id: apt.id,
            appointment_date: apt.appointment_date,
            appointment_type: apt.appointment_type,
            status: apt.status,
            notes: apt.notes || '',
            patient_name: apt.patient_name || 'Unknown Patient'
        }));

        await db.close();
        res.status(200).json(formattedAppointments);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
} 