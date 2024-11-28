import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaShieldAlt, FaIdCard } from 'react-icons/fa';

export default function PatientSignup() {
    const [step, setStep] = useState(1);
    const [patientData, setPatientData] = useState({
        name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address: '',
        insurance_provider: '',
        insurance_number: '',
        emergency_contact: '',
        medical_history: '',
        preferred_communication: 'email'
    });

    const [doctors, setDoctors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            const response = await fetch('/api/doctors');
            const data = await response.json();
            setDoctors(data);
        };

        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData({ ...patientData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch('/api/patients/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Registration failed');
            }

            const data = await response.json();
            console.log('Registration successful:', data);
            
            // Redirect to patient dashboard
            window.location.href = `/patientdashboard?id=${data.patientId}`;
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.message || 'Failed to register. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={patientData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    required
                                    className="pl-10 w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={patientData.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    required
                                    className="pl-10 w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaPhone className="text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={patientData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    required
                                    className="pl-10 w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaCalendarAlt className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => {
                                        if (!e.target.value) e.target.type = 'text'
                                    }}
                                    name="date_of_birth"
                                    value={patientData.date_of_birth}
                                    onChange={handleChange}
                                    placeholder="Date of Birth"
                                    required
                                    className="pl-10 w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">Contact & Insurance</h3>
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    value={patientData.address}
                                    onChange={handleChange}
                                    placeholder="Address"
                                    className="pl-10 w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaShieldAlt className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="insurance_provider"
                                    value={patientData.insurance_provider}
                                    onChange={handleChange}
                                    placeholder="Insurance Provider"
                                    className="pl-10 w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaIdCard className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="insurance_number"
                                    value={patientData.insurance_number}
                                    onChange={handleChange}
                                    placeholder="Insurance Number"
                                    className="pl-10 w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Preferred Communication Method</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="preferred_communication"
                                            value="email"
                                            checked={patientData.preferred_communication === 'email'}
                                            onChange={handleChange}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-black ">Email</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="preferred_communication"
                                            value="phone"
                                            checked={patientData.preferred_communication === 'phone'}
                                            onChange={handleChange}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-black ">Phone</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="preferred_communication"
                                            value="text"
                                            checked={patientData.preferred_communication === 'text'}
                                            onChange={handleChange}
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-black ">Text</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800">Medical Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Emergency Contact</label>
                                <input
                                    type="text"
                                    name="emergency_contact"
                                    value={patientData.emergency_contact}
                                    onChange={handleChange}
                                    placeholder="Name and Phone Number"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Medical History</label>
                                <textarea
                                    name="medical_history"
                                    value={patientData.medical_history}
                                    onChange={handleChange}
                                    placeholder="Please list any medical conditions, allergies, or medications"
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-black"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Patient Registration</h2>
                <p className="text-gray-600 mt-2">Join our dental care family</p>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center">
                    {[1, 2, 3].map((stepNumber) => (
                        <div key={stepNumber} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                                {stepNumber}
                            </div>
                            {stepNumber < 3 && (
                                <div
                                    className={`w-24 h-1 ${
                                        step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-600">Personal Info</span>
                    <span className="text-sm text-gray-600">Contact & Insurance</span>
                    <span className="text-sm text-gray-600">Medical Info</span>
                </div>
            </div>

            <div>
                {renderStep()}
                
                <div className="mt-8 flex justify-between">
                {step < 3 ? (
    <button
        type="button"
        onClick={() => {
            console.log('Next button clicked. Current step:', step);
            setStep(step + 1);
        }}
        className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
        Next
    </button>
) : (
    <form onSubmit={(e) => {
        console.log('Form submitted on step:', step);
        handleSubmit(e);
    }}>
        <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isSubmitting ? 'Submitting...' : 'Complete Registration'}
        </button>
    </form>
)}
                </div>
            </div>
        </div>
    );
}
