"use client";

import { NotifyContext } from "@components/containers/common/Notify/NotifiProvider";
import { useContext } from "react";

export function useNotify() {
  const context = useContext(NotifyContext);
  if (!context) throw new Error("useNotify must be used within NotifyProvider");
  return context;
}
