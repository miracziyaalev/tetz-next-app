"use client";
import React, { useState, useEffect } from "react";
import View from "./view";

export interface User {
    id: string;
    email: string;
    full_name: string;
    title: string;
    institution: string;
    phone_number: string;
    role: string;
    created_at: string;
    is_active: boolean;
}

export interface UsersData {
    users: User[];
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
}

const ViewModel = () => {
    const [data, setData] = useState<UsersData>({
        users: [],
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // TODO: API'den kullanıcı listesini çek
        // Şimdilik mock data kullanıyoruz
        const mockUsers: User[] = [
            {
                id: "1",
                email: "user1@example.com",
                full_name: "Ahmet Yılmaz",
                title: "Öğretmen",
                institution: "MEB",
                phone_number: "5550000001",
                role: "user",
                created_at: "2024-01-15",
                is_active: true
            },
            {
                id: "2",
                email: "user2@example.com",
                full_name: "Ayşe Demir",
                title: "Akademisyen",
                institution: "Üniversite",
                phone_number: "5550000002",
                role: "user",
                created_at: "2024-01-20",
                is_active: true
            }
        ];

        setData({
            users: mockUsers,
            totalUsers: mockUsers.length,
            activeUsers: mockUsers.filter(u => u.is_active).length,
            inactiveUsers: mockUsers.filter(u => !u.is_active).length
        });
        setLoading(false);
    }, []);

    return <View data={data} loading={loading} error={error} />;
};

export default ViewModel; 