const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./dentist_office.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
        return;
    }
    console.log('Connected to database successfully');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON', (err) => {
    if (err) {
        console.error('Error enabling foreign keys:', err);
        return;
    }
    console.log('Foreign keys enabled');
});

const setupDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Create Patients table
            db.run(`CREATE TABLE IF NOT EXISTS Patients (
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
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (primary_doctor_id) REFERENCES Doctors(id)
            )`, (err) => {
                if (err) console.error('Error creating Patients table:', err);
            });

            // Create Doctors table
            db.run(`CREATE TABLE IF NOT EXISTS Doctors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                specialty TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT NOT NULL,
                office_hours TEXT,
                status TEXT DEFAULT 'Active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) console.error('Error creating Doctors table:', err);
            });

            // Create DoctorAvailability table
            db.run(`CREATE TABLE IF NOT EXISTS DoctorAvailability (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                doctor_id INTEGER NOT NULL,
                day_of_week INTEGER NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                is_available BOOLEAN DEFAULT 1,
                max_appointments INTEGER DEFAULT 8,
                break_start TIME,
                break_end TIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (doctor_id) REFERENCES Doctors(id),
                UNIQUE(doctor_id, day_of_week)
            )`, (err) => {
                if (err) console.error('Error creating DoctorAvailability table:', err);
            });

            // Create DoctorTimeOff table
            db.run(`CREATE TABLE IF NOT EXISTS DoctorTimeOff (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                doctor_id INTEGER NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                reason TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (doctor_id) REFERENCES Doctors(id)
            )`, (err) => {
                if (err) console.error('Error creating DoctorTimeOff table:', err);
            });

            // Create Appointments table
            db.run(`CREATE TABLE IF NOT EXISTS Appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER,
                doctor_id INTEGER,
                appointment_date DATETIME NOT NULL,
                appointment_type TEXT NOT NULL,
                duration_minutes INTEGER DEFAULT 30,
                status TEXT NOT NULL,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES Patients(id),
                FOREIGN KEY (doctor_id) REFERENCES Doctors(id)
            )`, (err) => {
                if (err) console.error('Error creating Appointments table:', err);
            });

            // Create Medical Records table
            db.run(`CREATE TABLE IF NOT EXISTS MedicalRecords (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER,
                doctor_id INTEGER,
                procedure_type TEXT NOT NULL,
                procedure_date DATE NOT NULL,
                diagnosis TEXT,
                treatment TEXT,
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES Patients(id),
                FOREIGN KEY (doctor_id) REFERENCES Doctors(id)
            )`, (err) => {
                if (err) console.error('Error creating MedicalRecords table:', err);
            });

            // Create Treatment Plans table
            db.run(`CREATE TABLE IF NOT EXISTS TreatmentPlans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER,
                doctor_id INTEGER,
                plan_name TEXT NOT NULL,
                start_date DATE,
                end_date DATE,
                status TEXT DEFAULT 'Pending',
                notes TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES Patients(id),
                FOREIGN KEY (doctor_id) REFERENCES Doctors(id)
            )`, (err) => {
                if (err) console.error('Error creating TreatmentPlans table:', err);
            });

            // Create Billing Records table
            db.run(`CREATE TABLE IF NOT EXISTS BillingRecords (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER,
                appointment_id INTEGER,
                amount DECIMAL(10,2) NOT NULL,
                insurance_coverage DECIMAL(10,2),
                status TEXT DEFAULT 'Pending',
                payment_date DATE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES Patients(id),
                FOREIGN KEY (appointment_id) REFERENCES Appointments(id)
            )`, (err) => {
                if (err) console.error('Error creating BillingRecords table:', err);
            });

            // Insert sample doctors
            const doctors = [
                ['Dr. Sarah Wilson', 'General Dentistry', 'sarah.wilson@dental.com', '555-0101', '9:00 AM - 5:00 PM'],
                ['Dr. Michael Chen', 'Orthodontics', 'michael.chen@dental.com', '555-0102', '9:00 AM - 5:00 PM'],
                ['Dr. Emily Brown', 'Periodontics', 'emily.brown@dental.com', '555-0103', '10:00 AM - 6:00 PM'],
                ['Dr. James Taylor', 'Endodontics', 'james.taylor@dental.com', '555-0104', '8:00 AM - 4:00 PM'],
                ['Dr. Lisa Anderson', 'Pediatric Dentistry', 'lisa.anderson@dental.com', '555-0105', '9:00 AM - 5:00 PM']
            ];

            const insertDoctor = db.prepare('INSERT OR IGNORE INTO Doctors (name, specialty, email, phone, office_hours) VALUES (?, ?, ?, ?, ?)');
            doctors.forEach(doctor => {
                insertDoctor.run(doctor, (err) => {
                    if (err) console.error('Error inserting doctor:', err);
                });
            });
            insertDoctor.finalize();

            // Insert doctor availability for Dr. Sarah Wilson (ID: 1)
            const drWilsonAvailability = [
                // Monday = 1, Sunday = 0
                [1, 1, '09:00', '17:00', 1, 8, '12:00', '13:00'], // Monday
                [1, 2, '09:00', '17:00', 1, 8, '12:00', '13:00'], // Tuesday
                [1, 3, '09:00', '17:00', 1, 8, '12:00', '13:00'], // Wednesday
                [1, 4, '09:00', '17:00', 1, 8, '12:00', '13:00'], // Thursday
                [1, 5, '09:00', '17:00', 1, 8, '12:00', '13:00']  // Friday
            ];

            const insertAvailability = db.prepare(`
                INSERT OR IGNORE INTO DoctorAvailability 
                (doctor_id, day_of_week, start_time, end_time, is_available, max_appointments, break_start, break_end)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            drWilsonAvailability.forEach(day => {
                insertAvailability.run(day, (err) => {
                    if (err) console.error('Error inserting doctor availability:', err);
                });
            });
            insertAvailability.finalize();

            // Insert sample patients
            const patients = [
                {
                    name: 'Emma Thompson',
                    email: 'emma.thompson@email.com',
                    phone: '555-1001',
                    dob: '1985-03-15',
                    address: '123 Oak Street, Springfield',
                    insurance: 'HealthFirst',
                    insuranceId: 'HF789012',
                    lastVisit: '2024-01-15'
                },
                {
                    name: 'James Rodriguez',
                    email: 'james.r@email.com',
                    phone: '555-1002',
                    dob: '1990-07-22',
                    address: '456 Maple Ave, Springfield',
                    insurance: 'DentalPlus',
                    insuranceId: 'DP456789',
                    lastVisit: '2024-01-10'
                }
            ];

            const insertPatient = db.prepare(`
                INSERT OR IGNORE INTO Patients 
                (name, email, phone, date_of_birth, address, insurance_provider, insurance_id, last_visit, primary_doctor_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
            `);

            patients.forEach(patient => {
                insertPatient.run([
                    patient.name,
                    patient.email,
                    patient.phone,
                    patient.dob,
                    patient.address,
                    patient.insurance,
                    patient.insuranceId,
                    patient.lastVisit
                ], (err) => {
                    if (err) console.error('Error inserting patient:', err);
                });
            });
            insertPatient.finalize();

            // Insert sample appointments
            const appointmentTypes = [
                'Regular Checkup',
                'Cleaning',
                'Root Canal',
                'Filling'
            ];

            const appointmentStatuses = ['Scheduled', 'Completed', 'Cancelled'];

            // Insert a sample appointment for each patient
            patients.forEach((_, patientIndex) => {
                const patientId = patientIndex + 1;
                const doctorId = Math.floor(Math.random() * doctors.length) + 1;
                const appointmentType = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
                const status = appointmentStatuses[Math.floor(Math.random() * appointmentStatuses.length)];
                
                db.run(`
                    INSERT OR IGNORE INTO Appointments 
                    (patient_id, doctor_id, appointment_date, appointment_type, status)
                    VALUES (?, ?, datetime('now', '+' || ? || ' days'), ?, ?)
                `, [
                    patientId,
                    doctorId,
                    Math.floor(Math.random() * 30), // Random day in the next 30 days
                    appointmentType,
                    status
                ], (err) => {
                    if (err) console.error('Error inserting appointment:', err);
                });
            });

            console.log('Database setup and sample data insertion complete.');
            resolve();
        });
    });
};

// Run setup and properly close database
setupDatabase()
    .then(() => {
        console.log('Setup completed successfully');
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
                process.exit(1);
            }
            console.log('Database closed successfully');
            process.exit(0);
        });
    })
    .catch(err => {
        console.error('Setup failed:', err);
        db.close((closeErr) => {
            if (closeErr) console.error('Error closing database:', closeErr);
            process.exit(1);
        });
    });
