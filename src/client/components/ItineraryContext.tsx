import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context and the provider
interface ItineraryContextType {
  itineraryId: number | null;
  setItineraryId: (id: number | null) => void;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

interface ItineraryProviderProps {
  children: ReactNode;
}

export const ItineraryProvider: React.FC<ItineraryProviderProps> = ({ children }) => {
  const [itineraryId, setItineraryId] = useState<number | null>(null);

  return (
    <ItineraryContext.Provider value={{ itineraryId, setItineraryId }}>
      {children}
    </ItineraryContext.Provider>
  );
};

// Custom hook to use the Itinerary context
export const useItinerary = (): ItineraryContextType => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
}