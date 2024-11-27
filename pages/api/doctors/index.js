import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Open database connection
        const db = await open({
            filename: './dentist_office.db',
            driver: sqlite3.Database
        });

        // Get all active doctors with their availability
        const doctors = await db.all(`
            SELECT 
                d.id,
                d.name,
                d.specialty,
                d.email,
                d.phone,
                d.office_hours,
                GROUP_CONCAT(DISTINCT 
                    json_object(
                        'day', da.day_of_week,
                        'start', da.start_time,
                        'end', da.end_time,
                        'break_start', da.break_start,
                        'break_end', da.break_end
                    )
                ) as availability
            FROM Doctors d
            LEFT JOIN DoctorAvailability da ON d.id = da.doctor_id
            WHERE d.status = 'Active'
            GROUP BY d.id
            ORDER BY d.name
        `);

        // Get upcoming time off for each doctor
        for (let doctor of doctors) {
            const timeOff = await db.all(`
                SELECT start_date, end_date, reason
                FROM DoctorTimeOff
                WHERE doctor_id = ?
                AND end_date >= date('now')
                ORDER BY start_date
            `, [doctor.id]);

            doctor.timeOff = timeOff;

            // Parse the availability string into an array of objects
            if (doctor.availability) {
                try {
                    doctor.availability = doctor.availability
                        .split(',')
                        .map(avail => JSON.parse(avail));
                } catch (e) {
                    doctor.availability = [];
                }
            } else {
                doctor.availability = [];
            }
        }

        return res.status(200).json({ 
            doctors,
            message: 'Doctors retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching doctors:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
