import React, { createContext, useContext, useEffect, useState } from 'react';
import { dataService } from '@/lib/services/data-service';
import { AppState } from '@/types';

interface DataContextType {
  isLoading: boolean;
  dataService: typeof dataService;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const initializeData = async () => {
      await dataService.initialize();
      setIsLoading(false);
    };

    initializeData();

    // Subscribe to data changes
    const unsubscribe = dataService.subscribe(() => {
      setRefreshTrigger(prev => prev + 1);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DataContext.Provider value={{ isLoading, dataService, refreshData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
