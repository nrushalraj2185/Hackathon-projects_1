import { useState } from 'react';
import { useGetCrops, useCreateCrop } from '@workspace/api-client-react';
import { Sprout, Plus, MapPin, Calendar, Activity, X } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';

const createCropSchema = z.object({
  name: z.string().min(1, "Crop name is required"),
  variety: z.string().optional(),
  fieldName: z.string().min(1, "Field name is required"),
  areaHectares: z.coerce.number().min(0.1),
  plantingDate: z.string().min(1, "Planting date is required"),
  status: z.enum(['planted', 'growing', 'flowering', 'harvesting', 'harvested']),
});

export default function Crops() {
  const [isAdding, setIsAdding] = useState(false);
  const { data: crops, isLoading } = useGetCrops();
  const createCrop = useCreateCrop();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(createCropSchema),
    defaultValues: { status: 'planted' }
  });

  const onSubmit = (data: any) => {
    createCrop.mutate({ data }, {
      onSuccess: () => {
        setIsAdding(false);
        reset();
        queryClient.invalidateQueries({ queryKey: ['/api/crops'] });
      }
    });
  };

  const getHealthColor = (status: string) => {
    switch(status) {
      case 'excellent': return 'text-green-600 bg-green-100 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'poor': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading crops...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">My Crops</h1>
          <p className="text-muted-foreground">Manage and track your fields</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Crop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops?.map((crop) => (
          <div key={crop.id} className="bg-card rounded-3xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{crop.name}</h3>
                  <p className="text-sm text-muted-foreground">{crop.variety || 'Standard Variety'}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getHealthColor(crop.healthStatus)}`}>
                {crop.healthStatus}
              </span>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary/70" />
                <span className="font-medium text-foreground">{crop.fieldName}</span>
                <span className="ml-auto bg-muted px-2 py-0.5 rounded text-xs">{crop.areaHectares} ha</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary/70" />
                <span>Planted: <span className="font-medium text-foreground">{crop.plantingDate ? format(new Date(crop.plantingDate), 'MMM d, yyyy') : 'N/A'}</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Activity className="w-4 h-4 text-primary/70" />
                <span>Status: <span className="font-medium text-foreground capitalize">{crop.status}</span></span>
              </div>
            </div>
          </div>
        ))}

        {(!crops || crops.length === 0) && (
          <div className="col-span-full bg-muted/30 border-2 border-dashed border-border rounded-3xl p-12 text-center">
            <Sprout className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No crops planted yet</h3>
            <p className="text-muted-foreground mb-6">Add your first crop to start tracking its progress.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="px-6 py-2 bg-white text-primary font-semibold rounded-xl border shadow-sm hover:bg-gray-50 transition-all"
            >
              Add Crop
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in-up">
            <div className="p-6 border-b flex justify-between items-center bg-muted/30">
              <h2 className="text-xl font-bold font-display">Add New Crop</h2>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground/80">Crop Name</label>
                <input {...register('name')} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. Wheat" />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message as string}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground/80">Field Name</label>
                  <input {...register('fieldName')} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. North Field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground/80">Area (Hectares)</label>
                  <input type="number" step="0.1" {...register('areaHectares')} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="2.5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground/80">Planting Date</label>
                  <input type="date" {...register('plantingDate')} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground/80">Status</label>
                  <select {...register('status')} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                    <option value="planted">Planted</option>
                    <option value="growing">Growing</option>
                    <option value="flowering">Flowering</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={createCrop.isPending} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-md hover:shadow-lg disabled:opacity-50 transition-all">
                  {createCrop.isPending ? 'Saving...' : 'Save Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
