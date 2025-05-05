import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// define Notification with an id and a seen flag
export interface Notification {
  id: string;          //unique identifier
  message: string;
  timestamp: Date;
  seen: boolean;       // has the user clicked/viewed it?
}

// context shape now includes markAsSeen
interface BudgetNotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'seen'>) => void;
  markAsSeen: (id: string) => void;
}

const BudgetNotificationContext = createContext<BudgetNotificationContextType | undefined>(undefined);

export const BudgetNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // add a new notification (automatically assigns id + seen=false)
  const addNotification = ({ message, timestamp }: Omit<Notification, 'id' | 'seen'>) => {
    const newNotif: Notification = {
      id: uuidv4(),
      message,
      timestamp,
      seen: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  //mark one notification as seen
  const markAsSeen = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, seen: true } : n))
    );
  };

  return (
    <BudgetNotificationContext.Provider value={{ notifications, addNotification, markAsSeen }}>
      {children}
    </BudgetNotificationContext.Provider>
  );
};

export const useBudgetNotifications = () => {
  const ctx = useContext(BudgetNotificationContext);
  if (!ctx) throw new Error('useBudgetNotifications must be used within a BudgetNotificationProvider');
  return ctx;
};
