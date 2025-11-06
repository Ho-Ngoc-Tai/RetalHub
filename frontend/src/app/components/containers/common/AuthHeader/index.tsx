"use client";

import { Box, keyframes, Typography } from "@mui/material";
import Image from "next/image";
const shake = keyframes`
  0% { transform: rotate(0deg); }
  20% { transform: rotate(-15deg); }
  40% { transform: rotate(15deg); }
  60% { transform: rotate(-10deg); }
  80% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
`;
export default function AuthHeader({
  icon,
  title,
  description,
}: {
  icon?: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      {icon && (
        <Box
          sx={{
            width: 40,
            height: 40,
            mb: 2,
            animation: `${shake} 0.9s ease-in-out infinite`,
          }}
        >
          <Image src={icon} alt="Login Image" width={40} height={40} priority />
        </Box>
      )}
      <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {description}
      </Typography>
      <Box
        sx={{
          width: "50px",
          height: "4px",
          borderRadius: 2,
          background: "linear-gradient(90deg, #ff9800, #ff5722)", // vàng cam
          mb: 4,
        }}
      ></Box>
    </div>
  );
}
