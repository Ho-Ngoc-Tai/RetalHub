"use client";

import { Button, styled } from "@mui/material";

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: "10px",
  textTransform: "none", // Chữ không viết hoa
  fontWeight: "bold",
  background: "linear-gradient(45deg, #42a5f5 30%, #64b5f6 90%)", // Gradient màu xanh dương trẻ trung
  color: "white",
  boxShadow: "0 4px 10px rgba(66, 165, 245, 0.4)",
  "&:hover": {
    background: "linear-gradient(45deg, #64b5f6 30%, #42a5f5 90%)",
    boxShadow: "0 6px 15px rgba(66, 165, 245, 0.6)",
  },
}));
export default StyledButton;
