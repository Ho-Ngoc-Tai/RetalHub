/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetailRequest, makeUserDetail } from "@/app/stores/reducers/dashboard/userSlice";
import type { AppDispatch } from "@/app/stores";
import UserForm from "@/app/components/containers/auth/users/UserForm";

export default function EditUserPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const userDetail = useSelector(makeUserDetail);

    useEffect(() => {
        if (id && !userDetail.isCalling) {
            dispatch(fetchUserDetailRequest(id));
        }
    }, [id]);

    if (userDetail.isCalling) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" gap={2}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="textSecondary">
                    Loading User Data for Editing...
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Please wait while we prepare the edit form
                </Typography>
            </Box>
        );
    }

    if (userDetail.isError) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" gap={2}>
                <Typography variant="h6" color="error">
                    Failed to load user data for editing
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {userDetail.error || "Could not retrieve user data. Please try again."}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => {
                        if (id) {
                            dispatch(fetchUserDetailRequest(id));
                        }
                    }}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    if (userDetail.data) {
        return (
            <Box sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Chỉnh sửa user
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Cập nhật thông tin người dùng trong hệ thống
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        onClick={() => router.push("/user")}
                    >
                        Quay lại danh sách
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Box sx={{ width: "100%", maxWidth: 600 }}>
                        <UserForm userEdit={userDetail.data} />
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" gap={2}>
            <CircularProgress size={60} />
            <Typography variant="h6" color="textSecondary">
                Loading User Data for Editing...
            </Typography>
            <Typography variant="body2" color="textSecondary">
                Please wait while we prepare the edit form
            </Typography>
        </Box>
    );
}
