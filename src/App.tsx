import React, { useState } from 'react';
import { LayoutDashboard, UploadCloud, FileSpreadsheet, ListChecks, Settings, LogOut, Menu, X, Users, RefreshCw, FileText, ShieldAlert } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Upload } from './components/Upload';
import { Reconciliation } from './components/Reconciliation';
import { Metrics } from './components/Metrics';
import { VendorManagement } from './components/VendorManagement';
import { ITCLifecycle } from './components/ITCLifecycle';
import { ReportsFiling } from './components/ReportsFiling';
import { cn } from './lib/utils';
import { RecoRecord } from './types';
import { mockData } from './lib/mockData';

type View = 'dashboard' | 'upload' | 'reconciliation' | 'metrics' | 'vendors' | 'lifecycle' | 'reports';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recoData, setRecoData] = useState<RecoRecord[]>(mockData);

  const handleDataProcessed = (data: RecoRecord[]) => {
    setRecoData(data);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard data={recoData} />;
      case 'upload': return <Upload onDataProcessed={handleDataProcessed} />;
      case 'reconciliation': return <Reconciliation data={recoData} setData={setRecoData} />;
      case 'lifecycle': return <ITCLifecycle />;
      case 'vendors': return <VendorManagement />;
      case 'reports': return <ReportsFiling />;
      case 'metrics': return <Metrics />;
      default: return <Dashboard data={recoData} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Data Ingestion', icon: UploadCloud },
    { id: 'reconciliation', label: 'Reconciliation', icon: FileSpreadsheet },
    { id: 'lifecycle', label: 'ITC Lifecycle', icon: RefreshCw },
    { id: 'vendors', label: 'Vendor Management', icon: Users },
    { id: 'reports', label: 'Reports & Filing', icon: FileText },
    { id: 'metrics', label: '50+ Metrics Rules', icon: ListChecks },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-50 flex font-sans text-zinc-900">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-2 text-zinc-900 font-semibold tracking-tight">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-mono text-sm">
              GR
            </div>
            GST Reco Pro
          </div>
          <button 
            className="ml-auto lg:hidden text-zinc-500 hover:text-zinc-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                currentView === item.id 
                  ? "bg-zinc-100 text-zinc-900" 
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                currentView === item.id ? "text-zinc-900" : "text-zinc-400"
              )} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-medium text-zinc-600">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">Admin User</p>
              <p className="text-xs text-zinc-500 truncate">admin@gstreco.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-zinc-200 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-zinc-500 hover:text-zinc-900"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-500 font-mono">
              <span className="px-2 py-1 bg-zinc-100 rounded-md">FY 23-24</span>
              <span className="px-2 py-1 bg-zinc-100 rounded-md">Q3</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-zinc-500 hover:text-zinc-900 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="text-zinc-500 hover:text-zinc-900 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
}
