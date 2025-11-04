"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchUsersRequest,
    fetchUsersSuccess,
    fetchUsersFailure,
    addUser,
    updateUser,
    removeUser,
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function UsersPage() {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(makeUser); // chỉ cần gọi 1 lần

    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    // Fetch users từ API JSONPlaceholder
    useEffect(() => {
        const fetchUsers = async () => {
            dispatch(fetchUsersRequest());
            try {
                const res = await fetch("https://jsonplaceholder.typicode.com/users");
                const data = await res.json();
                dispatch(fetchUsersSuccess(data));
            } catch (error: any) {
                dispatch(fetchUsersFailure(error.message));
            }
        };
        fetchUsers();
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

    const handleOpenForm = (user?: any) => {
        if (user) {
            setSelectedUser(user);
            setIsEdit(true);
        } else {
            setSelectedUser({ id: 0, name: "", email: "", phone: "", website: "" });
            setIsEdit(false);
        }
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedUser(null);
    };

    const handleSaveUser = () => {
        if (!selectedUser) return;

        if (isEdit) {
            dispatch(updateUser(selectedUser));
        } else {
            const maxId =
                user.users.length > 0 ? Math.max(...user.users.map((u) => u.id)) : 0;
            dispatch(addUser({ ...selectedUser, id: maxId + 1 }));
        }
        handleCloseForm();
    };

    const handleOpenDelete = (user: any) => {
        setSelectedUser(user);
        setOpenDelete(true);
    };

    const handleConfirmDelete = () => {
        if (selectedUser) dispatch(removeUser(selectedUser.id));
        setOpenDelete(false);
        setSelectedUser(null);
    };

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
                    <Button variant="contained" onClick={() => handleOpenForm()}>
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
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
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
                                    <TableCell>{u.phone}</TableCell>
                                    <TableCell>{u.website}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            sx={{ mr: 1 }}
                                            onClick={() => handleOpenForm(u)}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => handleOpenDelete(u)}
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

            {/* Dialog Form */}
            <Dialog open={openForm} onClose={handleCloseForm}>
                <DialogTitle>{isEdit ? "Cập nhật user" : "Thêm user"}</DialogTitle>
                <DialogContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                >
                    <TextField
                        label="Name"
                        value={selectedUser?.name || ""}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser!, name: e.target.value })
                        }
                    />
                    <TextField
                        label="Email"
                        value={selectedUser?.email || ""}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser!, email: e.target.value })
                        }
                    />
                    <TextField
                        label="Phone"
                        value={selectedUser?.phone || ""}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser!, phone: e.target.value })
                        }
                    />
                    <TextField
                        label="Website"
                        value={selectedUser?.website || ""}
                        onChange={(e) =>
                            setSelectedUser({ ...selectedUser!, website: e.target.value })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForm}>Hủy</Button>
                    <Button variant="contained" onClick={handleSaveUser}>
                        {isEdit ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Delete */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    Bạn có chắc muốn xóa user {selectedUser?.name} không?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>Hủy</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmDelete}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
