import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { diagnosisApi } from '../../services/diagnosisApi';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AddReport = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState('');
  const [tests, setTests] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!diagnosis.trim()) {
      setError('Please enter diagnosis');
      return;
    }

    setLoading(true);

    try {
      const reportData = {
        diagnosis: diagnosis.trim(),
        tests: tests.trim(),
        remarks: remarks.trim()
      };

      await diagnosisApi.add(appointmentId, reportData);
      setSuccess('Report added successfully!');
      setTimeout(() => {
        navigate('/doctor-queue');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Add Medical Report</h1>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Medical Report for Appointment #{appointmentId}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Diagnosis */}
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <textarea
                id="diagnosis"
                placeholder="Enter patient diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>

            {/* Tests */}
            <div className="space-y-2">
              <Label htmlFor="tests">Tests Recommended</Label>
              <textarea
                id="tests"
                placeholder="List any recommended tests"
                value={tests}
                onChange={(e) => setTests(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks">Additional Remarks</Label>
              <textarea
                id="remarks"
                placeholder="Add any additional remarks or follow-up instructions"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Report'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/doctor-queue')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddReport;
