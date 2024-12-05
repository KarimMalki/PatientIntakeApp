import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaCalendarAlt, FaClock, FaUserMd, FaNotesMedical, FaCheckCircle } from 'react-icons/fa';

export default function PatientAppointments() {
    const router = useRouter();
    const { patientId } = router.query;

    const [selectedTab, setSelectedTab] = useState('upcoming');
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
    const [newAppointment, setNewAppointment] = useState({
        date: '',
        time: '',
        type: '',
        doctorId: 1,
        notes: ''
    });
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    // Fetch appointments from the database
    const fetchAppointments = async () => {
        try {
            const response = await fetch(`/api/appointments/patient?patientId=${patientId}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            
            if (response.ok) {
                setAppointments({
                    upcoming: data.appointments.upcoming || [],
                    past: data.appointments.past || []
                });
            } else {
                console.error('Failed to fetch appointments:', data.error);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    // Fetch appointments when component mounts
    useEffect(() => {
        if (patientId) {
            fetchAppointments();
        }
    }, [patientId]);

    const appointmentTypes = [
        { id: 'checkup', name: 'Regular Checkup', duration: '30 min' },
        { id: 'cleaning', name: 'Teeth Cleaning', duration: '45 min' },
        { id: 'emergency', name: 'Emergency Visit', duration: '60 min' },
        { id: 'consultation', name: 'Consultation', duration: '30 min' }
    ];

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
                const startHour = parseInt(availability.start_time.split(':')[0]);
                const endHour = parseInt(availability.end_time.split(':')[0]);
                const breakStartHour = availability.break_start ? parseInt(availability.break_start.split(':')[0]) : null;
                const breakEndHour = availability.break_end ? parseInt(availability.break_end.split(':')[0]) : null;

                // Get existing appointments for the day
                const existingAppointments = data.appointments.scheduled || [];
                const bookedTimes = new Set(existingAppointments.map(apt => 
                    new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                ));

                // Generate available slots
                for (let hour = startHour; hour < endHour; hour++) {
                    // Skip break time
                    if (breakStartHour && hour >= breakStartHour && hour < breakEndHour) {
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
        setNewAppointment({...newAppointment, date: selectedDate, time: ''});
        if (selectedDate) {
            checkDoctorAvailability(selectedDate);
        } else {
            setAvailableTimeSlots([]);
        }
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        try {
            // First check availability
            const availabilityResponse = await fetch('/api/appointments/check-availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId: 1,
                    date: newAppointment.date,
                    time: newAppointment.time
                })
            });

            const availabilityData = await availabilityResponse.json();
            if (!availabilityData.available) {
                alert(`Sorry, this time slot is not available: ${availabilityData.reason}`);
                return;
            }

            // If available, book the appointment
            const bookingResponse = await fetch('/api/appointments/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: patientId,
                    doctorId: 1,
                    appointmentDate: newAppointment.date,
                    appointmentTime: newAppointment.time,
                    appointmentType: newAppointment.type,
                    notes: newAppointment.notes
                })
            });

            const bookingData = await bookingResponse.json();
            if (bookingResponse.ok) {
                alert('Appointment booked successfully!');
                setShowBookingForm(false);
                setNewAppointment({
                    date: '',
                    time: '',
                    type: '',
                    doctorId: 1,
                    notes: ''
                });
                // Refresh the appointments list
                fetchAppointments();
            } else {
                throw new Error(bookingData.error || 'Failed to book appointment');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book appointment. Please try again.');
        }
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
                    await fetchAppointments();
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Appointment</h2>
                            <p className="text-gray-800 mb-4">Booking with Dr. Sarah Wilson - General Dentistry</p>
                            <form onSubmit={handleBookAppointment} className="space-y-4">
                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={newAppointment.date}
                                        onChange={handleDateChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">
                                        Time
                                        {isCheckingAvailability && <span className="ml-2 text-blue-600 text-sm">(Checking availability...)</span>}
                                    </label>
                                    <select
                                        value={newAppointment.time}
                                        onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                                        required
                                        disabled={!newAppointment.date || isCheckingAvailability}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                    >
                                        <option value="" className="text-gray-800">Select a time</option>
                                        {availableTimeSlots.map(timeSlot => (
                                            <option key={timeSlot} value={timeSlot} className="text-gray-900">
                                                {timeSlot.split(':')[0] > 12 
                                                    ? `${timeSlot.split(':')[0] - 12}:${timeSlot.split(':')[1]} PM`
                                                    : `${timeSlot} AM`}
                                            </option>
                                        ))}
                                    </select>
                                    {newAppointment.date && availableTimeSlots.length === 0 && !isCheckingAvailability && (
                                        <p className="mt-1 text-red-600 text-sm">No available time slots for this date</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">Type</label>
                                    <select
                                        value={newAppointment.type}
                                        onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                    >
                                        <option value="" className="text-gray-800">Select type</option>
                                        {appointmentTypes.map(type => (
                                            <option key={type.id} value={type.id} className="text-gray-900">
                                                {type.name} ({type.duration})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-800 font-medium mb-2">Notes (Optional)</label>
                                    <textarea
                                        value={newAppointment.notes}
                                        onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                                        rows="3"
                                        placeholder="Any specific concerns or requests?"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowBookingForm(false)}
                                        className="px-4 py-2 text-gray-800 hover:text-gray-900 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
                    {(selectedTab === 'upcoming' ? appointments.upcoming : appointments.past).map(appointment => (
                        <div key={appointment.id} className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex flex-col md:flex-row justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <FaUserMd className="text-blue-600 mr-2" />
                                        <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor_name}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center text-gray-600">
                                            <FaCalendarAlt className="mr-2" />
                                            {new Date(appointment.appointment_date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <FaClock className="mr-2" />
                                            {appointment.formatted_time}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <FaNotesMedical className="mr-2" />
                                            {appointment.appointment_type}
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
                    {(selectedTab === 'upcoming' ? appointments.upcoming : appointments.past).length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl shadow-md">
                            <p className="text-gray-600">No {selectedTab} appointments</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
