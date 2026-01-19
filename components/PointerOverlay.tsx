import React from 'react';
import { useSession } from '../contexts/SessionContext';
import { MousePointer2 } from 'lucide-react';

export const PointerOverlay: React.FC = () => {
  const { adminPointer, isCueActive } = useSession();

  if (!adminPointer || !isCueActive) return null;

  return (
    <div
      className="absolute pointer-events-none z-50 transition-all duration-300 ease-out"
      style={{
        left: `${adminPointer.x}%`,
        top: `${adminPointer.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="relative flex items-center justify-center">
        
        {/* 1. Radar Ripples - Multiple, faster, brighter for "Alarm" effect */}
        <span className="absolute inline-flex h-28 w-28 rounded-full border-4 border-red-500 opacity-0 animate-[ping_1s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
        <span className="absolute inline-flex h-36 w-36 rounded-full border-2 border-red-400 opacity-0 delay-150 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
        
        {/* 2. Rotating Attention Ring to draw eye to center */}
        <span className="absolute inline-flex h-24 w-24 rounded-full border-2 border-dashed border-red-500/80 animate-[spin_4s_linear_infinite]"></span>

        {/* 3. The Target Frame - Thicker, glowing, high contrast, non-obscuring */}
        <div className="relative z-10 w-16 h-16 flex flex-col justify-between animate-pulse">
            <div className="flex justify-between">
                <div className="w-5 h-5 border-t-[4px] border-l-[4px] border-red-600 rounded-tl-lg shadow-sm filter drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]"></div>
                <div className="w-5 h-5 border-t-[4px] border-r-[4px] border-red-600 rounded-tr-lg shadow-sm filter drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]"></div>
            </div>
            <div className="flex justify-between">
                <div className="w-5 h-5 border-b-[4px] border-l-[4px] border-red-600 rounded-bl-lg shadow-sm filter drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]"></div>
                <div className="w-5 h-5 border-b-[4px] border-r-[4px] border-red-600 rounded-br-lg shadow-sm filter drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]"></div>
            </div>
            
            {/* Tiny center dot for precision */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-600 rounded-full shadow-white shadow-[0_0_0_2px]"></div>
        </div>
        
        {/* 4. Giant Animated Cursor Pointer - The "Look Here" indicator */}
        <div className="absolute top-8 left-8 z-20 animate-[bounce_1s_infinite]">
             <div className="bg-white rounded-full p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-red-100">
                <MousePointer2 
                    size={32} 
                    className="text-red-600 fill-red-100 -rotate-90" 
                    strokeWidth={3}
                />
             </div>
        </div>
        
        {/* 5. Bold High-Contrast Label */}
        <div className="absolute -top-24 z-30 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-[0_8px_20px_rgba(220,38,38,0.5)] whitespace-nowrap border-[3px] border-white flex items-center gap-2 transform hover:scale-105 transition-transform">
             <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
             <span className="tracking-wide">Admin Focus</span>
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-600 rotate-45 border-r-[3px] border-b-[3px] border-white"></div>
          </div>
        </div>

      </div>
    </div>
  );
};