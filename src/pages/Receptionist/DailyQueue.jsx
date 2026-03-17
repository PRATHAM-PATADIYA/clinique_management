import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { visitApi } from '../../services/visitApi';

const DailyQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadQueue();
  }, [selectedDate]);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const response = await visitApi.getDaily(selectedDate);
      setQueue(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (queueId, newStatus) => {
    try {
      setUpdatingId(queueId);
      await visitApi.updateStatus(queueId, { status: newStatus });
      loadQueue();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
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
      <h1 className="text-3xl font-bold mb-6">Daily Queue</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="selectDate">Choose Date</Label>
              <Input
                id="selectDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <Button onClick={loadQueue}>Load Queue</Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-600">
            {error}
          </CardContent>
        </Card>
      )}

      {queue.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <p>No patients in queue for {new Date(selectedDate).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Queue for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-semibold">Token</th>
                      <th className="text-left py-2 px-4 font-semibold">Patient Name</th>
                      <th className="text-left py-2 px-4 font-semibold">Time</th>
                      <th className="text-left py-2 px-4 font-semibold">Status</th>
                      <th className="text-left py-2 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((entry) => (
                      <tr key={entry.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-bold text-lg">{entry.tokenNumber}</td>
                        <td className="py-3 px-4">{entry.patientName}</td>
                        <td className="py-3 px-4">{entry.appointmentTime}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(entry.status)}`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {entry.status === 'waiting' && (
                              <Button
                                size="sm"
                                onClick={() => updateStatus(entry.id, 'in_progress')}
                                disabled={updatingId === entry.id}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {updatingId === entry.id ? 'Updating...' : 'Call'}
                              </Button>
                            )}
                            {entry.status === 'in_progress' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateStatus(entry.id, 'done')}
                                  disabled={updatingId === entry.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {updatingId === entry.id ? 'Updating...' : 'Complete'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateStatus(entry.id, 'skipped')}
                                  disabled={updatingId === entry.id}
                                >
                                  Skip
                                </Button>
                              </>
                            )}
                            {(entry.status === 'done' || entry.status === 'skipped') && (
                              <span className="text-gray-500 text-sm">Completed</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DailyQueue;
