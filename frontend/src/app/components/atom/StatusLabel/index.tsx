/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Chip } from "@mui/material";
export interface StatusLabelProps {
  label?: string;
  color?: "default" | "primary" | "secondary" | "error" | "success" | "info" | "warning" | any;
}
export default function StatusLabel({ label, color = "default" }: StatusLabelProps) {
  return (
    <Chip
      label={label}
      sx={{
        color: "#fff",
      }}
      color={color || "default"}
    />
  );
}
