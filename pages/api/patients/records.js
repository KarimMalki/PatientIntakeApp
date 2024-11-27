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

        // Get patient's basic information
        const patient = await db.get(`
            SELECT 
                id,
                name,
                email,
                phone,
                date_of_birth,
                address,
                insurance_provider,
                insurance_id,
                last_visit,
                status,
                created_at
            FROM Patients
            WHERE id = ?
        `, [patientId]);

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Get medical records
        const medicalRecords = await db.all(`
            SELECT 
                m.*,
                d.name as doctor_name,
                d.specialty as doctor_specialty
            FROM MedicalRecords m
            JOIN Doctors d ON m.doctor_id = d.id
            WHERE m.patient_id = ?
            ORDER BY m.procedure_date DESC
        `, [patientId]);

        // Get treatment plans
        const treatmentPlans = await db.all(`
            SELECT 
                t.*,
                d.name as doctor_name,
                d.specialty as doctor_specialty
            FROM TreatmentPlans t
            JOIN Doctors d ON t.doctor_id = d.id
            WHERE t.patient_id = ?
            ORDER BY t.created_at DESC
        `, [patientId]);

        // Get billing history
        const billingHistory = await db.all(`
            SELECT 
                b.*,
                a.appointment_date,
                a.appointment_type,
                d.name as doctor_name
            FROM BillingRecords b
            JOIN Appointments a ON b.appointment_id = a.id
            JOIN Doctors d ON a.doctor_id = d.id
            WHERE b.patient_id = ?
            ORDER BY b.created_at DESC
        `, [patientId]);

        // Calculate financial summary
        const financialSummary = {
            total_billed: billingHistory.reduce((sum, record) => sum + record.amount, 0),
            total_insurance_coverage: billingHistory.reduce((sum, record) => sum + record.insurance_coverage, 0),
            total_patient_responsibility: billingHistory.reduce((sum, record) => 
                sum + (record.amount - record.insurance_coverage), 0
            ),
            pending_payments: billingHistory
                .filter(record => record.status === 'Pending')
                .reduce((sum, record) => sum + (record.amount - record.insurance_coverage), 0)
        };

        // Get treatment history summary
        const treatmentSummary = {
            total_procedures: medicalRecords.length,
            procedures_by_type: medicalRecords.reduce((acc, record) => {
                acc[record.procedure_type] = (acc[record.procedure_type] || 0) + 1;
                return acc;
            }, {}),
            active_treatment_plans: treatmentPlans.filter(plan => plan.status === 'In Progress').length,
            completed_treatment_plans: treatmentPlans.filter(plan => plan.status === 'Completed').length
        };

        // Format dates for all records
        const formatRecords = (records) => records.map(record => ({
            ...record,
            formatted_date: new Date(record.procedure_date || record.created_at).toLocaleDateString(),
            created_at: new Date(record.created_at).toISOString()
        }));

        return res.status(200).json({
            patient: {
                ...patient,
                date_of_birth: new Date(patient.date_of_birth).toISOString(),
                last_visit: patient.last_visit ? new Date(patient.last_visit).toISOString() : null,
                created_at: new Date(patient.created_at).toISOString()
            },
            records: {
                medical: formatRecords(medicalRecords),
                treatments: formatRecords(treatmentPlans),
                billing: formatRecords(billingHistory)
            },
            summary: {
                financial: financialSummary,
                treatment: treatmentSummary
            },
            message: 'Patient records retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching patient records:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
