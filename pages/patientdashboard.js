import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaCalendarAlt, FaUserMd, FaTooth, FaFileAlt, FaBell, FaCreditCard, FaSpinner } from 'react-icons/fa';

export default function PatientDashboard() {
    const router = useRouter();
    const { id: patientId } = router.query;
    
    const [activeTab, setActiveTab] = useState('overview');
    const [slideDirection, setSlideDirection] = useState('right');
    const [showNotification, setShowNotification] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [patientData, setPatientData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [records, setRecords] = useState(null);

    useEffect(() => {
        if (!patientId) return;
        fetchPatientData();
    }, [patientId]);

    const fetchPatientData = async () => {
        try {
            setIsLoading(true);
            setError('');

            // Fetch patient records
            const recordsResponse = await fetch(`/api/patients/records?patientId=${patientId}`);
            const recordsData = await recordsResponse.json();

            if (!recordsResponse.ok) throw new Error(recordsData.error);

            // Fetch patient appointments
            const appointmentsResponse = await fetch(`/api/appointments/patient?patientId=${patientId}`);
            const appointmentsData = await appointmentsResponse.json();

            if (!appointmentsResponse.ok) throw new Error(appointmentsData.error);

            setPatientData({
                ...recordsData.patient,
                nextAppointment: appointmentsData.appointments.upcoming[0]?.appointment_date,
                balance: `$${recordsData.summary.financial.pending_payments.toFixed(2)}`,
                treatmentPlan: recordsData.records.treatments.find(t => t.status === 'In Progress')?.plan_name || 'No active treatment'
            });

            setAppointments({
                upcoming: appointmentsData.appointments.upcoming,
                past: appointmentsData.appointments.past
            });

            setRecords({
                medical: recordsData.records.medical,
                treatments: recordsData.records.treatments,
                billing: recordsData.records.billing,
                summary: recordsData.summary
            });

        } catch (error) {
            console.error('Error fetching patient data:', error);
            setError('Failed to load patient data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="text-5xl text-gray-700 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error || !patientData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-200 via-white to-gray-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <p className="text-red-700">{error || 'Failed to load patient data'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        switch(activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {showNotification && patientData.nextAppointment && (
                            <div className="bg-gray-100/90 backdrop-blur-sm border-l-4 border-gray-600 p-4 mb-6 transform hover:scale-[1.01] transition-all duration-300 border-[1px] border-black/25 rounded-r-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FaBell className="text-gray-800 mr-2 animate-bounce" />
                                        <p className="text-gray-900">
                                            Next appointment: {new Date(patientData.nextAppointment).toLocaleString()}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setShowNotification(false)}
                                        className="text-gray-700 hover:text-gray-900 transform hover:scale-110 transition-all duration-300"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/85 backdrop-blur-sm rounded-xl shadow-md p-6 border-[1px] border-black/25 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:border-black/40">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Next Appointment</h3>
                                    <FaCalendarAlt className="text-gray-700 animate-pulse" />
                                </div>
                                <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 text-transparent bg-clip-text">
                                    {patientData.nextAppointment ? 
                                        new Date(patientData.nextAppointment).toLocaleString() : 
                                        'No upcoming appointments'}
                                </p>
                            </div>

                            <div className="bg-white/85 backdrop-blur-sm rounded-xl shadow-md p-6 border-[1px] border-black/25 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:border-black/40">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Treatment Plan</h3>
                                    <FaTooth className="text-gray-700 animate-pulse" />
                                </div>
                                <p className="text-gray-800">{patientData.treatmentPlan}</p>
                            </div>

                            <div className="bg-white/85 backdrop-blur-sm rounded-xl shadow-md p-6 border-[1px] border-black/25 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:border-black/40">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Balance</h3>
                                    <FaCreditCard className="text-gray-700 animate-pulse" />
                                </div>
                                <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 text-transparent bg-clip-text">{patientData.balance}</p>
                            </div>
                        </div>

                        <div className="bg-white/85 backdrop-blur-sm rounded-xl shadow-md p-6 border-[1px] border-black/25 hover:shadow-xl transition-all duration-300">
                            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-gray-800 to-gray-900 text-transparent bg-clip-text">Recent Activity</h3>
                            <div className="space-y-4">
                                {appointments.upcoming.slice(0, 2).map(appointment => (
                                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-100/80 backdrop-blur-sm rounded-lg transform hover:scale-[1.01] transition-all duration-300 hover:shadow-md border-[1px] border-black/25 hover:border-black/40">
                                        <div>
                                            <p className="font-semibold text-gray-900">{appointment.doctor_name}</p>
                                            <p className="text-gray-700">
                                                {new Date(appointment.appointment_date).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            appointment.status === 'Completed' 
                                                ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white' 
                                                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                                        } shadow-sm transform hover:scale-105 transition-all duration-300`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'records':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-black/10">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Medical Records</h3>
                            <div className="space-y-4">
                                {records.medical.map(record => (
                                    <div key={record.id} className="border border-black/10 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{record.procedure_type}</h4>
                                                <p className="text-gray-600">{record.doctor_name}</p>
                                                <p className="text-gray-600">{record.formatted_date}</p>
                                                <p className="text-gray-500 mt-2">{record.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border border-black/10">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Treatment Plans</h3>
                            <div className="space-y-8">
                                {records.treatments.map((plan, index) => (
                                    <div key={plan.id} className="relative border border-black/10 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                plan.status === 'Completed' ? 'bg-green-500' :
                                                plan.status === 'In Progress' ? 'bg-blue-500' :
                                                'bg-gray-300'
                                            } text-white font-bold`}>
                                                {index + 1}
                                            </div>
                                            <div className="ml-4">
                                                <h4 className="font-semibold text-gray-800">{plan.plan_name}</h4>
                                                <p className={`text-sm font-medium ${
                                                    plan.status === 'Completed' ? 'text-green-600' :
                                                    plan.status === 'In Progress' ? 'text-blue-600' :
                                                    'text-gray-500'
                                                }`}>
                                                    {plan.status}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    {new Date(plan.start_date).toLocaleDateString()} - 
                                                    {plan.end_date ? new Date(plan.end_date).toLocaleDateString() : 'Ongoing'}
                                                </p>
                                                <p className="text-gray-600 text-sm mt-2">{plan.notes}</p>
                                            </div>
                                        </div>
                                        {index < records.treatments.length - 1 && (
                                            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-300"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'appointments':
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-black/10">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Upcoming Appointments</h3>
                            <div className="space-y-4">
                                {appointments.upcoming.map(appointment => (
                                    <div key={appointment.id} className="border border-black/10 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{appointment.doctor_name}</h4>
                                                <p className="text-gray-600">{appointment.doctor_specialty}</p>
                                                <p className="text-gray-600">
                                                    {new Date(appointment.appointment_date).toLocaleString()}
                                                </p>
                                                <p className="text-gray-500 mt-2">{appointment.notes}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                appointment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border border-black/10">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Past Appointments</h3>
                            <div className="space-y-4">
                                {appointments.past.map(appointment => (
                                    <div key={appointment.id} className="border border-black/10 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{appointment.doctor_name}</h4>
                                                <p className="text-gray-600">{appointment.doctor_specialty}</p>
                                                <p className="text-gray-600">
                                                    {new Date(appointment.appointment_date).toLocaleString()}
                                                </p>
                                                <p className="text-gray-500 mt-2">{appointment.notes}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                appointment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'billing':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Current Balance</h3>
                                <p className="text-3xl font-bold text-green-600">{patientData.balance}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Insurance Information</h3>
                                <p className="text-gray-600">Provider: {patientData.insurance_provider}</p>
                                <p className="text-gray-600">ID: {patientData.insurance_id}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Billing History</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {records.billing.map(bill => (
                                            <tr key={bill.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {bill.formatted_date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    {bill.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    ${bill.amount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                    ${bill.insurance_coverage.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {bill.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const handleTabClick = (tab) => {
        const tabOrder = ['overview', 'appointments', 'records', 'billing'];
        const currentIndex = tabOrder.indexOf(activeTab);
        const newIndex = tabOrder.indexOf(tab);
        setSlideDirection(newIndex > currentIndex ? 'left' : 'right');
        setActiveTab(tab);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-300 via-gray-100 to-gray-200 p-8 relative">
            <div className="absolute inset-0 bg-[radial-gradient(at_top_left,rgba(75,85,99,0.25)_0%,transparent_60%)] mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-[radial-gradient(at_top_right,rgba(107,114,128,0.25)_0%,transparent_60%)] mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-[radial-gradient(at_bottom_left,rgba(156,163,175,0.15)_0%,transparent_60%)] mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]"></div>
            
            <div className="max-w-7xl mx-auto relative">
                <div className="flex justify-between items-center mb-8 transform hover:scale-[1.01] transition-all duration-300">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 text-transparent bg-clip-text">Welcome, {patientData.name}</h1>
                        <p className="text-gray-700">
                            Last visit: {patientData.last_visit ? new Date(patientData.last_visit).toLocaleDateString() : 'No previous visits'}
                        </p>
                    </div>
                    <button 
                        onClick={() => router.push(`/patient/appointments?patientId=${patientId}`)}
                        className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                        Book Appointment
                    </button>
                </div>

                <div className="bg-white/85 backdrop-blur-sm rounded-xl shadow-md mb-6 hover:shadow-xl transition-all duration-300 border-[1px] border-black/25">
                    <nav className="flex border-b-[1px] border-black/25">
                        {['overview', 'appointments', 'records', 'billing'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                className="relative px-6 py-4 text-sm font-medium transition-all duration-300 text-gray-600 hover:text-gray-800 hover:bg-gray-50/50"
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800 animate-underline-slide" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div key={activeTab} className={`${
                    slideDirection === 'right' ? 'animate-tab-slide-right' : 'animate-tab-slide-left'
                }`}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
