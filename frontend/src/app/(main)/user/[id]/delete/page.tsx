"use client";

import { Box, Button, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { makeUser, removeUser } from "@/app/stores/reducers/dashboard/userSlice";
import type { AppDispatch } from "@/app/stores";

export default function DeleteUserPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector(makeUser);

    const targetUser = userState.users.find((u) => u.id === id);

    const handleCancel = () => {
        router.push("/user");
    };

    const handleConfirmDelete = () => {
        if (targetUser) {
            // Hiện tại chỉ xóa trong redux giống như hành vi modal cũ
            dispatch(removeUser(targetUser.id));
        }
        router.push("/user");
    };

    if (!targetUser) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" gap={2}>
                <Typography variant="h6" color="error">
                    Không tìm thấy user cần xóa
                </Typography>
                <Button variant="contained" onClick={handleCancel}>
                    Quay lại danh sách user
                </Button>
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" gap={3}>
            <Typography variant="h5" color="error">
                Xóa user
            </Typography>
            <Typography variant="body1">
                Bạn có chắc muốn xóa user <strong>{targetUser.name}</strong> (email: {targetUser.email}) không?
            </Typography>
            <Box display="flex" gap={2} mt={2}>
                <Button variant="outlined" onClick={handleCancel}>
                    Hủy
                </Button>
                <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                    Xóa
                </Button>
            </Box>
        </Box>
    );
}
