import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
    FaCalendarAlt, FaChartLine, 
    FaBell, FaSearch, FaEllipsisH, FaCheckCircle 
} from 'react-icons/fa';

export default function DentistDashboard() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    // Sample data
    const upcomingAppointments = [
        {
            id: 1,
            patientName: "John Doe",
            time: "09:00 AM",
            type: "Regular Checkup",
            status: "Scheduled"
        },
        {
            id: 2,
            patientName: "Jane Smith",
            time: "10:30 AM",
            type: "Root Canal",
            status: "In Progress"
        }
    ];

    const recentPatients = [
        {
            id: 1,
            name: "Mike Johnson",
            lastVisit: "Yesterday",
            nextAppointment: "Next Week",
            status: "Treatment Ongoing"
        },
        {
            id: 2,
            name: "Sarah Wilson",
            lastVisit: "2 days ago",
            nextAppointment: "Tomorrow",
            status: "Regular Checkup"
        }
    ];

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

    const handleQuickAction = (action) => {
        switch(action) {
            case 'schedule':
                router.push('/dentist/appointments');
                break;
            case 'analytics':
                router.push('/dentist/analytics');
                break;
            default:
                break;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dentist Dashboard</h1>
                        <p className="text-gray-600">Welcome back, Dr. Sarah Wilson</p>
                    </div>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <button 
                        onClick={() => handleQuickAction('schedule')}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Schedule Appointment</h3>
                            <p className="text-gray-600">Book a new appointment</p>
                        </div>
                        <FaCalendarAlt className="text-blue-600 text-2xl" />
                    </button>

                    <button 
                        onClick={() => handleQuickAction('analytics')}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">View Analytics</h3>
                            <p className="text-gray-600">Check performance metrics</p>
                        </div>
                        <FaChartLine className="text-purple-600 text-2xl" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Appointments */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
                            <Link href="/dentist/appointments" className="text-blue-600 hover:text-blue-800">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {upcomingAppointments.map(appointment => (
                                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                                        <p className="text-gray-600">{appointment.time} - {appointment.type}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            appointment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {appointment.status}
                                        </span>
                                        <button 
                                            onClick={() => alert(`View details for ${appointment.patientName}`)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <FaEllipsisH />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
                        <div className="space-y-4">
                            {notifications.map(notification => (
                                <div key={notification.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <FaBell className="text-blue-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-gray-900">{notification.message}</p>
                                        <p className="text-sm text-gray-600">{notification.time}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleNotificationAction(notification.id, 'accept')}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <FaCheckCircle />
                                        </button>
                                        <button 
                                            onClick={() => handleNotificationAction(notification.id, 'dismiss')}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <FaEllipsisH />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Patients */}
                    <div className="lg:col-span-3 bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Patients</h2>
                            <button 
                                onClick={() => alert('View all patients would open here')}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                View All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Appointment</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentPatients.map(patient => (
                                        <tr key={patient.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{patient.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {patient.lastVisit}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                                {patient.nextAppointment}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    {patient.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button 
                                                    onClick={() => alert(`View details for ${patient.name}`)}
                                                    className="text-blue-600 hover:text-blue-800 mr-3"
                                                >
                                                    View Details
                                                </button>
                                                <button 
                                                    onClick={() => alert(`Schedule appointment for ${patient.name}`)}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    Schedule
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
