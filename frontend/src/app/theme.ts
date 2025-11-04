"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffeba7",
    },
    background: {
      default: "#1f2029",
      paper: "#2a2b38",
    },
    text: {
      primary: "#c4c3ca",
      secondary: "#ffeba7",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h4: { fontWeight: 600 },
    h6: { fontWeight: 700, textTransform: "uppercase" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "uppercase",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#102770",
            color: "#ffeba7",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#1f2029",
          },
        },
      },
    },
  },
});

export default theme;
