"use client";

import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
export default function PageHeader({
  title,
  action,
  noBack,
  goBack,
}: {
  title?: string;
  action?: React.ReactNode;
  noBack?: boolean;
  goBack?: string;
}) {
  const route = useRouter();
  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Box display="flex" gap={2} alignItems="center">
        {!noBack && (
          <IconButton
            onClick={() => {
              if (goBack) {
                route.push(goBack);
              } else {
                window?.history?.back();
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      {action && (
        <Box display="flex" justifyContent="end">
          {action}
        </Box>
      )}
    </Box>
  );
}
