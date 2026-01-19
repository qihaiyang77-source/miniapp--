import React, { useRef, useState } from 'react';
import { ClientApp } from './ClientApp';
import { useSession } from '../contexts/SessionContext';
import { generateSupportAdvice } from '../services/geminiService';
import { MousePointer2, Sparkles, MessageSquare, Monitor, CheckCircle2 } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { currentRoute, triggerVisualCue, formData } = useSession();
  const screenRef = useRef<HTMLDivElement>(null);
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!screenRef.current) return;

    const rect = screenRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    triggerVisualCue({ x, y });
  };

  const handleGenerateAdvice = async () => {
    setIsLoadingAi(true);
    setAiAdvice("");
    
    // Constructing a simulated "DOM context" string
    const screenContext = `
      Form Data: ${JSON.stringify(formData)}
      Interactive Elements: ${currentRoute === 'DASHBOARD' ? 'Transaction Cards, Navigation Menu' : currentRoute === 'PROFILE' ? 'Name Input, Email Input, Save Button' : 'Notifications Toggle, Help Links'}
    `;

    const advice = await generateSupportAdvice(
      currentRoute,
      customPrompt || "How do I help the user?",
      screenContext
    );
    
    setAiAdvice(advice);
    setIsLoadingAi(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-l border-slate-700 shadow-2xl">
      {/* Admin Header */}
      <div className="h-14 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <Monitor className="text-blue-400" size={20} />
          <h2 className="font-semibold tracking-wide text-sm">Co-Browse Support Console</h2>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-900 px-2 py-1 rounded border border-slate-700">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-green-400 font-medium">Connected</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-hidden flex flex-row">
        
        {/* Left Col: Screen Mirror */}
        <div className="flex-1 bg-slate-950 relative flex flex-col items-center justify-center p-6 overflow-hidden">
          <div className="absolute top-4 left-4 text-xs text-slate-500 flex items-center gap-1">
             <MousePointer2 size={12} />
             <span>Click on screen to guide user</span>
          </div>

          {/* 
            Container for the mirror. 
            Dimensions match the User Device (375x667) to ensure 1:1 coordinate mapping.
            We scale it down slightly if the admin panel is small, but the coordinate math works on the rendered size.
           */}
          <div 
             className="relative shadow-2xl rounded-[2rem] overflow-hidden border-4 border-slate-700 bg-gray-900" 
             style={{ width: '375px', height: '667px', transform: 'scale(0.85)', transformOrigin: 'center center' }}
          >
             {/* Notch Simulation */}
             <div className="absolute top-0 left-0 w-full h-7 bg-white z-20 border-b border-gray-100 flex justify-center items-end pb-1 opacity-90">
                <div className="w-24 h-4 bg-black rounded-b-xl"></div>
             </div>

             <div className="pt-7 h-full w-full bg-white relative">
                <ClientApp interactive={false} />
                
                {/* Interaction Layer */}
                <div 
                  ref={screenRef}
                  onClick={handleScreenClick}
                  className="absolute inset-0 z-50 cursor-crosshair hover:bg-blue-500/10 transition-colors duration-150"
                  title="Click to place visual marker"
                />
             </div>
          </div>
          
          <div className="mt-[-40px] text-xs text-slate-500 font-mono">Real-time Mirror (375x667)</div>
        </div>

        {/* Right Col: Tools & AI */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
           
           {/* Session Info */}
           <div className="p-4 border-b border-slate-700">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Session Details</h3>
              <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-400">User:</span>
                   <span className="text-slate-200">John Doe</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-400">Current View:</span>
                   <span className="text-blue-400 font-mono">{currentRoute}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-400">Device:</span>
                   <span className="text-slate-200">iPhone SE</span>
                 </div>
              </div>
           </div>

           {/* AI Assistant */}
           <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-purple-400" />
                <h3 className="font-semibold text-purple-100">AI Assistant</h3>
              </div>

              <div className="flex-1 bg-slate-900/50 rounded-lg border border-slate-700 p-3 mb-3 overflow-y-auto">
                {aiAdvice ? (
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                     <p className="text-sm text-slate-300 leading-relaxed">{aiAdvice}</p>
                     <div className="flex items-center gap-1 text-xs text-green-400 mt-2">
                        <CheckCircle2 size={12} />
                        <span>Suggestion ready</span>
                     </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center p-4">
                    <MessageSquare size={24} className="mb-2 opacity-50" />
                    <p className="text-xs">Select an element or type a query to get support suggestions.</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <textarea 
                  placeholder="Describe the issue..."
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm focus:outline-none focus:border-purple-500 text-slate-200 resize-none h-20"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerateAdvice())}
                />
                <button 
                  onClick={handleGenerateAdvice}
                  disabled={isLoadingAi}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoadingAi ? (
                    <>
                       <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                       Thinking...
                    </>
                  ) : (
                    'Generate Guidance'
                  )}
                </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};