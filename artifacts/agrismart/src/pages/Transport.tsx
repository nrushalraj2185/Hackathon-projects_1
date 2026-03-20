import { useState } from 'react';
import { useGetTransportRequests, useCreateTransportRequest } from '@workspace/api-client-react';
import { Truck, MapPin, Calendar, Package, Plus, X, Phone } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Transport() {
  const { data: requests, isLoading, refetch } = useGetTransportRequests();
  const { mutateAsync: createRequest } = useCreateTransportRequest();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ farmerName: '', farmerPhone: '', pickupLocation: '', dropLocation: '', cropType: '', quantity: '', unit: 'quintal', scheduledDate: '', scheduledTime: '', notes: '' });

  const mockRequests = [
    { id: 1, farmerName: 'Gurpreet Singh', farmerPhone: '+91 98765 43210', pickupLocation: 'Village Kotla, Amritsar', dropLocation: 'Amritsar Mandi', cropType: 'Wheat', quantity: 50, unit: 'quintal', scheduledDate: '2026-03-25', scheduledTime: '06:00 AM', status: 'accepted', driverName: 'Ranjit Kumar', driverPhone: '+91 87654 32109', estimatedCost: 1500, createdAt: '2026-03-20T10:00:00Z' },
    { id: 2, farmerName: 'Harjit Kaur', farmerPhone: '+91 97654 32109', pickupLocation: 'Village Bhikhiwind', dropLocation: 'Tarn Taran APMC', cropType: 'Rice', quantity: 30, unit: 'quintal', scheduledDate: '2026-03-28', scheduledTime: '07:00 AM', status: 'pending', createdAt: '2026-03-20T11:00:00Z' },
  ];

  const displayRequests = (!requests || requests.length === 0) ? mockRequests : requests;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRequest({ farmerName: form.farmerName, farmerPhone: form.farmerPhone, pickupLocation: form.pickupLocation, dropLocation: form.dropLocation, cropType: form.cropType, quantity: Number(form.quantity), unit: form.unit, scheduledDate: form.scheduledDate, scheduledTime: form.scheduledTime, notes: form.notes });
    setShowForm(false);
    setForm({ farmerName: '', farmerPhone: '', pickupLocation: '', dropLocation: '', cropType: '', quantity: '', unit: 'quintal', scheduledDate: '', scheduledTime: '', notes: '' });
    refetch();
  };

  if (isLoading) return <div className="flex items-center justify-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transport & Logistics</h1>
          <p className="text-muted-foreground mt-1">Request doorstep pickup of your produce to markets or storage</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Request Pickup
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Request Produce Pickup</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Your Name</label><input className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={form.farmerName} onChange={e => setForm(f => ({ ...f, farmerName: e.target.value }))} required /></div>
                <div><label className="block text-sm font-medium mb-1">Phone</label><input className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={form.farmerPhone} onChange={e => setForm(f => ({ ...f, farmerPhone: e.target.value }))} /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Pickup Location</label><input className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Village/Town name" value={form.pickupLocation} onChange={e => setForm(f => ({ ...f, pickupLocation: e.target.value }))} required /></div>
              <div><label className="block text-sm font-medium mb-1">Drop Location (Market/Storage)</label><input className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Market name or storage facility" value={form.dropLocation} onChange={e => setForm(f => ({ ...f, dropLocation: e.target.value }))} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Crop Type</label><input className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., Wheat" value={form.cropType} onChange={e => setForm(f => ({ ...f, cropType: e.target.value }))} required /></div>
                <div><label className="block text-sm font-medium mb-1">Quantity</label><input type="number" className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="50" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required /></div>
                <div><label className="block text-sm font-medium mb-1">Unit</label><select className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}><option value="quintal">Quintal</option><option value="kg">Kg</option><option value="ton">Ton</option><option value="crate">Crate</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Date</label><input type="date" className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={form.scheduledDate} onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))} required /></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1">Preferred Time</label><input type="time" className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={form.scheduledTime} onChange={e => setForm(f => ({ ...f, scheduledTime: e.target.value }))} /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Notes</label><textarea className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" rows={2} placeholder="Any special instructions..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition">Submit Request</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {displayRequests.map((req: any) => (
          <div key={req.id} className="bg-card border rounded-2xl p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{req.cropType} — {req.quantity} {req.unit}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[req.status] || 'bg-gray-100'}`}>{req.status.replace('_', ' ').toUpperCase()}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-green-500" />From: {req.pickupLocation}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-red-500" />To: {req.dropLocation}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(req.scheduledDate).toLocaleDateString('en-IN')} {req.scheduledTime || ''}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{req.farmerName}: {req.farmerPhone}</span>
                  {req.driverName && <span className="flex items-center gap-1 text-green-600"><Truck className="w-4 h-4" />Driver: {req.driverName} ({req.driverPhone})</span>}
                  {req.estimatedCost && <span className="font-medium text-primary">Est. Cost: ₹{req.estimatedCost}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
        {displayRequests.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Truck className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No transport requests yet</p>
            <p className="text-sm">Request pickup of your produce to markets or storage</p>
          </div>
        )}
      </div>
    </div>
  );
}
