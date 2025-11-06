"use client";
import { createContext, useState, ReactNode } from "react";
import Notify from ".";

interface NotifyContextProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
  show: (msg: string, sev?: NotifyContextProps["severity"]) => void;
  onClose: () => void;
}

export const NotifyContext = createContext<NotifyContextProps | undefined>(undefined);

export function NotifyProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<NotifyContextProps["severity"]>("success");

  const show = (msg: string, sev: NotifyContextProps["severity"] = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <NotifyContext.Provider value={{ open, message, severity, show, onClose }}>
      {children}
      <Notify />
    </NotifyContext.Provider>
  );
}
