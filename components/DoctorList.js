import { useEffect, useState } from 'react';
import { FaUserMd, FaCalendarAlt, FaStar, FaSearch, FaFilter } from 'react-icons/fa';

export default function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    // Dummy data for development
    const dummyDoctors = [
        {
            id: 1,
            name: 'Dr. Sarah Wilson',
            specialty: 'Orthodontist',
            email: 'sarah.wilson@dentalcare.com',
            phone: '(555) 123-4567',
            education: 'Harvard School of Dental Medicine',
            experience: '15 years',
            rating: 4.9,
            reviews: 127,
            availability: ['Mon', 'Wed', 'Fri'],
            image: '/portrait1.jpg',
            specializations: ['Braces', 'Invisalign', 'Teeth Alignment']
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialty: 'Dental Surgeon',
            email: 'michael.chen@dentalcare.com',
            phone: '(555) 234-5678',
            education: 'UCLA School of Dentistry',
            experience: '12 years',
            rating: 4.8,
            reviews: 98,
            availability: ['Tue', 'Thu', 'Sat'],
            image: '/portrait2.jpg',
            specializations: ['Wisdom Teeth', 'Dental Implants', 'Oral Surgery']
        }
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            setIsLoading(true);
            try {
                // Simulating API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setDoctors(dummyDoctors);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const specialties = ['all', ...new Set(dummyDoctors.map(doctor => doctor.specialty))];

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    const renderRatingStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={`inline ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Medical Team</h2>
                <p className="text-gray-600">Expert dentists committed to your oral health</p>
            </div>

            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search doctors by name or specialty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaFilter className="text-gray-400" />
                    </div>
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="pl-10 w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none"
                    >
                        {specialties.map(specialty => (
                            <option key={specialty} value={specialty}>
                                {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="md:flex">
                            <div className="md:flex-shrink-0">
                                <img
                                    className="h-48 w-full md:w-48 object-cover"
                                    src={doctor.image}
                                    alt={doctor.name}
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {doctor.specialty}
                                    </span>
                                </div>
                                
                                <div className="mt-2 flex items-center">
                                    {renderRatingStars(doctor.rating)}
                                    <span className="ml-2 text-gray-600">{doctor.rating} ({doctor.reviews} reviews)</span>
                                </div>

                                <div className="mt-4 text-gray-600">
                                    <p><FaUserMd className="inline mr-2" />{doctor.experience} experience</p>
                                    <p className="mt-1">{doctor.education}</p>
                                </div>

                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-900">Specializations:</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {doctor.specializations.map((spec, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                                            >
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-900">Available Days:</h4>
                                    <div className="mt-2 flex gap-2">
                                        {doctor.availability.map((day, index) => (
                                            <span
                                                key={index}
                                                className="flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
                                            >
                                                <FaCalendarAlt className="mr-1" />
                                                {day}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600">No doctors found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
