import { useState } from 'react';
import { 
    FaTooth, FaFileMedical, FaFileDownload, FaCalendarCheck, 
    FaPrescription, FaChartLine, FaSearch 
} from 'react-icons/fa';

export default function PatientRecords() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('medical');

    // Sample data
    const medicalHistory = [
        {
            id: 1,
            date: "2024-01-15",
            type: "Dental Cleaning",
            doctor: "Dr. Sarah Wilson",
            notes: "Regular cleaning performed. No cavities found.",
            attachments: ["xray_2024_01.pdf"]
        },
        {
            id: 2,
            date: "2023-12-01",
            type: "Root Canal",
            doctor: "Dr. Michael Chen",
            notes: "Root canal treatment on tooth #18. Follow-up scheduled.",
            attachments: ["procedure_report.pdf", "post_care.pdf"]
        }
    ];

    const prescriptions = [
        {
            id: 1,
            date: "2024-01-15",
            medication: "Amoxicillin",
            dosage: "500mg",
            frequency: "3 times daily",
            duration: "7 days",
            doctor: "Dr. Michael Chen"
        },
        {
            id: 2,
            date: "2023-12-01",
            medication: "Ibuprofen",
            dosage: "400mg",
            frequency: "As needed",
            duration: "5 days",
            doctor: "Dr. Sarah Wilson"
        }
    ];

    const treatments = [
        {
            id: 1,
            name: "Orthodontic Treatment",
            startDate: "2023-11-01",
            status: "In Progress",
            progress: 60,
            nextAppointment: "2024-02-15",
            doctor: "Dr. Sarah Wilson"
        },
        {
            id: 2,
            name: "Cavity Treatment",
            startDate: "2023-12-15",
            status: "Completed",
            progress: 100,
            completionDate: "2024-01-05",
            doctor: "Dr. Michael Chen"
        }
    ];

    const handleDownload = (fileName) => {
        // In a real app, this would trigger a file download
        alert(`Downloading ${fileName}`);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        // In a real app, this would filter the records
        console.log('Searching for:', term);
    };

    const filteredHistory = medicalHistory.filter(record =>
        record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
                    <p className="text-gray-600 mt-2">View and manage your dental records</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('medical')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'medical'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Medical History
                            </button>
                            <button
                                onClick={() => setActiveTab('prescriptions')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'prescriptions'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Prescriptions
                            </button>
                            <button
                                onClick={() => setActiveTab('treatments')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'treatments'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Treatment Plans
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {activeTab === 'medical' && (
                        <>
                            {filteredHistory.map(record => (
                                <div key={record.id} className="bg-white rounded-xl shadow-md p-6">
                                    <div className="flex flex-col md:flex-row justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-4">
                                                <FaTooth className="text-blue-600 mr-2" />
                                                <h3 className="text-lg font-semibold text-gray-900">{record.type}</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div className="flex items-center text-gray-600">
                                                    <FaCalendarCheck className="mr-2" />
                                                    {record.date}
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <FaFileMedical className="mr-2" />
                                                    {record.doctor}
                                                </div>
                                            </div>
                                            <p className="text-gray-600">{record.notes}</p>
                                            {record.attachments && record.attachments.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {record.attachments.map((file, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => handleDownload(file)}
                                                                className="flex items-center bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                                                            >
                                                                <FaFileDownload className="mr-2 text-gray-600" />
                                                                <span className="text-sm text-gray-600">{file}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {activeTab === 'prescriptions' && (
                        <>
                            {prescriptions.map(prescription => (
                                <div key={prescription.id} className="bg-white rounded-xl shadow-md p-6">
                                    <div className="flex items-center mb-4">
                                        <FaPrescription className="text-blue-600 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-900">{prescription.medication}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Dosage</p>
                                            <p className="text-gray-900">{prescription.dosage}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Frequency</p>
                                            <p className="text-gray-900">{prescription.frequency}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Duration</p>
                                            <p className="text-gray-900">{prescription.duration}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Prescribed By</p>
                                            <p className="text-gray-900">{prescription.doctor}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {activeTab === 'treatments' && (
                        <>
                            {treatments.map(treatment => (
                                <div key={treatment.id} className="bg-white rounded-xl shadow-md p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <FaChartLine className="text-blue-600 mr-2" />
                                            <h3 className="text-lg font-semibold text-gray-900">{treatment.name}</h3>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            treatment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {treatment.status}
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${treatment.progress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{treatment.progress}% Complete</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Start Date</p>
                                            <p className="text-gray-900">{treatment.startDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                {treatment.status === 'Completed' ? 'Completion Date' : 'Next Appointment'}
                                            </p>
                                            <p className="text-gray-900">
                                                {treatment.status === 'Completed' ? treatment.completionDate : treatment.nextAppointment}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
