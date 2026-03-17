import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { medicineApi } from '../../services/medicineApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X, Plus } from 'lucide-react';

const AddPrescription = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([{ medicineName: '', dosage: '', frequency: '', duration: '' }]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const change = (idx, field, val) => {
    const items = [...medicines];
    items[idx][field] = val;
    setMedicines(items);
  };

  const add = () => {
    setMedicines([...medicines, { medicineName: '', dosage: '', frequency: '', duration: '' }]);
  };

  const remove = (idx) => {
    const items = medicines.filter((_, i) => i !== idx);
    setMedicines(items);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const prescriptionData = {
        medicines: medicines.filter(m => m.medicineName.trim() !== ''),
        notes: notes.trim()
      };

      if (prescriptionData.medicines.length === 0 && prescriptionData.notes === '') {
        setError('Please add at least one medicine or notes');
        setLoading(false);
        return;
      }

      await medicineApi.add(appointmentId, prescriptionData);
      setSuccess('Prescription added successfully!');
      setTimeout(() => {
        navigate('/doctor-queue');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Add Prescription</h1>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Prescription for Appointment #{appointmentId}</CardTitle>
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
            {/* Medicines Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label className="text-base font-semibold">Medicines</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addNewMedicine}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Medicine
                </Button>
              </div>

              <div className="space-y-4">
                {medicines.map((medicine, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold">Medicine #{index + 1}</h4>
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor={`medicine-${index}`}>Medicine Name</Label>
                        <Input
                          id={`medicine-${index}`}
                          placeholder="e.g., Aspirin"
                          value={medicine.medicineName}
                          onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`dosage-${index}`}>Dosage</Label>
                        <Input
                          id={`dosage-${index}`}
                          placeholder="e.g., 500mg"
                          value={medicine.dosage}
                          onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`frequency-${index}`}>Frequency</Label>
                        <Input
                          id={`frequency-${index}`}
                          placeholder="e.g., Twice daily"
                          value={medicine.frequency}
                          onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`duration-${index}`}>Duration</Label>
                        <Input
                          id={`duration-${index}`}
                          placeholder="e.g., 7 days"
                          value={medicine.duration}
                          onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                placeholder="Any additional instructions or notes for the patient"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
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
                  'Save Prescription'
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

export default AddPrescription;
