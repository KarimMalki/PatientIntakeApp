import { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaTooth, FaSearch, FaFilter, FaSpinner, FaPlus, FaChevronDown } from 'react-icons/fa';
import DentistLayout from '../../components/DentistLayout';

function CustomDropdown({ value, options, onChange, icon, className }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${className}`}
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="text-gray-400">{icon}</span>}
                    <span className="text-gray-900">{selectedOption.label}</span>
                </div>
                <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden origin-top animate-dropdown">
                    <div className="py-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                                    option.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DentistAppointments() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [timeRange, setTimeRange] = useState('day');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // New state for scheduling modal
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
    const [isScheduling, setIsScheduling] = useState(false);

    const appointmentTypes = [
        { id: 'checkup', name: 'Regular Checkup', duration: '30 min' },
        { id: 'cleaning', name: 'Teeth Cleaning', duration: '45 min' },
        { id: 'emergency', name: 'Emergency Visit', duration: '60 min' },
        { id: 'consultation', name: 'Consultation', duration: '30 min' }
    ];

    const calculateEndDate = (startDate, range) => {
        const start = new Date(startDate);
        const end = new Date(startDate);
        
        switch(range) {
            case 'day':
                end.setDate(start.getDate() + 1);
                break;
            case 'week':
                end.setDate(start.getDate() + 7);
                break;
            case 'month':
                end.setMonth(start.getMonth() + 1);
                break;
            default:
                end.setDate(start.getDate() + 1);
        }
        return end.toISOString().split('T')[0];
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const endDate = calculateEndDate(selectedDate, timeRange);
                const response = await fetch(`/api/appointments/doctor?doctorId=1&startDate=${selectedDate}&endDate=${endDate}`);
                if (!response.ok) throw new Error('Failed to fetch appointments');
                const data = await response.json();
                
                // Combine all appointments from different status groups
                const allAppointments = [
                    ...(data.appointments.scheduled || []),
                    ...(data.appointments.inProgress || []),
                    ...(data.appointments.completed || []),
                    ...(data.appointments.cancelled || [])
                ];
                
                // Sort appointments by date and time
                allAppointments.sort((a, b) => {
                    const dateA = new Date(a.appointment_date + 'T' + a.appointment_time);
                    const dateB = new Date(b.appointment_date + 'T' + b.appointment_time);
                    return dateA - dateB;
                });
                
                setAppointments(allAppointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                setError('Failed to load appointments. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedDate, timeRange]);

    // Add effect to handle openSchedule parameter
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('openSchedule') === 'true') {
            setIsScheduleModalOpen(true);
            const patientId = searchParams.get('patientId');
            if (patientId) {
                setNewAppointment(prev => ({
                    ...prev,
                    patientId: patientId
                }));
            }
            // Clean up the URL
            window.history.replaceState({}, '', '/dentist/appointments');
        }
    }, []);

    // These handlers will just update the UI for now
    const handleStatusChange = (appointmentId, newStatus) => {
        alert('Status update functionality will be implemented with the database later');
    };

    const handleNoteUpdate = (appointmentId, note) => {
        alert('Note update functionality will be implemented with the database later');
    };

    const handleCancelAppointment = async (appointmentId) => {
        const confirmed = window.confirm('Are you sure you want to cancel this appointment?');
        if (confirmed) {
            try {
                const response = await fetch('/api/appointments/update-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        appointmentId: appointmentId,
                        status: 'Cancelled'
                    })
                });

                const data = await response.json();
                
                if (response.ok) {
                    // Refresh the appointments list
                    const endDate = calculateEndDate(selectedDate, timeRange);
                    const appointmentsResponse = await fetch(`/api/appointments/doctor?doctorId=1&startDate=${selectedDate}&endDate=${endDate}`);
                    const appointmentsData = await appointmentsResponse.json();
                    
                    // Combine all appointments from different status groups
                    const allAppointments = [
                        ...(appointmentsData.appointments.scheduled || []),
                        ...(appointmentsData.appointments.inProgress || []),
                        ...(appointmentsData.appointments.completed || []),
                        ...(appointmentsData.appointments.cancelled || [])
                    ];
                    
                    // Sort appointments by date and time
                    allAppointments.sort((a, b) => {
                        const dateA = new Date(a.appointment_date + 'T' + a.appointment_time);
                        const dateB = new Date(b.appointment_date + 'T' + b.appointment_time);
                        return dateA - dateB;
                    });
                    
                    setAppointments(allAppointments);
                    alert('Appointment cancelled successfully!');
                } else {
                    throw new Error(data.error || 'Failed to cancel appointment');
                }
            } catch (error) {
                console.error('Error cancelling appointment:', error);
                alert('Failed to cancel appointment. Please try again.');
            }
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = (appointment.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (appointment.appointment_type || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // New function to fetch patients
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('/api/patients/list');
                if (!response.ok) throw new Error('Failed to fetch patients');
                const data = await response.json();
                setPatients(data.patients || []);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        if (isScheduleModalOpen) {
            fetchPatients();
        }
    }, [isScheduleModalOpen]);

    // Add function to check availability
    const checkDoctorAvailability = async (selectedDate) => {
        setIsCheckingAvailability(true);
        try {
            const response = await fetch(`/api/appointments/doctor?doctorId=1&startDate=${selectedDate}&endDate=${selectedDate}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();
            console.log('Availability response:', data);
            
            if (response.ok && data.availabilityByDate && data.availabilityByDate[selectedDate]) {
                const dayAvailability = data.availabilityByDate[selectedDate];
                const availability = dayAvailability.availability;

                if (!availability || !availability.is_available) {
                    setAvailableTimeSlots([]);
                    return;
                }

                // Generate time slots based on doctor's schedule
                const slots = [];
                const startHour = parseInt(availability.start_time?.split(':')[0]) || 9;  // Default to 9 AM
                const endHour = parseInt(availability.end_time?.split(':')[0]) || 17;     // Default to 5 PM
                const breakStartHour = availability.break_start ? parseInt(availability.break_start.split(':')[0]) : 12;
                const breakEndHour = availability.break_end ? parseInt(availability.break_end.split(':')[0]) : 13;

                // Get existing appointments for the day
                const existingAppointments = data.appointments?.scheduled || [];
                const bookedTimes = new Set(existingAppointments.map(apt => 
                    new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                ));

                // Generate available slots
                for (let hour = startHour; hour < endHour; hour++) {
                    // Skip break time
                    if (hour >= breakStartHour && hour < breakEndHour) {
                        continue;
                    }

                    // Check both :00 and :30 slots
                    ['00', '30'].forEach(minutes => {
                        const timeSlot = `${hour.toString().padStart(2, '0')}:${minutes}`;
                        if (!bookedTimes.has(timeSlot)) {
                            slots.push(timeSlot);
                        }
                    });
                }

                console.log('Generated available slots:', slots);
                setAvailableTimeSlots(slots);
            } else {
                console.error('Failed to fetch availability:', data.error);
                setAvailableTimeSlots([]);
            }
        } catch (error) {
            console.error('Error checking availability:', error);
            setAvailableTimeSlots([]);
        } finally {
            setIsCheckingAvailability(false);
        }
    };

    // Update the date input to check availability when date changes
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setNewAppointment({...newAppointment, appointmentDate: selectedDate, appointmentTime: ''});
        if (selectedDate) {
            checkDoctorAvailability(selectedDate);
        } else {
            setAvailableTimeSlots([]);
        }
    };

    // Handle appointment scheduling
    const handleScheduleAppointment = async (e) => {
        e.preventDefault();
        setScheduleError('');
        setIsScheduling(true);

        try {
            // First check availability
            const availabilityResponse = await fetch('/api/appointments/check-availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId: 1,
                    date: newAppointment.appointmentDate,
                    time: newAppointment.appointmentTime
                })
            });

            const availabilityData = await availabilityResponse.json();
            if (!availabilityData.available) {
                setScheduleError(`This time slot is not available: ${availabilityData.reason}`);
                return;
            }

            // If available, book the appointment
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

            if (!response.ok) {
                throw new Error(data.error || 'Failed to schedule appointment');
            }

            // Refresh appointments list
            const endDate = calculateEndDate(selectedDate, timeRange);
            const appointmentsResponse = await fetch(`/api/appointments/doctor?doctorId=1&startDate=${selectedDate}&endDate=${endDate}`);
            const appointmentsData = await appointmentsResponse.json();
            
            setAppointments([
                ...(appointmentsData.appointments.scheduled || []),
                ...(appointmentsData.appointments.inProgress || []),
                ...(appointmentsData.appointments.completed || []),
                ...(appointmentsData.appointments.cancelled || [])
            ]);

            // Close modal and reset form
            setIsScheduleModalOpen(false);
            setNewAppointment({
                patientId: '',
                appointmentDate: '',
                appointmentTime: '',
                appointmentType: 'Regular Checkup',
                notes: ''
            });
        } catch (error) {
            setScheduleError(error.message);
        } finally {
            setIsScheduling(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <FaSpinner className="text-4xl text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <DentistLayout>
            <div className="space-y-6">
                <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setIsScheduleModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FaPlus />
                            Schedule Appointment
                        </button>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search appointments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                            />
                        </div>
                        <div className="relative">
                            <CustomDropdown
                                value={filterStatus}
                                onChange={setFilterStatus}
                                icon={<FaFilter />}
                                options={[
                                    { value: 'all', label: 'All Status' },
                                    { value: 'Scheduled', label: 'Scheduled' },
                                    { value: 'In Progress', label: 'In Progress' },
                                    { value: 'Completed', label: 'Completed' },
                                    { value: 'Cancelled', label: 'Cancelled' }
                                ]}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2 items-center">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            />
                            <CustomDropdown
                                value={timeRange}
                                onChange={setTimeRange}
                                options={[
                                    { value: 'day', label: '1 Day' },
                                    { value: 'week', label: '1 Week' },
                                    { value: 'month', label: '1 Month' }
                                ]}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
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
                                                <span className="text-sm text-gray-900">
                                                    {new Date(appointment.appointment_date).toLocaleDateString()} {appointment.formatted_time}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaUser className="text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{appointment.patient_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FaTooth className="text-gray-400 mr-2" />
                                                <span className="text-sm text-gray-900">{appointment.appointment_type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={appointment.status || 'Scheduled'}
                                                onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                                                className={`text-sm rounded-full px-3 py-1 font-medium ${
                                                    appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    appointment.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                    appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                <option value="Scheduled">Scheduled</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={appointment.notes || ''}
                                                onChange={(e) => handleNoteUpdate(appointment.id, e.target.value)}
                                                className="text-sm text-gray-900 border-b border-transparent hover:border-gray-300 focus:outline-none focus:border-blue-500"
                                                placeholder="Add notes..."
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
                                                onClick={() => handleCancelAppointment(appointment.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredAppointments.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            No appointments found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Schedule Appointment Modal */}
                {isScheduleModalOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] flex items-center justify-center p-4 z-50 animate-modal-fade">
                        <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 animate-modal-slide">
                            <div className="flex justify-between items-center mb-6 animate-modal-content">
                                <h2 className="text-2xl font-bold text-gray-900">Schedule Appointment</h2>
                                <button
                                    onClick={() => setIsScheduleModalOpen(false)}
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    ×
                                </button>
                            </div>

                            {scheduleError && (
                                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 animate-modal-content">
                                    {scheduleError}
                                </div>
                            )}

                            <form onSubmit={handleScheduleAppointment} className="space-y-4 animate-modal-content">
                                <div>
                                    <label className="block text-gray-900 font-medium mb-2">
                                        Patient
                                    </label>
                                    <select
                                        value={newAppointment.patientId}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                    >
                                        <option value="" className="text-gray-900">Select a patient</option>
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.id} className="text-gray-900">
                                                {patient.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-900 font-medium mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={newAppointment.appointmentDate}
                                        onChange={handleDateChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-900 font-medium mb-2">
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
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                    >
                                        <option value="" className="text-gray-900">Select a time</option>
                                        {availableTimeSlots.map(slot => (
                                            <option key={slot} value={slot} className="text-gray-900">
                                                {slot}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-900 font-medium mb-2">
                                        Appointment Type
                                    </label>
                                    <select
                                        value={newAppointment.appointmentType}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, appointmentType: e.target.value })}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                    >
                                        {appointmentTypes.map(type => (
                                            <option key={type.id} value={type.name} className="text-gray-900">
                                                {type.name} ({type.duration})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-900 font-medium mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        value={newAppointment.notes}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        placeholder="Add any additional notes..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isScheduling}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                                >
                                    {isScheduling ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <FaSpinner className="animate-spin" />
                                            Scheduling...
                                        </span>
                                    ) : (
                                        'Schedule Appointment'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DentistLayout>
    );
}
