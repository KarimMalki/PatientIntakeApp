import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserInjured, FaCalendarAlt, FaSearch, FaSpinner } from 'react-icons/fa';

export default function PatientView() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPatientList, setShowPatientList] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (showPatientList) {
            fetchPatients();
        }
    }, [showPatientList]);

    const fetchPatients = async () => {
        try {
            const response = await fetch('/api/patients/list');
            const data = await response.json();
            if (data.patients) {
                setPatients(data.patients);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            setError('Failed to load patients. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePatientClick = (patientId) => {
        router.push(`/patientdashboard?id=${patientId}`);
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-black mb-6">Patient Portal</h2>
                
                <div className="grid gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-black">New Patient?</h3>
                        <p className="text-gray-600 mb-4">Create your account to start booking appointments and managing your dental care.</p>
                        <button 
                            onClick={() => router.push('/signup')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-black">Existing Patients</h3>
                        <p className="text-gray-600 mb-4">View your appointments, medical history, and manage your dental care.</p>
                        <button 
                            onClick={() => setShowPatientList(!showPatientList)}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                        >
                            {showPatientList ? 'Hide Patient List' : 'View Patients'}
                        </button>

                        <AnimatePresence>
                            {showPatientList && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-6"
                                >
                                    {isLoading ? (
                                        <div className="flex justify-center py-8">
                                            <FaSpinner className="text-2xl text-blue-500 animate-spin" />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Search patients..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                {filteredPatients.map((patient) => (
                                                    <motion.button
                                                        key={patient.id}
                                                        onClick={() => handlePatientClick(patient.id)}
                                                        className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-200"
                                                        whileHover={{ x: 4 }}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                                                                <p className="text-sm text-gray-600">Last Visit: {patient.last_visit}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm text-gray-600">Next Appointment:</p>
                                                                <p className="text-sm font-medium text-blue-600">
                                                                    {patient.next_appointment}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.button>
                                                ))}

                                                {filteredPatients.length === 0 && (
                                                    <div className="text-center py-4 text-gray-500">
                                                        No patients found matching your search.
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
