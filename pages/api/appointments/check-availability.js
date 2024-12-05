import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Helper function to convert JavaScript day (0-6, Sunday = 0) to database day (1-7, Monday = 1, Sunday = 7)
function convertToDatabaseDay(jsDay) {
    return jsDay === 0 ? 7 : jsDay;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { doctorId, date, time } = req.body;
        console.log('Received request:', { doctorId, date, time });

        // Validate required fields
        if (!doctorId || !date || !time) {
            console.log('Missing required fields:', { doctorId, date, time });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Open database connection
        const db = await open({
            filename: './dentist_office.db',
            driver: sqlite3.Database
        });

        // Get the day of week and convert it to database format
        const jsDay = new Date(date).getDay();
        const dbDay = convertToDatabaseDay(jsDay);
        console.log('Day conversion:', { jsDay, dbDay, date });

        // Check doctor's regular availability
        const availability = await db.get(`
            SELECT * FROM DoctorAvailability 
            WHERE doctor_id = ? AND day_of_week = ? AND is_available = 1
        `, [doctorId, dbDay]);

        console.log('Doctor availability from DB:', availability);

        if (!availability) {
            console.log('No availability found for day:', dbDay);
            return res.status(200).json({ 
                available: false, 
                reason: 'Doctor is not available on this day' 
            });
        }

        // Convert time strings to minutes for comparison
        const timeToMinutes = (timeStr) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const requestedTime = timeToMinutes(time);
        const startTime = timeToMinutes(availability.start_time);
        const endTime = timeToMinutes(availability.end_time);
        const breakStart = availability.break_start ? timeToMinutes(availability.break_start) : null;
        const breakEnd = availability.break_end ? timeToMinutes(availability.break_end) : null;

        console.log('Time comparisons (in minutes):', {
            requested: requestedTime,
            start: startTime,
            end: endTime,
            breakStart,
            breakEnd,
            originalTime: time,
            startTime: availability.start_time,
            endTime: availability.end_time
        });

        // Check if time is within working hours
        if (requestedTime < startTime || requestedTime >= endTime) {
            console.log('Time outside working hours:', {
                requestedTime,
                startTime,
                endTime
            });
            return res.status(200).json({ 
                available: false, 
                reason: 'Requested time is outside doctor\'s working hours' 
            });
        }

        // Check if time is during break
        if (breakStart && breakEnd && requestedTime >= breakStart && requestedTime < breakEnd) {
            console.log('Time during break:', {
                requestedTime,
                breakStart,
                breakEnd
            });
            return res.status(200).json({ 
                available: false, 
                reason: 'Requested time is during doctor\'s break' 
            });
        }

        // Check for time off
        const timeOff = await db.get(`
            SELECT * FROM DoctorTimeOff 
            WHERE doctor_id = ? AND ? BETWEEN start_date AND end_date
        `, [doctorId, date]);

        if (timeOff) {
            console.log('Doctor has time off:', timeOff);
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

        console.log('Existing appointments:', existingAppointments);

        if (existingAppointments[0].count >= availability.max_appointments) {
            console.log('No slots available:', {
                count: existingAppointments[0].count,
                max: availability.max_appointments
            });
            return res.status(200).json({ 
                available: false, 
                reason: 'No available slots at this time' 
            });
        }

        // If all checks pass, return available
        console.log('Slot is available');
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
