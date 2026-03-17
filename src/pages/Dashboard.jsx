import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { clinicApi } from '../services/clinicApi';
import { bookingApi } from '../services/bookingApi';
import { formatClinicName } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users,
  Pill,
  FileText,
  Stethoscope,
  ClipboardList
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      if (user?.role === 'admin') {
        const clinicInfo = await clinicApi.getInfo();
        console.log('Clinic info response:', clinicInfo);
        // Access data from response object
        const data = clinicInfo?.data || clinicInfo;
        setDashboardData(data);
      } else if (user?.role === 'patient') {
        const appointments = await bookingApi.list();
        setDashboardData({ appointments });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Welcome card */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold text-blue-900">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray-600 mt-2">
            Role: <span className="font-semibold capitalize">{user?.role}</span>
            {user?.clinicName && (
              <> | Clinic: <span className="font-semibold">{formatClinicName(user?.clinicName)}</span></>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Admin Dashboard */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clinic Name</CardTitle>
              <Stethoscope className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatClinicName(dashboardData?.name)}</div>
              <p className="text-xs text-gray-500">Code: {dashboardData?.code}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.userCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.appointmentCount || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Patient Dashboard */}
      {user?.role === 'patient' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/book-appointment')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Book Appointment</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <Button className="w-full mt-4" size="sm">Book Now</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/my-appointments')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Appointments</CardTitle>
                <ClipboardList className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <Button className="w-full mt-4" size="sm" variant="outline">View</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/my-prescriptions')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
                <Pill className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <Button className="w-full mt-4" size="sm" variant="outline">View</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.appointments && dashboardData.appointments.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.appointments.slice(0, 5).map((apt) => (
                    <div key={apt.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Time: {apt.appointmentTime}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        apt.status === 'done' ? 'bg-green-100 text-green-800' :
                        apt.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        apt.status === 'skipped' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No appointments yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Receptionist Dashboard */}
      {user?.role === 'receptionist' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/daily-queue')}>
            <CardHeader>
              <CardTitle>Daily Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage today's patient queue and status updates</p>
              <Button className="w-full">View Queue</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Doctor Dashboard */}
      {user?.role === 'doctor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/doctor-queue')}>
            <CardHeader>
              <CardTitle>Today's Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View patients and add prescription/report</p>
              <Button className="w-full">View Queue</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
