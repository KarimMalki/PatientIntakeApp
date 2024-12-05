const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const { faker } = require('@faker-js/faker');

async function generateDemoData() {
    try {
        // Open database connection
        const db = await open({
            filename: './dentist_office.db',
            driver: sqlite3.Database
        });

        // Enable foreign keys
        await db.run('PRAGMA foreign_keys = ON');

        // First, delete existing patient-related data
        console.log('Deleting existing patient data...');
        await db.run('DELETE FROM BillingRecords');
        await db.run('DELETE FROM MedicalRecords');
        await db.run('DELETE FROM TreatmentPlans');
        await db.run('DELETE FROM Appointments');
        await db.run('DELETE FROM Patients');

        // Reset autoincrement counters
        await db.run('DELETE FROM sqlite_sequence WHERE name IN ("Patients", "Appointments", "MedicalRecords", "TreatmentPlans", "BillingRecords")');

        const procedureTypes = [
            'Regular Checkup',
            'Dental Cleaning',
            'Root Canal',
            'Cavity Filling',
            'Crown Placement',
            'Tooth Extraction',
            'Dental Implant',
            'Teeth Whitening',
            'Dental Bridge',
            'Gum Treatment'
        ];

        const treatmentPlanTypes = [
            'Orthodontic Treatment',
            'Full Mouth Reconstruction',
            'Periodontal Treatment',
            'Cosmetic Dentistry Plan',
            'Preventive Care Plan',
            'Root Canal Therapy',
            'Implant Restoration',
            'Crown and Bridge Work',
            'Denture Treatment',
            'Smile Makeover Plan'
        ];

        const insuranceProviders = [
            'DeltaDental',
            'Cigna Dental',
            'MetLife',
            'Aetna',
            'Guardian',
            'United Healthcare',
            'Humana',
            'Principal',
            'Blue Cross Dental'
        ];

        // Generate 100 patients
        console.log('Generating 100 patients...');
        for (let i = 0; i < 100; i++) {
            // Insert patient
            const patient = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.phone.number('###-###-####'),
                date_of_birth: faker.date.between({ from: '1950-01-01', to: '2005-12-31' }).toISOString().split('T')[0],
                address: faker.location.streetAddress(true),
                insurance_provider: faker.helpers.arrayElement(insuranceProviders),
                insurance_id: faker.string.alphanumeric(8).toUpperCase(),
                primary_doctor_id: 1  // Dr. Sarah Wilson
            };

            const patientResult = await db.run(`
                INSERT INTO Patients (
                    name, email, phone, date_of_birth, address, 
                    insurance_provider, insurance_id, primary_doctor_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                patient.name, patient.email, patient.phone, patient.date_of_birth,
                patient.address, patient.insurance_provider, patient.insurance_id,
                patient.primary_doctor_id
            ]);

            const patientId = patientResult.lastID;

            // Generate 2-5 medical records for each patient (past records)
            const numMedicalRecords = faker.number.int({ min: 2, max: 5 });
            for (let j = 0; j < numMedicalRecords; j++) {
                const procedureDate = faker.date.between({
                    from: '2023-01-01',
                    to: '2024-02-29'
                }).toISOString().split('T')[0];

                await db.run(`
                    INSERT INTO MedicalRecords (
                        patient_id, doctor_id, procedure_type, procedure_date,
                        diagnosis, treatment, notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    patientId,
                    1, // Dr. Sarah Wilson
                    faker.helpers.arrayElement(procedureTypes),
                    procedureDate,
                    faker.lorem.sentence(),
                    faker.lorem.sentence(),
                    faker.lorem.paragraph()
                ]);
            }

            // Generate 1-2 treatment plans for each patient
            const numTreatmentPlans = faker.number.int({ min: 1, max: 2 });
            for (let j = 0; j < numTreatmentPlans; j++) {
                const startDate = faker.date.between({
                    from: '2023-06-01',
                    to: '2024-02-29'
                }).toISOString().split('T')[0];

                const status = faker.helpers.arrayElement(['Pending', 'In Progress', 'Completed']);
                const endDate = status === 'Completed' 
                    ? faker.date.between({
                        from: startDate,
                        to: '2024-02-29'
                    }).toISOString().split('T')[0]
                    : null;

                await db.run(`
                    INSERT INTO TreatmentPlans (
                        patient_id, doctor_id, plan_name, start_date,
                        end_date, status, notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    patientId,
                    1, // Dr. Sarah Wilson
                    faker.helpers.arrayElement(treatmentPlanTypes),
                    startDate,
                    endDate,
                    status,
                    faker.lorem.paragraph()
                ]);
            }

            // Generate both past and future appointments for each patient
            const numPastAppointments = faker.number.int({ min: 1, max: 3 });
            const numFutureAppointments = faker.number.int({ min: 1, max: 2 });

            // Past appointments
            for (let j = 0; j < numPastAppointments; j++) {
                const appointmentDate = faker.date.between({
                    from: '2023-06-01',
                    to: '2024-02-29'
                });

                const appointmentResult = await db.run(`
                    INSERT INTO Appointments (
                        patient_id, doctor_id, appointment_date,
                        appointment_type, status, notes
                    ) VALUES (?, ?, ?, ?, ?, ?)
                `, [
                    patientId,
                    1, // Dr. Sarah Wilson
                    appointmentDate.toISOString(),
                    faker.helpers.arrayElement(procedureTypes),
                    'Completed',
                    faker.lorem.sentence()
                ]);

                // Generate billing record for completed appointments
                const amount = faker.number.float({ min: 100, max: 2000, precision: 2 });
                const insuranceCoverage = amount * faker.number.float({ min: 0.5, max: 0.9, precision: 2 });

                await db.run(`
                    INSERT INTO BillingRecords (
                        patient_id, appointment_id, amount,
                        insurance_coverage, status, payment_date
                    ) VALUES (?, ?, ?, ?, ?, ?)
                `, [
                    patientId,
                    appointmentResult.lastID,
                    amount,
                    insuranceCoverage,
                    'Paid',
                    appointmentDate.toISOString().split('T')[0]
                ]);
            }

            // Future appointments
            for (let j = 0; j < numFutureAppointments; j++) {
                const appointmentDate = faker.date.between({
                    from: '2024-03-01',
                    to: '2024-12-31'
                });

                const appointmentResult = await db.run(`
                    INSERT INTO Appointments (
                        patient_id, doctor_id, appointment_date,
                        appointment_type, status, notes
                    ) VALUES (?, ?, ?, ?, ?, ?)
                `, [
                    patientId,
                    1, // Dr. Sarah Wilson
                    appointmentDate.toISOString(),
                    faker.helpers.arrayElement(procedureTypes),
                    'Scheduled',
                    faker.lorem.sentence()
                ]);

                // Generate pending billing record for future appointments
                const amount = faker.number.float({ min: 100, max: 2000, precision: 2 });
                const insuranceCoverage = amount * faker.number.float({ min: 0.5, max: 0.9, precision: 2 });

                await db.run(`
                    INSERT INTO BillingRecords (
                        patient_id, appointment_id, amount,
                        insurance_coverage, status
                    ) VALUES (?, ?, ?, ?, ?)
                `, [
                    patientId,
                    appointmentResult.lastID,
                    amount,
                    insuranceCoverage,
                    'Pending'
                ]);
            }
        }

        console.log('Demo data generation complete!');
        await db.close();

    } catch (error) {
        console.error('Error generating demo data:', error);
        process.exit(1);
    }
}

generateDemoData(); 