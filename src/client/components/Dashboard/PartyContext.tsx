import React, {createContext, useContext, useState} from 'react';

interface PartyContextType {
  partyId: number | null;
  setPartyId: (id: number) => void;
  partyName: string | null;
  setPartyName: (name: string) => void;
}

const PartyContext = createContext<PartyContextType | undefined>(undefined);

export const PartyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [partyId, setPartyId] = useState<number | null>(null);
  const [partyName, setPartyName] = useState<string | ''>('')
  
  return (
    <PartyContext.Provider value={{ partyId, setPartyId, partyName, setPartyName }}>
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
 