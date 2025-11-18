"use client";

import { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { makeUserUpdate, updateUserRequest, type User } from "@/app/stores/reducers/dashboard/userSlice";
import type { AppDispatch } from "@/app/stores";

interface UserFormProps {
    userEdit: User;
}

export default function UserForm({ userEdit }: UserFormProps) {
    const dispatch = useDispatch<AppDispatch>();
    const userUpdate = useSelector(makeUserUpdate);

    const [name, setName] = useState(userEdit.name);
    const [email, setEmail] = useState(userEdit.email);


    useEffect(() => {
        setName(userEdit.name);
        setEmail(userEdit.email);
    }, [userEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(
            updateUserRequest({
                id: userEdit.id,
                name,
                email,
            } as User),
        );
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper sx={{ p: 4, minWidth: 400 }} component="form" onSubmit={handleSubmit}>
                <Typography variant="h5" mb={2}>
                    Edit User
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                    <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />

                    <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
                        <Button type="submit" variant="contained" color="primary" disabled={userUpdate.isCalling}>
                            {userUpdate.isCalling ? "Saving..." : "Save"}
                        </Button>
                    </Box>

                    {userUpdate.isError && (
                        <Typography variant="body2" color="error">
                            {userUpdate.error || "Update user failed"}
                        </Typography>
                    )}
                    {userUpdate.isSuccess && (
                        <Typography variant="body2" color="success.main">
                            Update user successfully
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
