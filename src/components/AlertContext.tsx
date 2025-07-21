import { createContext, useContext, useState, type ReactNode } from 'react';
import "./css/AlertContext.css"

type AlertState = {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

type AlertContextType = {
  showAlert: (msg: string, type?: AlertState['type']) => void;
  dismissAlert: () => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlert must be used within <AlertProvider>');
  return [ctx.showAlert, ctx.dismissAlert] as const;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = (message: string, type: AlertState['type'] = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000); // auto-dismiss
  };

  const dismissAlert = () => setAlert(null);

  return (
    <AlertContext.Provider value={{ showAlert, dismissAlert }}>
      {children}
      {alert && (
        <div className={`alert-box ${alert.type}`}>
          {alert.message}
        </div>
      )}
    </AlertContext.Provider>
  );
};
