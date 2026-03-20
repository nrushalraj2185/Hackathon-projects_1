import { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useApp, LANGUAGES } from '@/contexts/AppContext';
import { 
  LayoutDashboard, Sprout, Activity, CloudSun, Store, 
  Wallet, Users, Tractor, Truck, Landmark, 
  Radio, Bell, Menu, X, Globe, WifiOff, ChevronDown
} from 'lucide-react';
import { useGetAlerts } from '@workspace/api-client-react';

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { language, setLanguage, isOffline, t } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === language)!;
  
  const { data: alerts } = useGetAlerts({ unread: true });
  const unreadCount = alerts?.filter(a => !a.isRead).length || 0;

  const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'dashboard' },
    { href: '/crops', icon: Sprout, label: 'crops' },
    { href: '/health', icon: Activity, label: 'health' },
    { href: '/weather', icon: CloudSun, label: 'weather' },
    { href: '/marketplace', icon: Store, label: 'marketplace' },
    { href: '/farm', icon: Wallet, label: 'farm' },
    { href: '/labor', icon: Users, label: 'labor' },
    { href: '/equipment', icon: Tractor, label: 'equipment' },
    { href: '/transport', icon: Truck, label: 'transport' },
    { href: '/schemes', icon: Landmark, label: 'schemes' },
    { href: '/sensors', icon: Radio, label: 'sensors' },
    { href: '/alerts', icon: Bell, label: 'alerts', badge: unreadCount },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-sidebar text-sidebar-foreground z-20">
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-sidebar-primary" />
          <span className="font-display font-bold text-xl tracking-tight">AgriSmart</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-sidebar text-sidebar-foreground flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:flex items-center gap-3 p-6 pb-2">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
            <Sprout className="w-8 h-8 text-sidebar-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight leading-none">AgriSmart</h1>
            <p className="text-sidebar-foreground/70 text-xs font-medium">Empowering Farmers</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 mt-4 md:mt-0 no-scrollbar">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' 
                    : 'text-sidebar-foreground/80 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-sidebar-primary rounded-r-full" />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? 'text-sidebar-primary' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="flex-1">{t(item.label)}</span>
                {item.badge > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-white/10 bg-black/10">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
             <div className="w-10 h-10 rounded-full bg-sidebar-primary/20 border-2 border-sidebar-primary flex items-center justify-center text-sidebar-primary font-bold">
               RJ
             </div>
             <div>
               <p className="font-semibold text-sm">Raju's Farm</p>
               <p className="text-xs text-white/50">Premium Member</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* Offline Banner */}
        {isOffline && (
          <div className="bg-destructive/90 backdrop-blur text-destructive-foreground px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium z-50">
            <WifiOff className="w-4 h-4" />
            {t('offline_msg')}
          </div>
        )}

        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/50 backdrop-blur-md border-b border-border/50 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-foreground hidden sm:block">
              {t('welcome')}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(v => !v)}
                className="flex items-center gap-1.5 bg-white border border-border rounded-full px-3 py-1.5 shadow-sm text-xs font-bold text-foreground hover:bg-muted transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span>{currentLang.nativeLabel}</span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden py-1">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setIsLangOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors
                        ${language === lang.code
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground hover:bg-muted'
                        }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-xs text-muted-foreground font-medium">{lang.nativeLabel}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <Link href="/alerts" className="relative p-2 text-muted-foreground hover:text-primary transition-colors bg-white rounded-full shadow-sm border border-border">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-destructive rounded-full border-2 border-white"></span>
              )}
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth pb-24">
          <div className="max-w-7xl mx-auto w-full animate-in-up">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
