import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaCalendarAlt, FaChartLine, FaBell, FaCheckCircle, FaEllipsisH, FaSpinner } from 'react-icons/fa';
import DentistLayout from '../components/DentistLayout';

export default function DentistDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [dashboardData, setDashboardData] = useState({
        upcomingAppointments: [],
        recentPatients: [],
        notifications: []
    });

    // Scheduling state
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        patientId: '',
        appointmentDate: '',
        appointmentTime: '',
        appointmentType: 'Regular Checkup',
        notes: ''
    });
    const [scheduleError, setScheduleError] = useState('');

    const appointmentTypes = [
        { id: 'checkup', name: 'Regular Checkup', duration: '30 min' },
        { id: 'cleaning', name: 'Teeth Cleaning', duration: '45 min' },
        { id: 'emergency', name: 'Emergency Visit', duration: '60 min' },
        { id: 'consultation', name: 'Consultation', duration: '30 min' }
    ];

    // Fetch patients when modal opens
    useEffect(() => {
        const fetchPatients = async () => {
            if (isScheduleModalOpen) {
                try {
                    const response = await fetch('/api/patients/list');
                    if (!response.ok) throw new Error('Failed to fetch patients');
                    const data = await response.json();
                    setPatients(data.patients || []);
                } catch (error) {
                    console.error('Error fetching patients:', error);
                    setScheduleError('Failed to load patients list');
                }
            }
        };

        fetchPatients();
    }, [isScheduleModalOpen]);

    // Check availability when date changes
    const checkAvailability = async (selectedDate) => {
        setIsCheckingAvailability(true);
        try {
            const response = await fetch(`/api/appointments/doctor?doctorId=1&startDate=${selectedDate}&endDate=${selectedDate}`);
            if (!response.ok) throw new Error('Failed to check availability');
            const data = await response.json();

            if (data.availabilityByDate && data.availabilityByDate[selectedDate]) {
                const dayAvailability = data.availabilityByDate[selectedDate];
                const availability = dayAvailability.availability;

                if (!availability || !availability.is_available) {
                    setAvailableTimeSlots([]);
                    return;
                }

                // Generate time slots
                const slots = [];
                const startHour = parseInt(availability.start_time?.split(':')[0]) || 9;
                const endHour = parseInt(availability.end_time?.split(':')[0]) || 17;
                const breakStartHour = availability.break_start ? parseInt(availability.break_start.split(':')[0]) : 12;
                const breakEndHour = availability.break_end ? parseInt(availability.break_end.split(':')[0]) : 13;

                // Get booked slots
                const bookedTimes = new Set(data.appointments?.scheduled?.map(apt => 
                    new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                ) || []);

                for (let hour = startHour; hour < endHour; hour++) {
                    if (hour >= breakStartHour && hour < breakEndHour) continue;
                    ['00', '30'].forEach(minutes => {
                        const timeSlot = `${hour.toString().padStart(2, '0')}:${minutes}`;
                        if (!bookedTimes.has(timeSlot)) {
                            slots.push(timeSlot);
                        }
                    });
                }

                setAvailableTimeSlots(slots);
            }
        } catch (error) {
            console.error('Error checking availability:', error);
            setScheduleError('Failed to check availability');
        } finally {
            setIsCheckingAvailability(false);
        }
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setNewAppointment({ ...newAppointment, appointmentDate: selectedDate, appointmentTime: '' });
        if (selectedDate) {
            checkAvailability(selectedDate);
        } else {
            setAvailableTimeSlots([]);
        }
    };

    const handleScheduleAppointment = async (e) => {
        e.preventDefault();
        setScheduleError('');

        try {
            // Book the appointment
            const response = await fetch('/api/appointments/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patientId: parseInt(newAppointment.patientId),
                    doctorId: 1,
                    appointmentDate: newAppointment.appointmentDate,
                    appointmentTime: newAppointment.appointmentTime,
                    appointmentType: newAppointment.appointmentType,
                    notes: newAppointment.notes
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to schedule appointment');

            // Close modal and reset form
            setIsScheduleModalOpen(false);
            setNewAppointment({
                patientId: '',
                appointmentDate: '',
                appointmentTime: '',
                appointmentType: 'Regular Checkup',
                notes: ''
            });

            // Refresh dashboard data
            fetchDashboardData();
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            setScheduleError(error.message);
        }
    };

    const handleQuickAction = (action) => {
        switch(action) {
            case 'schedule':
                router.push('/dentist/appointments?openSchedule=true');
                break;
            case 'analytics':
                router.push('/dentist/analytics');
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                setError('');

                // Fetch doctor's appointments for today
                const appointmentsResponse = await fetch('/api/appointments/doctor?doctorId=1');
                const appointmentsData = await appointmentsResponse.json();

                // Fetch patients assigned to this doctor
                const patientsResponse = await fetch('/api/patients/list');
                const patientsData = await patientsResponse.json();

                setDashboardData({
                    upcomingAppointments: appointmentsData.appointments.scheduled || [],
                    recentPatients: patientsData.patients || [],
                    notifications: notifications // Keep existing notifications
                });

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Sample data for notifications - keeping this unchanged
    const notifications = [
        {
            id: 1,
            type: "appointment",
            message: "New appointment request from Alice Brown",
            time: "5 minutes ago"
        },
        {
            id: 2,
            type: "reminder",
            message: "Follow-up needed for patient #1234",
            time: "1 hour ago"
        }
    ];

    const handleNotificationAction = (id, action) => {
        console.log(`Notification ${id} ${action}`);
        alert(`${action} action would be processed here`);
    };

    if (isLoading) {
        return (
            <DentistLayout>
                <div className="flex items-center justify-center">
                    <FaSpinner className="text-4xl text-blue-500 animate-spin" />
                </div>
            </DentistLayout>
        );
    }

    if (error) {
        return (
            <DentistLayout>
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            </DentistLayout>
        );
    }

    return (
        <DentistLayout>
            {/* Header Section */}
            <div className="mb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text font-display">
                        Dentist Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Welcome back, Dr. Sarah Wilson
                    </p>
                    <p className="text-blue-600 font-medium">
                        {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button 
                    onClick={() => handleQuickAction('schedule')}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 
                             flex items-center justify-between transform hover:-translate-y-1 hover:bg-gradient-to-br hover:from-white hover:to-blue-50 group
                             border border-gray-400 hover:border-blue-400 hover:scale-[1.02] active:scale-95"
                >
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Schedule Appointment</h3>
                        <p className="text-gray-600">Book a new appointment</p>
                    </div>
                    <FaCalendarAlt className="text-blue-600 text-3xl group-hover:scale-110 transition-transform" />
                </button>

                <button 
                    onClick={() => handleQuickAction('analytics')}
                    className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 
                             flex items-center justify-between transform hover:-translate-y-1 hover:bg-gradient-to-br hover:from-white hover:to-purple-50 group
                             border border-gray-400 hover:border-purple-400 hover:scale-[1.02] active:scale-95"
                >
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">View Analytics</h3>
                        <p className="text-gray-600">Check performance metrics</p>
                    </div>
                    <FaChartLine className="text-purple-600 text-3xl group-hover:scale-110 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Appointments */}
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6
                              border border-gray-400 hover:border-blue-300 hover:bg-white/90 group">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">Today's Appointments</h2>
                        <Link href="/dentist/appointments" 
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {dashboardData.upcomingAppointments.map(appointment => (
                            <div key={appointment.id} 
                                 className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300 
                                          hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5
                                          hover:border-blue-300 hover:bg-blue-50/30 group/item">
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover/item:text-blue-600 transition-colors">{appointment.patient_name}</h3>
                                    <p className="text-gray-600 group-hover/item:text-gray-700">{appointment.formatted_time} - {appointment.appointment_type}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300
                                        ${appointment.status === 'Completed' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' : 
                                          appointment.status === 'In Progress' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white' :
                                          'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'}`}>
                                        {appointment.status}
                                    </span>
                                    <button 
                                        onClick={() => alert(`View details for ${appointment.patient_name}`)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <FaEllipsisH />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {dashboardData.upcomingAppointments.length === 0 && (
                            <p className="text-gray-500 text-center py-4">No appointments for today</p>
                        )}
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6
                              border border-gray-400 hover:border-blue-300 hover:bg-white/90 group">
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text mb-6">
                        Notifications
                    </h2>
                    <div className="space-y-4">
                        {notifications.map(notification => (
                            <div key={notification.id} 
                                 className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-300 
                                          hover:shadow-md transition-all duration-300 group/item
                                          hover:border-blue-300 hover:bg-blue-50/30">
                                <div className="flex-shrink-0 group-hover/item:scale-110 transition-transform">
                                    <FaBell className="text-blue-600 animate-pulse group-hover/item:animate-none group-hover/item:text-blue-500" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-gray-900 font-medium group-hover/item:text-blue-600 transition-colors">
                                        {notification.message}
                                    </p>
                                    <p className="text-sm text-gray-600">{notification.time}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleNotificationAction(notification.id, 'accept')}
                                        className="text-green-600 hover:text-green-800 transform hover:scale-110 transition-all"
                                    >
                                        <FaCheckCircle />
                                    </button>
                                    <button 
                                        onClick={() => handleNotificationAction(notification.id, 'dismiss')}
                                        className="text-gray-400 hover:text-gray-600 transform hover:scale-110 transition-all"
                                    >
                                        <FaEllipsisH />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Patients */}
                <div className="lg:col-span-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6
                              border border-gray-400 hover:border-blue-300 hover:bg-white/90 group">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                            Recent Patients
                        </h2>
                        <button 
                            onClick={() => alert('View all patients would open here')}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all"
                        >
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50/50 backdrop-blur-sm">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Appointment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {dashboardData.recentPatients.map(patient => (
                                    <tr key={patient.id} className="hover:bg-blue-50/30 transition-colors group/row">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900 group-hover/row:text-blue-600 transition-colors">
                                                {patient.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {patient.last_visit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {patient.next_appointment}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-400 to-blue-500 text-white
                                                         group-hover/row:shadow-md group-hover/row:scale-105 transition-all">
                                                {patient.treatment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm opacity-0 group-hover/row:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => router.push(`/patientdashboard?id=${patient.id}`)}
                                                className="text-blue-600 hover:text-blue-800 mr-3 font-medium hover:underline transition-all
                                                         hover:scale-105"
                                            >
                                                View Details
                                            </button>
                                            <button 
                                                onClick={() => router.push(`/dentist/appointments?openSchedule=true&patientId=${patient.id}`)}
                                                className="text-green-600 hover:text-green-800 font-medium hover:underline transition-all
                                                         hover:scale-105"
                                            >
                                                Schedule
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {dashboardData.recentPatients.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                            No patients found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Schedule Appointment Modal */}
            {isScheduleModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Schedule Appointment</h2>
                            <button
                                onClick={() => setIsScheduleModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        {scheduleError && (
                            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                                {scheduleError}
                            </div>
                        )}

                        <form onSubmit={handleScheduleAppointment} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Patient
                                </label>
                                <select
                                    value={newAppointment.patientId}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a patient</option>
                                    {patients.map(patient => (
                                        <option key={patient.id} value={patient.id}>
                                            {patient.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={newAppointment.appointmentDate}
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Time
                                    {isCheckingAvailability && (
                                        <span className="ml-2 text-sm text-blue-600">Checking availability...</span>
                                    )}
                                </label>
                                <select
                                    value={newAppointment.appointmentTime}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, appointmentTime: e.target.value })}
                                    required
                                    disabled={!availableTimeSlots.length}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a time</option>
                                    {availableTimeSlots.map(slot => (
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Appointment Type
                                </label>
                                <select
                                    value={newAppointment.appointmentType}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, appointmentType: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {appointmentTypes.map(type => (
                                        <option key={type.id} value={type.name}>
                                            {type.name} ({type.duration})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={newAppointment.notes}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                    placeholder="Add any additional notes..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Schedule Appointment
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </DentistLayout>
    );
}
