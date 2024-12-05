require('dotenv').config({ path: '.env.local' });
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { createClient } = require('@libsql/client');

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});

async function createTables() {
    try {
        // Create Patients table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS Patients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT NOT NULL,
                date_of_birth DATE NOT NULL,
                address TEXT,
                insurance_provider TEXT,
                insurance_id TEXT,
                last_visit DATE,
                status TEXT DEFAULT 'Active',
                primary_doctor_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created Patients table');

        // Create Doctors table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS Doctors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                specialty TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT NOT NULL,
                office_hours TEXT,
                status TEXT DEFAULT 'Active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created Doctors table');

        // Create Appointments table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS Appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER,
                doctor_id INTEGER,
                appointment_date DATETIME NOT NULL,
                appointment_type TEXT NOT NULL,
                duration_minutes INTEGER DEFAULT 30,
                status TEXT NOT NULL,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created Appointments table');

        // Create MedicalRecords table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS MedicalRecords (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER,
                doctor_id INTEGER,
                procedure_type TEXT NOT NULL,
                procedure_date DATE NOT NULL,
                diagnosis TEXT,
                treatment TEXT,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created MedicalRecords table');

        // Create TreatmentPlans table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS TreatmentPlans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER,
                doctor_id INTEGER,
                plan_name TEXT NOT NULL,
                start_date DATE,
                end_date DATE,
                status TEXT DEFAULT 'Pending',
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created TreatmentPlans table');

        // Open local SQLite database
        const localDb = await open({
            filename: './dentist_office.db',
            driver: sqlite3.Database
        });

        // Migrate data from each table
        const tables = ['Patients', 'Doctors', 'Appointments', 'MedicalRecords', 'TreatmentPlans'];
        
        for (const tableName of tables) {
            console.log(`Migrating data for ${tableName}...`);
            const rows = await localDb.all(`SELECT * FROM ${tableName}`);
            
            for (const row of rows) {
                const columns = Object.keys(row).join(', ');
                const placeholders = Object.keys(row).map(() => '?').join(', ');
                const values = Object.values(row);
                
                try {
                    await client.execute({
                        sql: `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
                        args: values
                    });
                } catch (err) {
                    console.error(`Error inserting into ${tableName}:`, err);
                }
            }
            
            console.log(`Migrated ${rows.length} rows for ${tableName}`);
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

createTables(); 