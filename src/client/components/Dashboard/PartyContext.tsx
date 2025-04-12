import React, {createContext, useContext, useState} from 'react';

interface PartyContextType {
  partyId: number | null;
  setPartyId: (id: number) => void;
}

const PartyContext = createContext<PartyContextType | undefined>(undefined);

export const PartyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [partyId, setPartyId] = useState<number | null>(null);
  
  return (
    <PartyContext.Provider value={{ partyId, setPartyId }}>
      { children }
    </PartyContext.Provider>
  );
};

export const useParty = () => {
  const context = useContext(PartyContext);
  if (!context) {
    console.error('useParty must be used within a PartyProvider');
  }
  return context;
}
 