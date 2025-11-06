/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from "@mui/material";

export const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number | string;
  color: string;
}) => (
  <Box
    sx={{
      p: 2.5,
      mt: 2,
      borderRadius: 2,
      bgcolor: `${color}.lighter`,
      border: 1,
      borderColor: `${color}.light`,
      display: "flex",
      alignItems: "center",
      gap: 2,
      height: "100%",
      boxShadow: 3,
    }}
  >
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 1.5,
        bgcolor: `${color}.main`,
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon sx={{ fontSize: 28 }} />
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, color: `${color}.main` }}>
        {value}
      </Typography>
    </Box>
  </Box>
);
