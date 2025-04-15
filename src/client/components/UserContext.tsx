import React, { createContext, useContext, useState } from 'react';

type UserContextType = {
  localUser: { profilePic: string } | null;
  setLocalUser: React.Dispatch<React.SetStateAction<{ profilePic: string } | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localUser, setLocalUser] = useState<{ profilePic: string } | null>(null);

  return (
    <UserContext.Provider value={{ localUser, setLocalUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};