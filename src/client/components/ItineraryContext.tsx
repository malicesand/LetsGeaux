import React, { createContext, useContext, useState, useEffect } from 'react';

interface ItineraryContextType {
  itineraryId: number | null;
  setItineraryId: (id: number | null) => void;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export const ItineraryProvider: React.FC = ({ children }) => {
  // Initialize itineraryId state from localStorage, or default to null if not available
  const [itineraryId, setItineraryIdState] = useState<number | null>(null);

  useEffect(() => {
    // Check if there's an itineraryId saved in localStorage
    const savedItineraryId = localStorage.getItem('itineraryId');
    if (savedItineraryId) {
      setItineraryIdState(Number(savedItineraryId));  // Convert string to number
    }
  }, []);

  // Set itineraryId in localStorage whenever it changes
  const setItineraryId = (id: number | null) => {
    if (id === null) {
      localStorage.removeItem('itineraryId');  // Remove from localStorage when it's null
    } else {
      localStorage.setItem('itineraryId', String(id));  // Save to localStorage
    }
    setItineraryIdState(id);  // Update state
  };

  return (
    <ItineraryContext.Provider value={{ itineraryId, setItineraryId }}>
      {children}
    </ItineraryContext.Provider>
  );
};

// Custom hook to use the Itinerary context
export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItinerary must be used within a ItineraryProvider');
  }
  return context;
};
