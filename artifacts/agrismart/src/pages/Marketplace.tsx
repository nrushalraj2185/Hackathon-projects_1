import { useState } from 'react';
import { useGetMarketPrices, useGetMarketListings, useCreateMarketListing } from '@workspace/api-client-react';
import { Store, TrendingUp, TrendingDown, MapPin, Phone, Search, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const listingSchema = z.object({
  type: z.enum(['buy', 'sell']),
  cropName: z.string().min(1),
  quantity: z.coerce.number().min(1),
  unit: z.string().min(1),
  pricePerUnit: z.coerce.number().min(1),
  location: z.string().min(1),
  contactName: z.string().min(1),
  contactPhone: z.string().min(10),
});

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<'prices'|'listings'>('prices');
  const [isAdding, setIsAdding] = useState(false);
  
  const { data: prices, isLoading: loadingPrices } = useGetMarketPrices();
  const { data: listings, isLoading: loadingListings } = useGetMarketListings();
  const createListing = useCreateMarketListing();

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: { type: 'sell', unit: 'Quintal' }
  });

  const onSubmit = (data: any) => {
    createListing.mutate({ data }, {
      onSuccess: () => {
        setIsAdding(false);
        reset();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Live prices and local buying/selling</p>
        </div>
        {activeTab === 'listings' && (
          <button onClick={() => setIsAdding(true)} className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg flex items-center gap-2">
            <Plus className="w-5 h-5" /> Post Listing
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-max">
        <button 
          onClick={() => setActiveTab('prices')}
          className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'prices' ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Live Mandi Prices
        </button>
        <button 
          onClick={() => setActiveTab('listings')}
          className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'listings' ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Buy/Sell Listings
        </button>
      </div>

      {activeTab === 'prices' && (
        <div className="bg-card rounded-3xl shadow-sm border border-border/50 overflow-hidden animate-in-up">
          <div className="p-4 border-b bg-muted/20 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search crops or markets..." className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/10">
                <tr>
                  <th className="px-6 py-4">Crop</th>
                  <th className="px-6 py-4">Market</th>
                  <th className="px-6 py-4">Price (per Qtl)</th>
                  <th className="px-6 py-4">Change</th>
                  <th className="px-6 py-4 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {(prices || [
                  { id:1, cropName:'Wheat', market:'Delhi Azadpur', pricePerQuintal: 2450, priceChange: 50, priceChangePercent: 2.1, updatedAt: new Date().toISOString() },
                  { id:2, cropName:'Rice (Basmati)', market:'Karnal', pricePerQuintal: 4200, priceChange: -20, priceChangePercent: -0.5, updatedAt: new Date().toISOString() },
                  { id:3, cropName:'Cotton', market:'Bathinda', pricePerQuintal: 6800, priceChange: 150, priceChangePercent: 2.2, updatedAt: new Date().toISOString() },
                ]).map(price => (
                  <tr key={price.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{price.cropName}</td>
                    <td className="px-6 py-4 text-muted-foreground">{price.market}</td>
                    <td className="px-6 py-4 font-semibold">₹{price.pricePerQuintal}</td>
                    <td className="px-6 py-4">
                      {price.priceChange && price.priceChange > 0 ? (
                        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded w-max text-xs font-bold">
                          <TrendingUp className="w-3 h-3" /> +₹{price.priceChange} ({price.priceChangePercent}%)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded w-max text-xs font-bold">
                          <TrendingDown className="w-3 h-3" /> ₹{price.priceChange} ({price.priceChangePercent}%)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-muted-foreground">Today</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in-up">
          {(listings || [
            { id:1, type:'sell', cropName:'Organic Wheat', quantity:50, unit:'Qtl', pricePerUnit:2500, location:'Ludhiana, PB', contactName:'Gurpreet Singh', contactPhone:'9876543210', status:'active' },
            { id:2, type:'buy', cropName:'Corn', quantity:20, unit:'Qtl', pricePerUnit:1900, location:'Hisar, HR', contactName:'Amit Kumar', contactPhone:'9876543210', status:'active' }
          ]).map((listing: any) => (
            <div key={listing.id} className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  listing.type === 'sell' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {listing.type === 'sell' ? 'For Sale' : 'Looking to Buy'}
                </span>
                <span className="font-bold text-xl text-primary">₹{listing.pricePerUnit}<span className="text-sm text-muted-foreground font-normal">/{listing.unit}</span></span>
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-1">{listing.cropName}</h3>
              <p className="text-muted-foreground font-medium mb-6">Quantity: {listing.quantity} {listing.unit}</p>
              
              <div className="mt-auto space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" /> {listing.location}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs">
                      {listing.contactName?.[0]}
                    </div>
                    <span className="text-sm font-medium">{listing.contactName}</span>
                  </div>
                  <a href={`tel:${listing.contactPhone}`} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in-up">
            <div className="p-6 border-b flex justify-between items-center bg-muted/30">
              <h2 className="text-xl font-bold font-display">Create Listing</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="flex gap-4">
                <label className="flex-1 flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" value="sell" {...register('type')} className="accent-primary" />
                  <span className="font-medium">I want to Sell</span>
                </label>
                <label className="flex-1 flex items-center gap-2 p-3 border rounded-xl cursor-pointer hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" value="buy" {...register('type')} className="accent-primary" />
                  <span className="font-medium">I want to Buy</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground/80">Crop Name</label>
                <input {...register('cropName')} className="w-full px-4 py-3 rounded-xl bg-background border focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground/80">Quantity</label>
                  <div className="flex">
                    <input type="number" {...register('quantity')} className="w-full px-4 py-3 rounded-l-xl bg-background border focus:ring-2 focus:ring-primary/20 outline-none" />
                    <select {...register('unit')} className="px-3 py-3 rounded-r-xl bg-muted border-y border-r outline-none font-medium">
                      <option value="Qtl">Qtl</option>
                      <option value="Ton">Ton</option>
                      <option value="Kg">Kg</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground/80">Price per Unit (₹)</label>
                  <input type="number" {...register('pricePerUnit')} className="w-full px-4 py-3 rounded-xl bg-background border focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-foreground/80">Location</label>
                <input {...register('location')} className="w-full px-4 py-3 rounded-xl bg-background border focus:ring-2 focus:ring-primary/20 outline-none" placeholder="City, State" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground/80">Your Name</label>
                  <input {...register('contactName')} className="w-full px-4 py-3 rounded-xl bg-background border focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground/80">Phone Number</label>
                  <input {...register('contactPhone')} className="w-full px-4 py-3 rounded-xl bg-background border focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={createListing.isPending} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
                  {createListing.isPending ? 'Posting...' : 'Post Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
