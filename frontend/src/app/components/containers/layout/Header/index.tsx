"use client";

import { Box } from "@mui/material";
import AdminInfo from "./AdminInfo";

export default function Header() {
    return (
        <Box display="flex" gap={1} justifyContent="flex-end" width="100%">
            <AdminInfo />
        </Box>
    );
}
