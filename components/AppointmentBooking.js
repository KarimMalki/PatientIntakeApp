import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUserMd, FaNotesMedical, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function AppointmentBooking({ patientId }) {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentType, setAppointmentType] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [error, setError] = useState('');

    const appointmentTypes = [
        { id: 'Regular Checkup', name: 'Regular Checkup', duration: '30 min', price: '$75' },
        { id: 'Cleaning', name: 'Teeth Cleaning', duration: '45 min', price: '$100' },
        { id: 'Root Canal', name: 'Root Canal', duration: '60 min', price: '$800' },
        { id: 'Filling', name: 'Filling', duration: '45 min', price: '$200' },
        { id: 'Crown', name: 'Crown', duration: '60 min', price: '$1000' },
        { id: 'Extraction', name: 'Extraction', duration: '30 min', price: '$300' }
    ];

    // Fetch doctors on component mount
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('/api/doctors');
                const data = await response.json();
                if (data.doctors) {
                    setDoctors(data.doctors);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setError('Failed to load doctors. Please try again later.');
            }
        };

        fetchDoctors();
    }, []);

    // Check availability when doctor and date are selected
    useEffect(() => {
        const checkAvailability = async () => {
            if (!selectedDoctor || !appointmentDate) return;

            try {
                const timeSlots = [];
                // Check availability for each hour from 9 AM to 5 PM
                for (let hour = 9; hour < 17; hour++) {
                    const time = `${hour.toString().padStart(2, '0')}:00`;
                    const response = await fetch('/api/appointments/check-availability', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            doctorId: selectedDoctor,
                            date: appointmentDate,
                            time: time
                        })
                    });

                    const data = await response.json();
                    if (data.available) {
                        timeSlots.push(time);
                        // Also add :30 slot if not during break
                        const halfHourTime = `${hour.toString().padStart(2, '0')}:30`;
                        const halfHourResponse = await fetch('/api/appointments/check-availability', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                doctorId: selectedDoctor,
                                date: appointmentDate,
                                time: halfHourTime
                            })
                        });
                        const halfHourData = await halfHourResponse.json();
                        if (halfHourData.available) {
                            timeSlots.push(halfHourTime);
                        }
                    }
                }
                setAvailableTimeSlots(timeSlots);
            } catch (error) {
                console.error('Error checking availability:', error);
                setError('Failed to check availability. Please try again.');
            }
        };

        checkAvailability();
    }, [selectedDoctor, appointmentDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Final availability check
            const availabilityResponse = await fetch('/api/appointments/check-availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId: selectedDoctor,
                    date: appointmentDate,
                    time: selectedTime
                })
            });

            const availabilityData = await availabilityResponse.json();
            if (!availabilityData.available) {
                setError(availabilityData.reason || 'This time slot is no longer available');
                return;
            }

            // Book the appointment
            const response = await fetch('/api/appointments/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId,
                    doctorId: selectedDoctor,
                    appointmentDate,
                    appointmentTime: selectedTime,
                    appointmentType,
                    notes
                })
            });

            const data = await response.json();
            if (response.ok) {
                setShowConfirmation(true);
            } else {
                setError(data.error || 'Failed to book appointment');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            setError('Failed to book appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showConfirmation) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
                <div className="mb-6">
                    <FaCheckCircle className="mx-auto text-6xl text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                    Your appointment has been successfully scheduled for {appointmentDate} at {selectedTime}
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Appointment Details:</h3>
                    <p className="text-gray-600">Doctor: {doctors.find(d => d.id === selectedDoctor)?.name}</p>
                    <p className="text-gray-600">Type: {appointmentTypes.find(t => t.id === appointmentType)?.name}</p>
                </div>
                <button
                    onClick={() => {
                        setShowConfirmation(false);
                        setSelectedDoctor('');
                        setAppointmentDate('');
                        setAppointmentType('');
                        setSelectedTime('');
                        setNotes('');
                    }}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Book Another Appointment
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Schedule an Appointment</h2>
                <p className="text-gray-600 mt-2">Choose your preferred time and doctor</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex items-center">
                        <FaExclamationCircle className="text-red-500 mr-2" />
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        <FaUserMd className="inline mr-2" />
                        Select Doctor
                    </label>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => {
                            setSelectedDoctor(e.target.value);
                            setSelectedTime(''); // Reset time when doctor changes
                        }}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                        <option value="">Choose a doctor</option>
                        {doctors.map(doctor => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name} - {doctor.specialty}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        <FaNotesMedical className="inline mr-2" />
                        Appointment Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {appointmentTypes.map(type => (
                            <div
                                key={type.id}
                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                    appointmentType === type.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                                onClick={() => setAppointmentType(type.id)}
                            >
                                <h3 className="font-medium text-gray-900">{type.name}</h3>
                                <p className="text-sm text-gray-600">Duration: {type.duration}</p>
                                <p className="text-sm font-medium text-blue-600">{type.price}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            <FaCalendarAlt className="inline mr-2" />
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => {
                                setAppointmentDate(e.target.value);
                                setSelectedTime(''); // Reset time when date changes
                            }}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            <FaClock className="inline mr-2" />
                            Select Time
                        </label>
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            <option value="">Choose a time</option>
                            {availableTimeSlots.map(time => (
                                <option key={time} value={time}>
                                    {time.padStart(5, '0')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Additional Notes
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any specific concerns or questions?"
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !availableTimeSlots.length}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Booking Appointment...
                        </span>
                    ) : (
                        'Schedule Appointment'
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
                <p>Need to cancel or reschedule?</p>
                <p>Contact us at (555) 123-4567 or support@dentalcare.com</p>
            </div>
        </div>
    );
}
