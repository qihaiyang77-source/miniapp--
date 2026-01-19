import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { Coordinates, AppRoute } from '../types';

interface SessionContextType {
  // Shared State
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
  
  // Pointer Logic
  adminPointer: Coordinates | null;
  setAdminPointer: (coords: Coordinates | null) => void;
  
  // Form Data (Shared state for demo purposes)
  formData: Record<string, any>;
  updateFormData: (key: string, value: any) => void;

  // Admin Actions
  triggerVisualCue: (coords: Coordinates) => void;
  isCueActive: boolean;

  // Scroll Sync
  scrollPosition: number;
  setScrollPosition: (pos: number) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [adminPointer, setAdminPointer] = useState<Coordinates | null>(null);
  const [isCueActive, setIsCueActive] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({
    fullName: '',
    email: '',
    notifications: true,
  });

  // Ref to hold the timeout ID so we can clear it if clicked again
  const timerRef = useRef<any>(null);

  const updateFormData = useCallback((key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const setRoute = useCallback((route: AppRoute) => {
    setCurrentRoute(route);
    // Reset pointer and scroll when route changes
    setAdminPointer(null);
    setIsCueActive(false);
    setScrollPosition(0);
  }, []);

  const triggerVisualCue = useCallback((coords: Coordinates) => {
    // Clear existing timer to prevent premature hiding if clicked rapidly
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setAdminPointer(coords);
    setIsCueActive(true);
    
    // Auto-hide cue after 5 seconds (Extended duration)
    timerRef.current = setTimeout(() => {
      setIsCueActive(false);
    }, 5000);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        currentRoute,
        setRoute,
        adminPointer,
        setAdminPointer,
        formData,
        updateFormData,
        triggerVisualCue,
        isCueActive,
        scrollPosition,
        setScrollPosition
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};