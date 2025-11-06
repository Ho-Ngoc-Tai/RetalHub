"use client";

import { Paper, styled } from "@mui/material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // Hiệu ứng bóng sang trọng, tạo cảm giác 3D
  boxShadow: "0px 15px 45px rgba(0, 0, 0, 0.1)",
  borderRadius: "20px",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)", // Hiệu ứng nhấc nhẹ khi di chuột
  },
}));
export default StyledPaper;
