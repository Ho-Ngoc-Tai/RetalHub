"use client";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import React from "react";

interface DialogConfirmProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  open: boolean;
  handleClose?: () => void;
  handleApplie?: () => void;
  isLoading?: boolean;
  lableClose?: string;
  lableConfirm?: string;
}

export default function DialogConfirm({
  title,
  description,
  open,
  handleClose,
  handleApplie,
  isLoading,
  lableClose,
  lableConfirm,
}: DialogConfirmProps) {
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
        if (handleClose) handleClose();
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
      {title && <Divider />}

      {description && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
        </DialogContent>
      )}

      <DialogActions>
        {handleClose && (
          <Button variant="outlined" onClick={handleClose} disabled={isLoading}>
            {lableClose || "Close"}
          </Button>
        )}
        {handleApplie && (
          <Button
            onClick={handleApplie}
            variant="contained"
            disabled={isLoading}
            endIcon={isLoading && <CircularProgress size={20} />}
          >
            {lableConfirm || "Confirm"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
