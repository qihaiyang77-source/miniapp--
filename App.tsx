import React from 'react';
import { ClientApp } from './components/ClientApp';
import { AdminPanel } from './components/AdminPanel';
import { SessionProvider } from './contexts/SessionContext';

const App: React.FC = () => {
  return (
    <SessionProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
        
        {/* Left Side: The User's Device (Simulated) */}
        <div className="flex-1 flex flex-col relative border-r border-gray-300 items-center justify-center bg-gray-200 p-8">
          <div className="absolute top-0 left-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-br z-10 shadow-md">
            USER DEVICE
          </div>
          
          {/* Phone Frame */}
          <div className="relative w-[375px] h-[667px] bg-white rounded-[2.5rem] shadow-2xl border-8 border-gray-800 overflow-hidden ring-4 ring-gray-300">
             {/* Notch / Status Bar Area */}
             <div className="absolute top-0 left-0 w-full h-7 bg-white z-20 border-b border-gray-100 flex justify-center items-end pb-1">
                <div className="w-24 h-4 bg-black rounded-b-xl"></div>
             </div>
             
             {/* App Content */}
             <div className="pt-7 h-full w-full">
                <ClientApp />
             </div>
          </div>
          
          <p className="mt-4 text-gray-500 text-sm font-medium">User's iPhone SE View</p>
        </div>

        {/* Right Side: The Admin's Dashboard */}
        <div className="flex-1 flex flex-col relative min-w-[450px]">
          <div className="absolute top-0 right-0 bg-slate-800 text-blue-200 text-xs font-bold px-3 py-1 rounded-bl z-10 shadow-md border-l border-b border-slate-600">
            ADMIN DASHBOARD
          </div>
          <AdminPanel />
        </div>

      </div>
    </SessionProvider>
  );
};

export default App;