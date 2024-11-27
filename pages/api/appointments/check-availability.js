import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Helper function to check if time is within doctor's available hours
function isTimeWithinHours(time, startTime, endTime, breakStart, breakEnd) {
    const timeHour = parseInt(time.split(':')[0]);
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const breakStartHour = breakStart ? parseInt(breakStart.split(':')[0]) : null;
    const breakEndHour = breakEnd ? parseInt(breakEnd.split(':')[0]) : null;

    // Check if time is within working hours
    if (timeHour < startHour || timeHour >= endHour) return false;

    // Check if time is during break
    if (breakStartHour && breakEndHour) {
        if (timeHour >= breakStartHour && timeHour < breakEndHour) return false;
    }

    return true;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { doctorId, date, time } = req.body;

        // Validate required fields
        if (!doctorId || !date || !time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Open database connection
        const db = await open({
            filename: './dentist_office.db',
            driver: sqlite3.Database
        });

        // Get the day of week (0-6) from the date
        const dayOfWeek = new Date(date).getDay();

        // Check doctor's regular availability
        const availability = await db.get(`
            SELECT * FROM DoctorAvailability 
            WHERE doctor_id = ? AND day_of_week = ? AND is_available = 1
        `, [doctorId, dayOfWeek]);

        if (!availability) {
            return res.status(200).json({ 
                available: false, 
                reason: 'Doctor is not available on this day' 
            });
        }

        // Check if the requested time is within doctor's hours
        if (!isTimeWithinHours(time, availability.start_time, availability.end_time, 
            availability.break_start, availability.break_end)) {
            return res.status(200).json({ 
                available: false, 
                reason: 'Requested time is outside doctor\'s working hours or during break' 
            });
        }

        // Check for time off
        const timeOff = await db.get(`
            SELECT * FROM DoctorTimeOff 
            WHERE doctor_id = ? AND ? BETWEEN start_date AND end_date
        `, [doctorId, date]);

        if (timeOff) {
            return res.status(200).json({ 
                available: false, 
                reason: 'Doctor is on time off during this period' 
            });
        }

        // Check existing appointments for the requested time slot
        const existingAppointments = await db.all(`
            SELECT COUNT(*) as count 
            FROM Appointments 
            WHERE doctor_id = ? 
            AND date(appointment_date) = date(?)
            AND time(appointment_date) = time(?)
            AND status != 'Cancelled'
        `, [doctorId, date, time]);

        if (existingAppointments[0].count >= availability.max_appointments) {
            return res.status(200).json({ 
                available: false, 
                reason: 'No available slots at this time' 
            });
        }

        // If all checks pass, return available
        return res.status(200).json({ 
            available: true,
            availability: {
                startTime: availability.start_time,
                endTime: availability.end_time,
                breakStart: availability.break_start,
                breakEnd: availability.break_end,
                maxAppointments: availability.max_appointments
            }
        });

    } catch (error) {
        console.error('Error checking availability:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
