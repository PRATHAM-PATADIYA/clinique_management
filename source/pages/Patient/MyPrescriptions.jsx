import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { medicineApi } from '../../services/medicineApi';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await medicineApi.list();
      setPrescriptions(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load prescriptions');
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
      <h1 className="text-3xl font-bold mb-6">My Prescriptions</h1>

      {error && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-600">
            {error}
          </CardContent>
        </Card>
      )}

      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            <p>No prescriptions available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id} className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-lg">
                  Date: {new Date(prescription.createdAt).toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prescription.medicines && prescription.medicines.length > 0 && (
                  <div>
                    <p className="font-semibold mb-3">Medicines:</p>
                    <div className="space-y-2">
                      {prescription.medicines.map((med, idx) => (
                        <div key={idx} className="p-3 border rounded-lg bg-blue-50">
                          <p className="font-medium text-blue-900">{med.medicineName}</p>
                          <p className="text-sm text-blue-700">Dosage: {med.dosage}</p>
                          {med.frequency && (
                            <p className="text-sm text-blue-700">Frequency: {med.frequency}</p>
                          )}
                          {med.duration && (
                            <p className="text-sm text-blue-700">Duration: {med.duration}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {prescription.notes && (
                  <div>
                    <p className="font-semibold mb-2">Additional Notes:</p>
                    <p className="text-gray-700 p-3 border rounded-lg bg-gray-50">
                      {prescription.notes}
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

export default MyPrescriptions;
