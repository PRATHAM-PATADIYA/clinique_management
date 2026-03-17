import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { visitApi } from '../../services/visitApi';

const DoctorQueue = () => {
  const navigate = useNavigate();
  const [queueItems, setQueueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTodayQueue();
  }, []);

  const loadTodayQueue = async () => {
    try {
      setLoading(true);
      const response = await visitApi.getToday();
      setQueueItems(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'waiting': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'done': 'bg-green-100 text-green-800',
      'skipped': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold">Today's Queue</h1>
        <Button onClick={loadTodayQueue} variant="outline">Refresh</Button>
      </div>

      {error && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-600">
            {error}
          </CardContent>
        </Card>
      )}

      {queueItems.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <p>No patients in queue for today</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {queueItems.map((item) => (
            <Card key={item.queueId} className="hover:shadow-lg transition">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">Token: <span className="text-xl">{item.tokenNumber}</span></p>
                    <p className="text-gray-600">Patient: {item.patientName}</p>
                    <p className="text-gray-600">Time: {item.appointmentTime}</p>
                  </div>
                  <div className="text-right space-y-3">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <div className="space-y-2">
                      {item.status === 'in_progress' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/add-prescription/${item.appointmentId}`)}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            Add Prescription
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => navigate(`/add-report/${item.appointmentId}`)}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                          >
                            Add Report
                          </Button>
                        </>
                      )}
                    </div>
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

export default DoctorQueue;
