import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { bookingApi } from '../../services/bookingApi';

const MyAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.list();
      setAppointments(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <Button onClick={() => navigate('/book-appointment')} className="gap-2">
          <Calendar className="h-4 w-4" />
          Book New Appointment
        </Button>
      </div>

      {error && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-600">
            {error}
          </CardContent>
        </Card>
      )}

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <p className="mb-4">No appointments booked yet</p>
            <Button onClick={() => navigate('/book-appointment')}>Book First Appointment</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">
                      {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-600">Time: {appointment.appointmentTime}</p>
                    <p className="text-gray-600">Token: <span className="font-semibold">{appointment.queueToken}</span></p>
                  </div>
                  <div className="text-right space-y-2">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                      appointment.status === 'done' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'skipped' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                    <br />
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/appointment/${appointment.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
