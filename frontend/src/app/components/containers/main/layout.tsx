"use client";
import { ReactNode } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <Box sx={{ p: 3, backgroundColor: '#ffffffff', flex: 1 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}
