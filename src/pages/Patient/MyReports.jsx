import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { diagnosisApi } from '../../services/diagnosisApi';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await diagnosisApi.list();
      setReports(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
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
      <h1 className="text-3xl font-bold mb-6">Medical Reports</h1>

      {error && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-600">
            {error}
          </CardContent>
        </Card>
      )}

      {reports.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <p>No medical reports available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-lg">
                  Date: {new Date(report.createdAt).toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {report.diagnosis && (
                  <div>
                    <p className="font-semibold mb-2">Diagnosis:</p>
                    <p className="text-gray-700 p-3 border rounded-lg bg-blue-50">
                      {report.diagnosis}
                    </p>
                  </div>
                )}
                {report.tests && (
                  <div>
                    <p className="font-semibold mb-2">Tests Recommended:</p>
                    <p className="text-gray-700 p-3 border rounded-lg bg-purple-50">
                      {report.tests}
                    </p>
                  </div>
                )}
                {report.remarks && (
                  <div>
                    <p className="font-semibold mb-2">Doctor's Remarks:</p>
                    <p className="text-gray-700 p-3 border rounded-lg bg-green-50">
                      {report.remarks}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
