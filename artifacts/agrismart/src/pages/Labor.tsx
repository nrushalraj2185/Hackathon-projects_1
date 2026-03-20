import { useState } from 'react';
import { useGetLaborJobs, useCreateLaborJob, useDeleteLaborJob } from '@workspace/api-client-react';
import { Users, MapPin, Calendar, DollarSign, Plus, Trash2, X } from 'lucide-react';

const statusColors: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  filled: 'bg-blue-100 text-blue-700',
  closed: 'bg-gray-100 text-gray-600',
};

export default function Labor() {
  const { data: jobs, isLoading, refetch } = useGetLaborJobs();
  const { mutateAsync: createJob } = useCreateLaborJob();
  const { mutateAsync: deleteJob } = useDeleteLaborJob();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', location: '', date: '', wage: '', wageUnit: 'per_day',
    workersNeeded: '', duration: '', description: '', contactName: '', contactPhone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJob({ title: form.title, location: form.location, date: form.date, wage: Number(form.wage), wageUnit: form.wageUnit as any, workersNeeded: Number(form.workersNeeded), duration: form.duration, description: form.description, contactName: form.contactName, contactPhone: form.contactPhone });
    setShowForm(false);
    setForm({ title: '', location: '', date: '', wage: '', wageUnit: 'per_day', workersNeeded: '', duration: '', description: '', contactName: '', contactPhone: '' });
    refetch();
  };

  const handleDelete = async (id: number) => {
    await deleteJob({ id });
    refetch();
  };

  const mockJobs = [
    { id: 1, title: 'Wheat Harvesting', location: 'Amritsar, Punjab', date: '2026-03-25', wage: 500, wageUnit: 'per_day', workersNeeded: 20, workersApplied: 8, skills: ['harvesting', 'manual labor'], contactName: 'Gurpreet Singh', contactPhone: '+91 98765 43210', status: 'open', description: 'Need experienced workers for wheat harvesting. Meals provided.' },
    { id: 2, title: 'Paddy Transplanting', location: 'Ludhiana, Punjab', date: '2026-04-10', wage: 450, wageUnit: 'per_day', workersNeeded: 15, workersApplied: 15, skills: ['transplanting'], contactName: 'Harjit Kaur', contactPhone: '+91 97654 32109', status: 'filled', description: 'Paddy seedling transplanting work.' },
  ];

  const displayJobs = (!jobs || jobs.length === 0) ? mockJobs : jobs;

  if (isLoading) return <div className="flex items-center justify-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Labor Marketplace</h1>
          <p className="text-muted-foreground mt-1">Post farm work and connect with local laborers</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Post a Job
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Post a New Job</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: 'Job Title', key: 'title', placeholder: 'e.g., Wheat Harvesting' },
                { label: 'Location', key: 'location', placeholder: 'Village/Town, District' },
                { label: 'Contact Name', key: 'contactName', placeholder: 'Your name' },
                { label: 'Contact Phone', key: 'contactPhone', placeholder: '+91 XXXXX XXXXX' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder={placeholder} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <input className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., 3 days" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Wage (₹)</label>
                  <input type="number" className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="500" value={form.wage} onChange={e => setForm(f => ({ ...f, wage: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Wage Unit</label>
                  <select className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" value={form.wageUnit} onChange={e => setForm(f => ({ ...f, wageUnit: e.target.value }))}>
                    <option value="per_day">Per Day</option>
                    <option value="per_hour">Per Hour</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Workers Needed</label>
                  <input type="number" className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="10" value={form.workersNeeded} onChange={e => setForm(f => ({ ...f, workersNeeded: e.target.value }))} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary" rows={3} placeholder="Job details, meals provided, transport, etc." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:opacity-90 transition">Post Job</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {displayJobs.map((job: any) => (
          <div key={job.id} className="bg-card border rounded-2xl p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[job.status] || 'bg-gray-100'}`}>{job.status.charAt(0).toUpperCase() + job.status.slice(1)}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(job.date).toLocaleDateString('en-IN')}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />₹{job.wage}/{job.wageUnit.replace('_', ' ')}</span>
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" />{job.workersApplied || 0}/{job.workersNeeded} workers</span>
                </div>
                {job.description && <p className="mt-2 text-sm text-muted-foreground">{job.description}</p>}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {job.skills.map((s: string) => <span key={s} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-100">{s}</span>)}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                {job.contactPhone && <a href={`tel:${job.contactPhone}`} className="text-sm text-primary font-medium hover:underline">{job.contactPhone}</a>}
                <button onClick={() => handleDelete(job.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {displayJobs.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No jobs posted yet</p>
            <p className="text-sm">Post a job to find local laborers for your farm</p>
          </div>
        )}
      </div>
    </div>
  );
}
