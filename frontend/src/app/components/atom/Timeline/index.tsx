import { formatDateTime } from "@commons/utils/formatDateTime";
import { ArrowRightAlt } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React from "react";

interface TimeLineProps {
  startDate?: string;
  endDate?: string;
}
export default function TimeLine({ startDate, endDate }: TimeLineProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        py: 0.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "text.disabled",
            fontSize: "0.65rem",
            fontWeight: 500,
          }}
        >
          START
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "success.main",
            fontSize: "0.813rem",
          }}
        >
          {formatDateTime(startDate, "dd-MM-yyyy")}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "success.main",
            fontSize: "0.7rem",
          }}
        >
          {formatDateTime(startDate, "HH:mm")}
        </Typography>
      </Box>

      <ArrowRightAlt
        sx={{
          color: "text.disabled",
          fontSize: 28,
          mx: 0.5,
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "text.disabled",
            fontSize: "0.65rem",
            fontWeight: 500,
          }}
        >
          END
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "error.main",
            fontSize: "0.813rem",
          }}
        >
          {formatDateTime(endDate, "dd-MM-yyyy")}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "error.main",
            fontSize: "0.7rem",
          }}
        >
          {formatDateTime(endDate, "HH:mm")}
        </Typography>
      </Box>
    </Box>
  );
}
