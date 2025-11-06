/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Box, Typography } from "@mui/material";
import React from "react";

export default function LabelValue({
  label,
  value,
  variantLabel,
  variantValue,
}: {
  label: string;
  value?: string;
  variantLabel?: string | any;
  variantValue?: string | any;
}) {
  return (
    <Box display="flex" gap={1} alignItems="center">
      <Typography variant={variantLabel || "caption"}>{label}:</Typography>
      <Typography variant={variantValue || "body2"}>{value}</Typography>
    </Box>
  );
}
