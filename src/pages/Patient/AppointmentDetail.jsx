import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { bookingApi } from '../../services/bookingApi';

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAppointmentDetail();
  }, [id]);

  const loadAppointmentDetail = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getOne(id);
      setAppointment(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointment details');
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

  if (error || !appointment) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate('/my-appointments')} className="gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-600">
            {error || 'Appointment not found'}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Button variant="ghost" onClick={() => navigate('/my-appointments')} className="gap-2 mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-6">Appointment Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold text-lg">
                {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-semibold">{appointment.appointmentTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Queue Token</p>
              <p className="font-semibold text-lg">{appointment.queueToken}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                appointment.status === 'done' ? 'bg-green-100 text-green-800' :
                appointment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                appointment.status === 'skipped' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {appointment.status}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Prescription */}
        <Card>
          <CardHeader>
            <CardTitle>Prescription</CardTitle>
          </CardHeader>
          <CardContent>
            {appointment.prescription ? (
              <div className="space-y-3">
                {appointment.prescription.medicines && appointment.prescription.medicines.length > 0 && (
                  <div>
                    <p className="font-semibold mb-2">Medicines:</p>
                    <ul className="space-y-2">
                      {appointment.prescription.medicines.map((med, idx) => (
                        <li key={idx} className="text-sm border-l-2 border-blue-300 pl-3">
                          <p className="font-medium">{med.medicineName}</p>
                          <p className="text-gray-600">{med.dosage}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {appointment.prescription.notes && (
                  <div>
                    <p className="font-semibold mb-1">Notes:</p>
                    <p className="text-gray-700">{appointment.prescription.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No prescription added yet</p>
            )}
          </CardContent>
        </Card>

        {/* Report */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Report</CardTitle>
          </CardHeader>
          <CardContent>
            {appointment.report ? (
              <div className="space-y-3">
                {appointment.report.diagnosis && (
                  <div>
                    <p className="font-semibold mb-1">Diagnosis:</p>
                    <p className="text-gray-700">{appointment.report.diagnosis}</p>
                  </div>
                )}
                {appointment.report.tests && (
                  <div>
                    <p className="font-semibold mb-1">Tests:</p>
                    <p className="text-gray-700">{appointment.report.tests}</p>
                  </div>
                )}
                {appointment.report.remarks && (
                  <div>
                    <p className="font-semibold mb-1">Remarks:</p>
                    <p className="text-gray-700">{appointment.report.remarks}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No report added yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentDetail;
