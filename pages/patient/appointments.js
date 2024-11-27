import { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUserMd, FaNotesMedical, FaCheckCircle } from 'react-icons/fa';

export default function PatientAppointments() {
    const [selectedTab, setSelectedTab] = useState('upcoming');
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        date: '',
        time: '',
        type: '',
        notes: ''
    });

    // Sample data
    const upcomingAppointments = [
        {
            id: 1,
            doctor: "Dr. Sarah Wilson",
            date: "2024-02-15",
            time: "10:00 AM",
            type: "Regular Checkup",
            status: "Confirmed",
            notes: "Regular cleaning and checkup"
        },
        {
            id: 2,
            doctor: "Dr. Michael Chen",
            date: "2024-03-01",
            time: "2:30 PM",
            type: "Follow-up",
            status: "Pending",
            notes: "Follow-up for previous treatment"
        }
    ];

    const pastAppointments = [
        {
            id: 3,
            doctor: "Dr. Sarah Wilson",
            date: "2024-01-10",
            time: "11:00 AM",
            type: "Cleaning",
            status: "Completed",
            notes: "Regular cleaning done"
        }
    ];

    const appointmentTypes = [
        { id: 'checkup', name: 'Regular Checkup', duration: '30 min' },
        { id: 'cleaning', name: 'Teeth Cleaning', duration: '45 min' },
        { id: 'emergency', name: 'Emergency Visit', duration: '60 min' },
        { id: 'consultation', name: 'Consultation', duration: '30 min' }
    ];

    const handleBookAppointment = (e) => {
        e.preventDefault();
        // In a real app, this would send data to the server
        console.log('Booking appointment:', newAppointment);
        alert('Appointment request submitted! You will receive a confirmation soon.');
        setShowBookingForm(false);
        setNewAppointment({ date: '', time: '', type: '', notes: '' });
    };

    const handleCancelAppointment = (appointmentId) => {
        // In a real app, this would send a cancellation request to the server
        const confirmed = window.confirm('Are you sure you want to cancel this appointment?');
        if (confirmed) {
            alert('Appointment cancelled successfully!');
        }
    };

    const handleReschedule = (appointmentId) => {
        // In a real app, this would open a rescheduling interface
        alert('Rescheduling interface would open here');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
                    <button
                        onClick={() => setShowBookingForm(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <FaCalendarAlt className="mr-2" />
                        Book New Appointment
                    </button>
                </div>

                {/* Booking Form Modal */}
                {showBookingForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Appointment</h2>
                            <form onSubmit={handleBookAppointment} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={newAppointment.date}
                                        onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Time</label>
                                    <select
                                        value={newAppointment.time}
                                        onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select a time</option>
                                        {Array.from({ length: 8 }, (_, i) => {
                                            const hour = i + 9; // 9 AM to 4 PM
                                            return (
                                                <option key={hour} value={`${hour}:00`}>
                                                    {hour > 12 ? `${hour-12}:00 PM` : `${hour}:00 AM`}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Type</label>
                                    <select
                                        value={newAppointment.type}
                                        onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select type</option>
                                        {appointmentTypes.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {type.name} ({type.duration})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Notes (Optional)</label>
                                    <textarea
                                        value={newAppointment.notes}
                                        onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Any specific concerns or requests?"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowBookingForm(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setSelectedTab('upcoming')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    selectedTab === 'upcoming'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Upcoming
                            </button>
                            <button
                                onClick={() => setSelectedTab('past')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    selectedTab === 'past'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Past
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="space-y-4">
                    {(selectedTab === 'upcoming' ? upcomingAppointments : pastAppointments).map(appointment => (
                        <div key={appointment.id} className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex flex-col md:flex-row justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <FaUserMd className="text-blue-600 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center text-gray-600">
                                            <FaCalendarAlt className="mr-2" />
                                            {appointment.date}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <FaClock className="mr-2" />
                                            {appointment.time}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <FaNotesMedical className="mr-2" />
                                            {appointment.type}
                                        </div>
                                        <div className="flex items-center">
                                            <FaCheckCircle className={`mr-2 ${
                                                appointment.status === 'Completed' ? 'text-green-600' :
                                                appointment.status === 'Confirmed' ? 'text-blue-600' :
                                                'text-yellow-600'
                                            }`} />
                                            <span className={
                                                appointment.status === 'Completed' ? 'text-green-600' :
                                                appointment.status === 'Confirmed' ? 'text-blue-600' :
                                                'text-yellow-600'
                                            }>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                    {appointment.notes && (
                                        <p className="mt-2 text-gray-600">
                                            <span className="font-medium">Notes:</span> {appointment.notes}
                                        </p>
                                    )}
                                </div>
                                {selectedTab === 'upcoming' && (
                                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col gap-2">
                                        <button
                                            onClick={() => handleReschedule(appointment.id)}
                                            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                                        >
                                            Reschedule
                                        </button>
                                        <button
                                            onClick={() => handleCancelAppointment(appointment.id)}
                                            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {(selectedTab === 'upcoming' ? upcomingAppointments : pastAppointments).length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl shadow-md">
                            <p className="text-gray-600">No {selectedTab} appointments</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
