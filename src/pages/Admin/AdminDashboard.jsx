import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatClinicName } from '../../lib/utils';
import { clinicApi } from '../../services/clinicApi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [clinicData, setClinicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClinicInfo();
  }, []);

  const loadClinicInfo = async () => {
    try {
      setLoading(true);
      const response = await clinicApi.getInfo();
      console.log('Full Response:', response);
      console.log('Response Data:', response?.data);
      
      // Get data from response
      const data = response?.data || response;
      console.log('Final Data:', data);
      
      setClinicData(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load clinic info');
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
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {error && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-600">
            {error}
          </CardContent>
        </Card>
      )}

      {/* Clinic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Clinic Name</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatClinicName(clinicData?.name)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Clinic Code</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{clinicData?.code}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{clinicData?.userCount || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Clinic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => navigate('/users')}
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <Users className="h-4 w-4" />
            View All Users
          </Button>
          <Button
            onClick={() => navigate('/create-user')}
            className="w-full justify-start gap-2"
          >
            <Users className="h-4 w-4" />
            Create New User
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
