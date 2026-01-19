import React, { useEffect, useRef } from 'react';
import { AppRoute } from '../types';
import { useSession } from '../contexts/SessionContext';
import { PointerOverlay } from './PointerOverlay';
import { 
  LayoutDashboard, 
  Settings, 
  User, 
  Bell, 
  Search,
  Menu
} from 'lucide-react';

interface ClientAppProps {
  interactive?: boolean;
}

// This component represents the user's view. 
// When interactive=true, it's the User's app.
// When interactive=false, it's the Admin's view (mirror).
export const ClientApp: React.FC<ClientAppProps> = ({ interactive = true }) => {
  const { 
    currentRoute, 
    setRoute, 
    formData, 
    updateFormData, 
    scrollPosition, 
    setScrollPosition 
  } = useSession();
  
  const mainRef = useRef<HTMLDivElement>(null);

  // Sync scroll position
  useEffect(() => {
    if (!interactive && mainRef.current) {
      // If we are the admin mirror, update our scroll to match the user's
      mainRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition, interactive]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (interactive) {
      // If we are the user, broadcast our scroll position
      setScrollPosition(e.currentTarget.scrollTop);
    }
  };

  const handleNav = (route: AppRoute) => {
    if (interactive) setRoute(route);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (interactive) {
      updateFormData(e.target.name, e.target.value);
    }
  };

  const handleToggle = () => {
    if (interactive) {
      updateFormData('notifications', !formData.notifications);
    }
  };

  return (
    <div className={`relative h-full w-full bg-white flex flex-col overflow-hidden ${!interactive ? 'pointer-events-none select-none' : ''}`}>
      {/* Visual Pointer Overlay */}
      <PointerOverlay />

      {/* App Header */}
      <header className="h-14 border-b bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1 rounded text-white">
            <Menu size={18} />
          </div>
          <span className="font-bold text-indigo-900">FinTech</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <Search size={18} />
          <Bell size={18} />
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-200">
            JD
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Mobile Optimized (Icon only) */}
        <nav className="w-14 bg-gray-50 border-r flex flex-col py-4 gap-2 shrink-0 items-center">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            active={currentRoute === AppRoute.DASHBOARD} 
            onClick={() => handleNav(AppRoute.DASHBOARD)} 
          />
          <NavItem 
            icon={<User size={20} />} 
            active={currentRoute === AppRoute.PROFILE} 
            onClick={() => handleNav(AppRoute.PROFILE)} 
          />
          <NavItem 
            icon={<Settings size={20} />} 
            active={currentRoute === AppRoute.SETTINGS} 
            onClick={() => handleNav(AppRoute.SETTINGS)} 
          />
        </nav>

        {/* Main Content Area */}
        <main 
          ref={mainRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto bg-gray-50/50 p-4 relative scroll-smooth"
        >
          {currentRoute === AppRoute.DASHBOARD && (
            <div className="space-y-4 pb-10">
              <h1 className="text-xl font-bold text-gray-800">Overview</h1>
              <div className="grid grid-cols-1 gap-3">
                <Card title="Total Balance" value="$12,450.00" trend="+2.5%" />
                <div className="grid grid-cols-2 gap-3">
                  <Card title="Expenses" value="$3.2k" trend="-1.2%" negative />
                  <Card title="Savings" value="$9.2k" trend="+4.0%" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-4 text-sm">Recent Transactions</h3>
                <div className="space-y-3">
                  <Transaction name="Apple Store" date="Today, 2:00 PM" amount="-$120.00" />
                  <Transaction name="Salary Deposit" date="Yesterday" amount="+$3,500.00" green />
                  <Transaction name="Electric Bill" date="Oct 24" amount="-$85.00" />
                  <Transaction name="Netflix" date="Oct 20" amount="-$15.00" />
                  <Transaction name="Uber" date="Oct 18" amount="-$24.50" />
                </div>
              </div>
            </div>
          )}

          {currentRoute === AppRoute.PROFILE && (
            <div className="bg-white rounded-xl shadow-sm border p-6 mt-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-indigo-600 text-2xl font-bold mb-3">
                  JD
                </div>
                <h2 className="text-xl font-bold text-gray-800">John Doe</h2>
                <p className="text-gray-500 text-sm">Premium Member</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName} 
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
                    placeholder="john@example.com"
                  />
                </div>
                <button 
                  className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                  onClick={() => alert('Profile Saved!')}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {currentRoute === AppRoute.SETTINGS && (
            <div className="space-y-4 pt-2">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Settings</h2>
              
              <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Notifications</h4>
                  <p className="text-[10px] text-gray-500">Alerts on activity</p>
                </div>
                <button 
                  onClick={handleToggle}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${formData.notifications ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${formData.notifications ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between opacity-50 cursor-not-allowed">
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Dark Mode</h4>
                  <p className="text-[10px] text-gray-500">Pro feature</p>
                </div>
                <div className="w-10 h-5 bg-gray-200 rounded-full p-0.5">
                   <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              
               <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
                  <h4 className="font-medium text-gray-800 border-b pb-2 text-sm">Support</h4>
                  <button className="text-xs text-indigo-600 hover:underline block w-full text-left">Contact Support</button>
                  <button className="text-xs text-indigo-600 hover:underline block w-full text-left">Privacy Policy</button>
                  <button className="text-xs text-red-500 hover:underline block w-full text-left">Delete Account</button>
               </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

// Sub-components
const NavItem = ({ icon, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-2.5 rounded-xl transition-all duration-200 ${active ? 'bg-indigo-100 text-indigo-600 shadow-sm' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
  >
    {icon}
  </button>
);

const Card = ({ title, value, trend, negative }: any) => (
  <div className="bg-white p-3 rounded-xl border shadow-sm">
    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{title}</p>
    <div className="flex items-end justify-between mt-1">
      <span className="text-lg font-bold text-gray-900">{value}</span>
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${negative ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
        {trend}
      </span>
    </div>
  </div>
);

const Transaction = ({ name, date, amount, green }: any) => (
  <div className="flex items-center justify-between py-2 border-b last:border-0 border-gray-50">
    <div>
      <p className="text-xs font-bold text-gray-800">{name}</p>
      <p className="text-[10px] text-gray-400">{date}</p>
    </div>
    <span className={`text-xs font-bold ${green ? 'text-green-600' : 'text-gray-800'}`}>
      {amount}
    </span>
  </div>
);