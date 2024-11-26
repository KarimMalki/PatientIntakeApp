import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/appointments', { headers }),
          axios.get('http://localhost:5000/api/doctors', { headers }),
          axios.get('http://localhost:5000/api/patients', { headers })
        ]);

        setAppointments(appointmentsRes.data);
        setDoctors(doctorsRes.data);
        setPatients(patientsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderAppointments = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  Patient: {appointment.patient_name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Doctor: {appointment.doctor_name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Date: {format(new Date(appointment.date), 'PPP')}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Time: {appointment.time}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Description: {appointment.description}
                </p>
              </div>
              <div className="ml-4">
                <span className={`px-2 py-1 text-sm rounded-full ${
                  appointment.status === 'scheduled' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderDoctors = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {doctors.map((doctor) => (
          <li key={doctor.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {doctor.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Specialization: {doctor.specialization}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Email: {doctor.email}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Phone: {doctor.phone}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderPatients = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {patients.map((patient) => (
          <li key={patient.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {patient.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Email: {patient.email}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Phone: {patient.phone}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Date of Birth: {format(new Date(patient.date_of_birth), 'PPP')}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="mb-8">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'appointments'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'doctors'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'patients'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Patients
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'appointments' && renderAppointments()}
        {activeTab === 'doctors' && renderDoctors()}
        {activeTab === 'patients' && renderPatients()}
      </div>
    </div>
  );
};

export default AdminDashboard;
