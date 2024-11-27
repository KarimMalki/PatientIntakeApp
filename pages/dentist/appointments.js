import { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaTooth, FaSearch, FaFilter } from 'react-icons/fa';

export default function DentistAppointments() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Sample appointments data
    const appointments = [
        {
            id: 1,
            patientName: "John Doe",
            time: "09:00 AM",
            type: "Regular Checkup",
            status: "Scheduled",
            notes: "Regular cleaning and checkup"
        },
        {
            id: 2,
            patientName: "Jane Smith",
            time: "10:30 AM",
            type: "Root Canal",
            status: "In Progress",
            notes: "Follow-up treatment"
        },
        {
            id: 3,
            patientName: "Mike Johnson",
            time: "02:00 PM",
            type: "Consultation",
            status: "Completed",
            notes: "Initial consultation for braces"
        }
    ];

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleStatusChange = (appointmentId, newStatus) => {
        // In a real app, this would update the database
        console.log(`Updating appointment ${appointmentId} to status: ${newStatus}`);
    };

    const handleNoteUpdate = (appointmentId, note) => {
        // In a real app, this would update the database
        console.log(`Updating appointment ${appointmentId} note: ${note}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                    <div className="flex flex-wrap gap-4">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search appointments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            >
                                <option value="all">All Status</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAppointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaClock className="text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{appointment.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaUser className="text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{appointment.patientName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaTooth className="text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{appointment.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={appointment.status}
                                                onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                                                className={`text-sm rounded-full px-3 py-1 font-medium ${
                                                    appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    appointment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                <option value="Scheduled">Scheduled</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={appointment.notes}
                                                onChange={(e) => handleNoteUpdate(appointment.id, e.target.value)}
                                                className="text-sm text-gray-900 border-b border-transparent hover:border-gray-300 focus:outline-none focus:border-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button 
                                                onClick={() => console.log('View details:', appointment.id)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                View Details
                                            </button>
                                            <button 
                                                onClick={() => console.log('Cancel appointment:', appointment.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Cancel
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
    );
}
