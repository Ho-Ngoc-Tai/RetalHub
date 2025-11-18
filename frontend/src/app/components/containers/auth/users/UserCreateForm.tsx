"use client";

import { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";

interface UserCreateFormProps {
    onSubmittingChange?: (submitting: boolean) => void;
}

export default function UserCreateForm({ onSubmittingChange }: UserCreateFormProps) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("tenant");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setSubmitting(true);
        onSubmittingChange?.(true);

        try {
            await api.post("/auth/register", {
                email,
                password,
                name,
                role,
            });
            setSuccess("User created successfully");
            // Sau khi tạo xong, chuyển về trang list user
            setTimeout(() => {
                router.push("/user");
            }, 800);
        } catch (err: any) {
            const message = err?.response?.data?.message || "Failed to create user";
            setError(typeof message === "string" ? message : JSON.stringify(message));
        } finally {
            setSubmitting(false);
            onSubmittingChange?.(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper sx={{ p: 4, minWidth: 400 }} component="form" onSubmit={handleSubmit}>
                <Typography variant="h5" mb={2}>
                    Create User
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
                    <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField label="Role" value={role} onChange={(e) => setRole(e.target.value)} fullWidth />

                    <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
                        <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                            {submitting ? "Creating..." : "Create"}
                        </Button>
                    </Box>

                    {error && (
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    )}
                    {success && (
                        <Typography variant="body2" color="success.main">
                            {success}
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
