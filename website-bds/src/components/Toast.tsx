import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import Alert, { type AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

type ShowToast = (message: string, severity?: AlertColor) => void;

const ToastContext = createContext<ShowToast>(() => {});

// Thay utils/toast.ts (Bootstrap Toast): góc dưới phải, tự ẩn sau 2 giây
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ key: number; message: string; severity: AlertColor } | null>(null);
  const [open, setOpen] = useState(false);

  const showToast = useCallback<ShowToast>((message, severity = 'success') => {
    setToast({ key: Date.now(), message, severity });
    setOpen(true);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Snackbar
        key={toast?.key}
        open={open}
        autoHideDuration={2000}
        onClose={(_, reason) => reason !== 'clickaway' && setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert variant="filled" severity={toast?.severity} onClose={() => setOpen(false)} sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
