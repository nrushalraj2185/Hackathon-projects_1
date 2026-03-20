import { useState } from 'react';
import { useGetGovernmentSchemes } from '@workspace/api-client-react';
import { Landmark, ExternalLink, ChevronDown, ChevronUp, FileText, CheckCircle } from 'lucide-react';

const categoryLabels: Record<string, string> = {
  financial_assistance: 'Financial Assistance',
  insurance: 'Crop Insurance',
  loan: 'Agricultural Loan',
  advisory: 'Advisory',
  market_access: 'Market Access',
  subsidy: 'Subsidy',
};

const categoryColors: Record<string, string> = {
  financial_assistance: 'bg-green-100 text-green-700 border-green-200',
  insurance: 'bg-blue-100 text-blue-700 border-blue-200',
  loan: 'bg-purple-100 text-purple-700 border-purple-200',
  advisory: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  market_access: 'bg-orange-100 text-orange-700 border-orange-200',
  subsidy: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function Schemes() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const { data: schemes, isLoading } = useGetGovernmentSchemes({ category: selectedCategory || undefined });

  const categories = [
    { value: '', label: 'All Schemes' },
    { value: 'financial_assistance', label: 'Financial Assistance' },
    { value: 'insurance', label: 'Crop Insurance' },
    { value: 'loan', label: 'Loans' },
    { value: 'subsidy', label: 'Subsidies' },
    { value: 'market_access', label: 'Market Access' },
    { value: 'advisory', label: 'Advisory' },
  ];

  if (isLoading) return <div className="flex items-center justify-center h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2"><Landmark className="w-8 h-8 text-primary" /> Government Schemes</h1>
        <p className="text-muted-foreground mt-1">Discover subsidies, loans, insurance, and financial assistance available for farmers</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat.value} onClick={() => setSelectedCategory(cat.value)} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${selectedCategory === cat.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'}`}>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {(schemes || []).map((scheme: any) => (
          <div key={scheme.id} className="bg-card border rounded-2xl overflow-hidden hover:shadow-md transition">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-2 flex-wrap mb-2">
                    <h3 className="font-semibold text-lg leading-tight">{scheme.name}</h3>
                    {scheme.category && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border shrink-0 ${categoryColors[scheme.category] || 'bg-gray-100 text-gray-700'}`}>
                        {categoryLabels[scheme.category] || scheme.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{scheme.ministry}</p>
                  <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2 mb-3">
                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Benefit: </span>
                    <span className="text-sm text-green-800">{scheme.benefit}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{scheme.description}</p>
                </div>
                <button onClick={() => setExpanded(expanded === scheme.id ? null : scheme.id)} className="shrink-0 p-2 hover:bg-muted rounded-lg transition">
                  {expanded === scheme.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expanded === scheme.id && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Eligibility</h4>
                    <ul className="space-y-1">
                      {scheme.eligibility?.map((e: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span>{e}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500" /> Documents Required</h4>
                    <ul className="space-y-1">
                      {scheme.documents?.map((d: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-blue-400">•</span>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">How to Apply</h4>
                    <p className="text-sm text-muted-foreground">{scheme.applicationProcess}</p>
                  </div>
                  {scheme.deadline && (
                    <div className="text-sm"><span className="font-medium">Deadline: </span><span className="text-muted-foreground">{scheme.deadline}</span></div>
                  )}
                  {scheme.website && (
                    <a href={scheme.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <ExternalLink className="w-4 h-4" /> Visit Official Website
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {(!schemes || schemes.length === 0) && (
          <div className="text-center py-16 text-muted-foreground">
            <Landmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No schemes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
