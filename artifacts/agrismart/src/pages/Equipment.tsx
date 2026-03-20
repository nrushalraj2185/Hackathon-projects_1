import { useState } from 'react';
import { useGetEquipmentListings, useCreateEquipmentListing, useBookEquipment } from '@workspace/api-client-react';
import { Tractor, MapPin, Star, Phone, Calendar, Plus, X, IndianRupee } from 'lucide-react';

const conditionColors: Record<string, string> = {
  excellent: 'bg-green-100 text-green-700',
  good: 'bg-blue-100 text-blue-700',
  fair: 'bg-yellow-100 text-yellow-700',
  poor: 'bg-red-100 text-red-700',
};

export default function Equipment() {
  const { data: equipment, isLoading, refetch } = useGetEquipmentListings();
  const { mutateAsync: createListing } = useCreateEquipmentListing();
  const { mutateAsync: bookEquipment } = useBookEquipment();
  const [showForm, setShowForm] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [bookingForm, setBookingForm] = useState({ fromDate: '', toDate: '', farmerName: '', farmerPhone: '', notes: '' });
  const [listingForm, setListingForm] = useState({ name: '', type: '', ratePerDay: '', location: '', ownerName: '', ownerPhone: '', condition: 'good', brand: '', model: '' });

  const mockEquipment = [
    { id: 1, name: 'Mahindra 575 DI Tractor', type: 'Tractor', ratePerDay: 1800, location: 'Amritsar, Punjab', ownerName: 'Balvinder Singh', ownerPhone: '+91 98765 11223', available: true, condition: 'good', brand: 'Mahindra', model: '575 DI', yearOfMake: 2020, description: '47HP tractor with rotavator. Ideal for field preparation.' },
    { id: 2, name: 'John Deere Combine Harvester', type: 'Harvester', ratePerDay: 4500, location: 'Ludhiana, Punjab', ownerName: 'Sukhwinder Kaur', ownerPhone: '+91 97654 33221', available: true, condition: 'excellent', brand: 'John Deere', model: 'W70', yearOfMake: 2022, description: 'Wheat and paddy harvester. Operator included.' },
    { id: 3, name: 'Boom Sprayer', type: 'Sprayer', ratePerDay: 600, location: 'Patiala, Punjab', ownerName: 'Raj Kumar', ownerPhone: '+91 96543 22110', available: false, condition: 'fair', brand: 'Aspee', model: 'HTP-16', yearOfMake: 2019, description: '16L capacity knapsack sprayer.' },
  ];

  const displayEquipment = (!equipment || equipment.length === 0) ? mockEquipment : equipment;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;
    await bookEquipment({ equipmentId: bookingId, fromDate: bookingForm.fromDate, toDate: bookingForm.toDate, farmerName: bookingForm.farmerName, farmerPhone: bookingForm.farmerPhone, notes: bookingForm.notes });
    setBookingId(null);
    setBookingForm({ fromDate: '', toDate: '', farmerName: '', farmerPhone: '', notes: '' });
    alert('Booking request sent! The owner will contact you shortly.');
  };

  const handleList = async (e: React.FormEvent) => {
    e.preventDefault();
    await createListing({ name: listingForm.name, type: listingForm.type, ratePerDay: Number(listingForm.ratePerDay), location: listingForm.location, ownerName: listingForm.ownerName, ownerPhone: listingForm.ownerPhone, condition: listingForm.condition as any, brand: listingForm.brand, model: listingForm.model });
    setShowForm(false);
    refetch();
  };

  if (isLoading) return <div className="flex items-center justify-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipment Rental</h1>
          <p className="text-muted-foreground mt-1">Rent machinery from nearby owners or list your equipment</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> List Equipment
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">List Your Equipment</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleList} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[{ label: 'Equipment Name', key: 'name', placeholder: 'e.g., Mahindra Tractor' }, { label: 'Type', key: 'type', placeholder: 'Tractor/Harvester/Sprayer' }, { label: 'Brand', key: 'brand', placeholder: 'Mahindra/JD' }, { label: 'Model', key: 'model', placeholder: 'Model no.' }, { label: 'Owner Name', key: 'ownerName', placeholder: 'Your name' }, { label: 'Phone', key: 'ownerPhone', placeholder: '+91 XXXXX XXXXX' }, { label: 'Location', key: 'location', placeholder: 'Town/District' }].map(({ label, key, placeholder }) => (
                  <div key={key} className={key === 'name' || key === 'location' ? 'col-span-2' : ''}>
                    <label className="block text-sm font-medium mb-1">{label}</label>
                    <input className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder={placeholder} value={(listingForm as any)[key]} onChange={e => setListingForm(f => ({ ...f, [key]: e.target.value }))} required={['name', 'type', 'ownerName', 'location'].includes(key)} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium mb-1">Rate/Day (₹)</label>
                  <input type="number" className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="1500" value={listingForm.ratePerDay} onChange={e => setListingForm(f => ({ ...f, ratePerDay: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Condition</label>
                  <select className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={listingForm.condition} onChange={e => setListingForm(f => ({ ...f, condition: e.target.value }))}>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition">List Equipment</button>
            </form>
          </div>
        </div>
      )}

      {bookingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Book Equipment</h2>
              <button onClick={() => setBookingId(null)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">From Date</label><input type="date" className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={bookingForm.fromDate} onChange={e => setBookingForm(f => ({ ...f, fromDate: e.target.value }))} required /></div>
                <div><label className="block text-sm font-medium mb-1">To Date</label><input type="date" className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={bookingForm.toDate} onChange={e => setBookingForm(f => ({ ...f, toDate: e.target.value }))} required /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Your Name</label><input className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={bookingForm.farmerName} onChange={e => setBookingForm(f => ({ ...f, farmerName: e.target.value }))} required /></div>
              <div><label className="block text-sm font-medium mb-1">Your Phone</label><input className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={bookingForm.farmerPhone} onChange={e => setBookingForm(f => ({ ...f, farmerPhone: e.target.value }))} /></div>
              <div><label className="block text-sm font-medium mb-1">Notes</label><textarea className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" rows={2} value={bookingForm.notes} onChange={e => setBookingForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition">Send Booking Request</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {displayEquipment.map((eq: any) => (
          <div key={eq.id} className="bg-card border rounded-2xl p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tractor className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">{eq.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conditionColors[eq.condition] || 'bg-gray-100'}`}>{eq.condition}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${eq.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{eq.available ? 'Available' : 'Booked'}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{eq.location}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" />₹{eq.ratePerDay}/day</span>
                  {eq.brand && <span>{eq.brand} {eq.model}</span>}
                  {eq.yearOfMake && <span>{eq.yearOfMake}</span>}
                </div>
                {eq.description && <p className="mt-2 text-sm text-muted-foreground">{eq.description}</p>}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-right">
                  <p className="font-bold text-xl text-primary">₹{eq.ratePerDay}</p>
                  <p className="text-xs text-muted-foreground">per day</p>
                </div>
                {eq.ownerPhone && <a href={`tel:${eq.ownerPhone}`} className="flex items-center gap-1 text-sm text-primary hover:underline"><Phone className="w-3 h-3" />{eq.ownerPhone}</a>}
                {eq.available && (
                  <button onClick={() => setBookingId(eq.id)} className="bg-primary text-primary-foreground text-sm px-3 py-1.5 rounded-xl hover:opacity-90 transition">Book Now</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
