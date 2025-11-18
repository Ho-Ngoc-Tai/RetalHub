"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchUsersRequest,
    makeUser,
} from "@/app/stores/reducers/dashboard/userSlice";
import { AppDispatch } from "@/app/stores";

import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    TextField,
    InputAdornment,
    Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";

export default function UsersPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const user = useSelector(makeUser); // chỉ cần gọi 1 lần
    console.log("[UsersPage] user state =", user);

    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    // Fetch users từ backend thông qua saga (GET /users)
    useEffect(() => {
        dispatch(fetchUsersRequest());
    }, [dispatch]);

    // Lọc users theo searchText
    const filteredUsers = user.users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchText.toLowerCase()) ||
            u.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Users
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        placeholder="Tìm kiếm user..."
                        size="small"
                        variant="outlined"
                        sx={{ width: 300 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Button variant="contained" onClick={() => router.push("/user/create")}>
                        Thêm user
                    </Button>
                </Box>
            </Box>

            {/* Table */}
            {user.loading ? (
                <Typography>Đang tải...</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Website</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedUsers.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>{u.id}</TableCell>
                                    <TableCell>{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            sx={{ mr: 1 }}
                                            onClick={() => router.push(`/user/${u.id}/edit`)}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => router.push(`/user/${u.id}/delete`)}
                                        >
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Pagination */}
            <Pagination
                count={Math.ceil(filteredUsers.length / rowsPerPage)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            />

        </Box >
    );
}
