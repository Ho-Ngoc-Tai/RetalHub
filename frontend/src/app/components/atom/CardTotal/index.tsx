"use client";

import { formatShortNumber } from "@commons/utils/formatNumber";
import { Box, Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";
import React from "react";
function formatSixDecimalsSmart(value: number) {
  return formatShortNumber(value, 5);
}
export default function CardTotal({ title, count, icon }: { title: string; count: number; icon?: React.ReactNode }) {
  return (
    <Card variant="outlined">
      <CardHeader
        title={
          <Box display="flex" justifyContent="center" gap={1} alignContent="center">
            {icon}
            <Typography variant="h6">{title}</Typography>
          </Box>
        }
        sx={{
          textAlign: "center",
        }}
      />
      <Divider />
      <CardContent>
        <Typography textAlign="center" variant="h1" title={count !== undefined ? String(count) : ""}>
          {/* <CountUp end={count} duration={1.5} formattingFn={formatSixDecimalsSmart} /> */}
          {formatSixDecimalsSmart(count)}
        </Typography>
      </CardContent>
    </Card>
  );
}
