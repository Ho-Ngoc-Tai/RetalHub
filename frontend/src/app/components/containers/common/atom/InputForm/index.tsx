"use client";

import { Grid, Typography } from "@mui/material";

export default function InputForm({
  label,
  children,
  required = false,
  fullWidth,
}: {
  label?: string;
  children: React.ReactNode;
  required?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <Grid container spacing={1} p={0}>
      {label && (
        <Grid
          size={{
            sm: 12,
            md: fullWidth ? 12 : 3,
          }}
          p={0}
        >
          <Typography variant="subtitle1">
            {label} {required && <span style={{ color: "red" }}>*</span>}
          </Typography>
        </Grid>
      )}
      {children && (
        <Grid
          size={{
            sm: 12,
            md: fullWidth ? 12 : 9,
          }}
          p={0}
        >
          {children}
        </Grid>
      )}
    </Grid>
  );
}
