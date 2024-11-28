import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const db = await open({
            filename: './dentist_office.db',
            driver: sqlite3.Database
        });

        const {
            name,
            email,
            phone,
            date_of_birth,
            address,
            insurance_provider,
            insurance_number: insurance_id // map insurance_number to insurance_id
        } = req.body;

        // Check if email already exists
        const existingPatient = await db.get('SELECT id FROM Patients WHERE email = ?', [email]);
        if (existingPatient) {
            await db.close();
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Insert new patient with primary_doctor_id set to 1 (Dr. Sarah Wilson)
        const result = await db.run(`
            INSERT INTO Patients (
                name,
                email,
                phone,
                date_of_birth,
                address,
                insurance_provider,
                insurance_id,
                primary_doctor_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `, [name, email, phone, date_of_birth, address, insurance_provider, insurance_id]);

        await db.close();

        return res.status(201).json({
            message: 'Patient registered successfully',
            patientId: result.lastID
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
