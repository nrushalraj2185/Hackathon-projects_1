import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

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
  }
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
    return translations[language][key] || key;
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
