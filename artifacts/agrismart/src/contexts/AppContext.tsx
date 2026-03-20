import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'ml';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'EN' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
];

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isOffline: boolean;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    crops: 'My Crops',
    health: 'Crop Health',
    weather: 'Weather',
    marketplace: 'Marketplace',
    farm: 'Farm Management',
    labor: 'Labor',
    equipment: 'Equipment',
    transport: 'Transport',
    schemes: 'Gov Schemes',
    sensors: 'Sensors',
    alerts: 'Alerts',
    welcome: 'Welcome back, Farmer',
    offline_msg: 'You are currently offline. Changes will sync when reconnected.',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    crops: 'मेरी फसलें',
    health: 'फसल स्वास्थ्य',
    weather: 'मौसम',
    marketplace: 'बाज़ार',
    farm: 'खेत प्रबंधन',
    labor: 'श्रमिक',
    equipment: 'उपकरण',
    transport: 'परिवहन',
    schemes: 'सरकारी योजनाएं',
    sensors: 'सेंसर',
    alerts: 'चेतावनी',
    welcome: 'वापसी पर स्वागत है, किसान',
    offline_msg: 'आप अभी ऑफ़लाइन हैं। कनेक्ट होने पर परिवर्तन सिंक हो जाएंगे।',
  },
  kn: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    crops: 'ನನ್ನ ಬೆಳೆಗಳು',
    health: 'ಬೆಳೆ ಆರೋಗ್ಯ',
    weather: 'ಹವಾಮಾನ',
    marketplace: 'ಮಾರುಕಟ್ಟೆ',
    farm: 'ಜಮೀನು ನಿರ್ವಹಣೆ',
    labor: 'ಕಾರ್ಮಿಕ',
    equipment: 'ಉಪಕರಣ',
    transport: 'ಸಾರಿಗೆ',
    schemes: 'ಸರ್ಕಾರಿ ಯೋಜನೆ',
    sensors: 'ಸೆನ್ಸರ್',
    alerts: 'ಎಚ್ಚರಿಕೆ',
    welcome: 'ಮರಳಿ ಸ್ವಾಗತ, ರೈತ',
    offline_msg: 'ನೀವು ಪ್ರಸ್ತುತ ಆಫ್‌ಲೈನ್ ಆಗಿದ್ದೀರಿ. ಮರು ಸಂಪರ್ಕಿಸಿದಾಗ ಬದಲಾವಣೆಗಳು ಸಿಂಕ್ ಆಗುತ್ತವೆ.',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    crops: 'என் பயிர்கள்',
    health: 'பயிர் ஆரோக்கியம்',
    weather: 'வானிலை',
    marketplace: 'சந்தை',
    farm: 'பண்ணை மேலாண்மை',
    labor: 'தொழிலாளர்',
    equipment: 'உபகரணங்கள்',
    transport: 'போக்குவரத்து',
    schemes: 'அரசு திட்டங்கள்',
    sensors: 'சென்சார்கள்',
    alerts: 'எச்சரிக்கைகள்',
    welcome: 'மீண்டும் வரவேற்கிறோம், விவசாயி',
    offline_msg: 'நீங்கள் தற்போது ஆஃப்லைனில் உள்ளீர்கள். மீண்டும் இணைக்கும்போது மாற்றங்கள் ஒத்திசைக்கப்படும்.',
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్',
    crops: 'నా పంటలు',
    health: 'పంట ఆరోగ్యం',
    weather: 'వాతావరణం',
    marketplace: 'మార్కెట్',
    farm: 'వ్యవసాయ నిర్వహణ',
    labor: 'కార్మికులు',
    equipment: 'పరికరాలు',
    transport: 'రవాణా',
    schemes: 'ప్రభుత్వ పథకాలు',
    sensors: 'సెన్సార్లు',
    alerts: 'హెచ్చరికలు',
    welcome: 'తిరిగి స్వాగతం, రైతు',
    offline_msg: 'మీరు ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నారు. తిరిగి కనెక్ట్ అయినప్పుడు మార్పులు సమకాలీకరించబడతాయి.',
  },
  ml: {
    dashboard: 'ഡാഷ്‌ബോർഡ്',
    crops: 'എന്റെ വിളകൾ',
    health: 'വിള ആരോഗ്യം',
    weather: 'കാലാവസ്ഥ',
    marketplace: 'മാർക്കറ്റ്',
    farm: 'ഫാം മാനേജ്മെന്റ്',
    labor: 'തൊഴിലാളി',
    equipment: 'ഉപകരണങ്ങൾ',
    transport: 'ഗതാഗതം',
    schemes: 'സർക്കാർ പദ്ധതികൾ',
    sensors: 'സെൻസറുകൾ',
    alerts: 'അലേർട്ടുകൾ',
    welcome: 'തിരിച്ചു സ്വാഗതം, കർഷകൻ',
    offline_msg: 'നിങ്ങൾ ഇപ്പോൾ ഓഫ്‌ലൈനിൽ ആണ്. വീണ്ടും കണക്ട് ആകുമ്പോൾ മാറ്റങ്ങൾ സമന്വയിക്കും.',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const t = (key: string) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, isOffline, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
