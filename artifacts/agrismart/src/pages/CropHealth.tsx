import { useState } from 'react';
import { useScanCropHealth, useGetCrops } from '@workspace/api-client-react';
import { Upload, Scan, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, Activity } from 'lucide-react';

export default function CropHealth() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  
  const { data: crops } = useGetCrops();
  const scanMutation = useScanCropHealth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleScan = () => {
    if (!preview) return;
    
    // In a real app, we'd pass base64. Here we simulate.
    scanMutation.mutate({
      data: {
        cropName: selectedCrop || 'Unknown',
        imageBase64: 'simulated_base64',
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-display font-bold mb-4">AI Crop Health Scanner</h1>
        <p className="text-muted-foreground text-lg">Upload a photo of a diseased or pest-infested plant, and our AI will instantly diagnose the issue and recommend treatments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Upload className="text-primary w-6 h-6" /> Upload Image
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/80">Select Crop (Optional)</label>
              <select 
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="">I don't know / Detect automatically</option>
                {crops?.map(c => <option key={c.id} value={c.name}>{c.name} ({c.fieldName})</option>)}
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Cotton">Cotton</option>
              </select>
            </div>

            <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                preview ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary hover:bg-muted/50'
              }`}
            >
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-xl object-contain shadow-md" />
                  <button onClick={() => { setFile(null); setPreview(null); scanMutation.reset(); }} className="mt-4 text-sm text-destructive font-medium hover:underline">
                    Remove Image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Scan className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <span className="font-semibold text-foreground text-lg">Click to upload photo</span>
                  <span className="text-sm text-muted-foreground mt-1">or drag and drop</span>
                  <span className="text-xs text-muted-foreground/70 mt-2">Supports JPG, PNG</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>

            <button
              onClick={handleScan}
              disabled={!preview || scanMutation.isPending}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {scanMutation.isPending ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Scanning...</>
              ) : (
                <><Scan className="w-5 h-5" /> Analyze Image</>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50 relative overflow-hidden">
          {!scanMutation.data && !scanMutation.isPending && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[2px] z-10 p-6 text-center">
              <ShieldAlert className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-bold text-foreground/60 mb-2">Awaiting Image</h3>
              <p className="text-muted-foreground max-w-sm">Upload a photo and click analyze to see detailed AI diagnostic results here.</p>
            </div>
          )}

          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="text-primary w-6 h-6" /> Analysis Results
          </h2>

          {scanMutation.data && (
            <div className="space-y-6 animate-in-up">
              <div className="p-5 rounded-2xl border bg-red-50/50 border-red-100 dark:bg-red-950/20 dark:border-red-900">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 text-red-600 p-2 rounded-full mt-1">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-700 dark:text-red-400">{scanMutation.data.diagnosis}</h3>
                    <div className="flex gap-3 mt-2">
                      <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        Severity: {scanMutation.data.severity}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        Confidence: {(scanMutation.data.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Recommended Treatment
                </h4>
                <div className="bg-muted/30 p-4 rounded-xl text-foreground/80 leading-relaxed border border-border/50">
                  {scanMutation.data.treatment}
                </div>
              </div>

              {scanMutation.data.preventionTips && (
                <div>
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-500" /> Prevention Tips
                  </h4>
                  <ul className="space-y-2">
                    {scanMutation.data.preventionTips.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-foreground/80 bg-muted/20 p-3 rounded-lg">
                        <ArrowRight className="w-5 h-5 text-amber-500 shrink-0" /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
