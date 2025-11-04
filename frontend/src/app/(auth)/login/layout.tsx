"use client";

import { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";

import { Provider } from "react-redux";
import theme from "@/app/theme";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
