"use client";

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
                    />
                    <Button variant="contained">Thêm user</Button>
                </Box>
            </Box>

            {/* Table */}
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
                        <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell>Leanne Graham</TableCell>
                            <TableCell>leanne@example.com</TableCell>
                            <TableCell>123456789</TableCell>
                            <TableCell>leanne.com</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{ mr: 1 }}
                                >
                                    Sửa
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                >
                                    Xóa
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Pagination
                count={10}
                page={1}
                color="primary"
                sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            />

            {/* Dialog Form */}
            <Dialog open={false}>
                <DialogTitle>Thêm / Cập nhật user</DialogTitle>
                <DialogContent
                    sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
                >
                    <TextField label="Name" />
                    <TextField label="Email" />
                    <TextField label="Phone" />
                    <TextField label="Website" />
                </DialogContent>
                <DialogActions>
                    <Button>Hủy</Button>
                    <Button variant="contained">Lưu</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Delete */}
            <Dialog open={false}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    Bạn có chắc muốn xóa user này không?
                </DialogContent>
                <DialogActions>
                    <Button>Hủy</Button>
                    <Button variant="contained" color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
