import React, { createContext, useContext, useState, useEffect } from 'react';

type User = { profilePic: string; username: string; email: string; id: number };

type UserContextType = {
  localUser: User | null;
  setLocalUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localUser, setLocalUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  // Save localUser changes back to localStorage
  useEffect(() => {
    if (localUser) {
      localStorage.setItem('user', JSON.stringify(localUser));
    }
  }, [localUser]);

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