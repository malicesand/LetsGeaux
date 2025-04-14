import React, { createContext, useContext, useState } from 'react';

//define the notification type
export interface Notification {
  message: string;
  timestamp: Date;
}

//define the shape of the context values
interface BudgetNotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
}

//create the context defaulting to undefined
const BudgetNotificationContext = createContext<BudgetNotificationContextType | undefined>(undefined);

//provider component to wrap your app
export const BudgetNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // function to add a new notification
  const addNotification = (notification: Notification) => {
    // prepend the new notification so that the latest one is first
    setNotifications(prev => [notification, ...prev]);
  };

  // directly return the provider
  return (
    <BudgetNotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </BudgetNotificationContext.Provider>
  );
};

// custom hook to use the BudgetNotificationContext
export const useBudgetNotifications = () => {
  const context = useContext(BudgetNotificationContext);
  if (context === undefined) {
    throw new Error('useBudgetNotifications must be used within a Budget Notification Provider');
  }
  return context;
};
