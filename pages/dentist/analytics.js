import { useState } from 'react';
import { FaChartLine, FaChartPie, FaChartBar, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import {
    LineChart, Line, PieChart, Pie, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import DentistLayout from '../../components/DentistLayout';

export default function DentistAnalytics() {
    const [timeRange, setTimeRange] = useState('week');

    // Sample data for charts
    const appointmentTrends = [
        { date: 'Mon', appointments: 8 },
        { date: 'Tue', appointments: 12 },
        { date: 'Wed', appointments: 10 },
        { date: 'Thu', appointments: 15 },
        { date: 'Fri', appointments: 11 },
        { date: 'Sat', appointments: 6 },
        { date: 'Sun', appointments: 0 }
    ];

    const procedureTypes = [
        { name: 'Checkups', value: 35 },
        { name: 'Cleanings', value: 25 },
        { name: 'Fillings', value: 20 },
        { name: 'Root Canals', value: 10 },
        { name: 'Extractions', value: 10 }
    ];

    const patientAgeGroups = [
        { age: '0-18', patients: 15 },
        { age: '19-30', patients: 25 },
        { age: '31-50', patients: 35 },
        { age: '51-70', patients: 20 },
        { age: '70+', patients: 5 }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const handleExport = (reportType) => {
        console.log(`Exporting ${reportType} report...`);
        // In a real app, this would generate and download a report
        alert(`${reportType} report would be downloaded here`);
    };

    return (
        <DentistLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <div className="flex gap-4">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                        <button
                            onClick={() => handleExport('Analytics')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FaDownload />
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Patients</h3>
                        <p className="text-3xl font-bold text-blue-600">248</p>
                        <p className="text-sm text-green-600">↑ 12% from last month</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Appointments</h3>
                        <p className="text-3xl font-bold text-blue-600">62</p>
                        <p className="text-sm text-green-600">↑ 8% from last month</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Procedures</h3>
                        <p className="text-3xl font-bold text-blue-600">45</p>
                        <p className="text-sm text-green-600">↑ 15% from last month</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Patient Satisfaction</h3>
                        <p className="text-3xl font-bold text-blue-600">4.8/5</p>
                        <p className="text-sm text-green-600">↑ 0.2 from last month</p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Appointment Trends */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Appointment Trends</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={appointmentTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="appointments" 
                                        stroke="#0088FE" 
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Procedure Distribution */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Procedure Types</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={procedureTypes}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {procedureTypes.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Patient Age Distribution */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Patient Age Distribution</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={patientAgeGroups}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="age" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="patients" fill="#0088FE" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Key Insights */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Insights</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">Peak Hours</h4>
                                <p className="text-blue-800">Most appointments are scheduled between 10 AM and 2 PM</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h4 className="font-semibold text-green-900 mb-2">Popular Services</h4>
                                <p className="text-green-800">Regular checkups and cleanings make up 60% of appointments</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <h4 className="font-semibold text-purple-900 mb-2">Patient Demographics</h4>
                                <p className="text-purple-800">Largest patient age group is 31-50 years old</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DentistLayout>
    );
}
