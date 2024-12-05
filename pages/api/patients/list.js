import { query } from '../../../utils/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get all active patients with their latest appointment and assigned doctor
        const patients = await query(`
            SELECT 
                p.id,
                p.name,
                p.email,
                p.phone,
                p.insurance_provider,
                p.last_visit,
                (
                    SELECT a.appointment_date
                    FROM Appointments a
                    WHERE a.patient_id = p.id
                    AND a.status = 'Scheduled'
                    AND a.appointment_date > datetime('now')
                    ORDER BY a.appointment_date ASC
                    LIMIT 1
                ) as next_appointment,
                (
                    SELECT d.name
                    FROM Appointments a
                    JOIN Doctors d ON a.doctor_id = d.id
                    WHERE a.patient_id = p.id
                    ORDER BY a.appointment_date DESC
                    LIMIT 1
                ) as last_doctor,
                (
                    SELECT COUNT(*)
                    FROM Appointments
                    WHERE patient_id = p.id
                ) as total_visits,
                (
                    SELECT status
                    FROM TreatmentPlans
                    WHERE patient_id = p.id
                    AND status = 'In Progress'
                    LIMIT 1
                ) as has_active_treatment
            FROM Patients p
            WHERE p.status = 'Active'
            ORDER BY p.name ASC
        `);

        // Format the patient data
        const formattedPatients = patients.map(patient => ({
            ...patient,
            last_visit: patient.last_visit ? new Date(patient.last_visit).toLocaleDateString() : 'Never',
            next_appointment: patient.next_appointment ? new Date(patient.next_appointment).toLocaleDateString() : 'None Scheduled',
            treatment_status: patient.has_active_treatment ? 'Active Treatment' : 'No Active Treatment'
        }));

        // Get some basic statistics
        const stats = {
            total_patients: patients.length,
            patients_with_appointments: patients.filter(p => p.next_appointment).length,
            patients_in_treatment: patients.filter(p => p.has_active_treatment).length,
            patients_by_insurance: patients.reduce((acc, patient) => {
                acc[patient.insurance_provider] = (acc[patient.insurance_provider] || 0) + 1;
                return acc;
            }, {})
        };

        return res.status(200).json({
            patients: formattedPatients,
            stats,
            message: 'Patients retrieved successfully'
        });

    } catch (error) {
        console.error('Error fetching patients:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
