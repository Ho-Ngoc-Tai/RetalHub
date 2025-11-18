"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import UserCreateForm from "@/app/components/containers/auth/users/UserCreateForm";

export default function CreateUserPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isSubmitting) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" gap={2}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="textSecondary">
                    Creating user...
                </Typography>
            </Box>
        );
    }

    return <UserCreateForm onSubmittingChange={setIsSubmitting} />;
}
