"use client";

import { useNotify } from "@commons/utils/useNotify.utils";
import { Alert, Snackbar } from "@mui/material";

export default function Notify() {
  const { open, message, severity, onClose } = useNotify();

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
