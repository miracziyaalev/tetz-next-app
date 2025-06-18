"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import View from "./view";

// Import view models
import OverviewViewModel from "./views/overview/viewModel";
import CreateUserViewModel from "./views/create-user/viewModel";
import UsersViewModel from "./views/users/viewModel";
import SettingsViewModel from "./views/settings/viewModel";
import UserSearchViewModel from "../user-search/viewModel";

export interface AdminData {
    currentUser: {
        email: string;
        name: string;
    };
    stats: {
        totalUsers: number;
        activeUsers: number;
        newUsers: number;
    };
}

export interface CurrentUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

export type DashboardTab = "overview" | "createUser" | "users" | "userSearch" | "settings";

const ViewModel = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    // Session kontrolü
    const checkAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem('adminToken');

            if (!token) {
                router.push('/');
                return;
            }

            const response = await fetch('/api/auth/session', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                router.push('/');
                return;
            }

            const data = await response.json();

            if (data.success) {
                setIsAuthenticated(true);
                setCurrentUser(data.user);
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const data: AdminData = {
        currentUser: {
            email: currentUser?.email || "admin@tetz.com",
            name: currentUser?.name || "TETZ Admin"
        },
        stats: {
            totalUsers: 1250,
            activeUsers: 890,
            newUsers: 45
        }
    };

    const handleTabChange = (tab: DashboardTab) => {
        setActiveTab(tab);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            const token = localStorage.getItem('adminToken');

            if (token) {
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            router.push('/');
        }
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case "overview":
                return <OverviewViewModel data={{
                    stats: data.stats,
                    recentActivity: [
                        {
                            id: "1",
                            type: "user_created",
                            description: "Yeni kullanıcı oluşturuldu",
                            timestamp: "2 saat önce",
                            user: "admin@tetz.com"
                        },
                        {
                            id: "2",
                            type: "user_login",
                            description: "Kullanıcı giriş yaptı",
                            timestamp: "4 saat önce",
                            user: "user@example.com"
                        }
                    ]
                }} />;
            case "createUser":
                return <CreateUserViewModel />;
            case "users":
                return <UsersViewModel />;
            case "userSearch":
                return <UserSearchViewModel />;
            case "settings":
                return <SettingsViewModel />;
            default:
                return <OverviewViewModel data={{
                    stats: data.stats,
                    recentActivity: []
                }} />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <View
            data={data}
            activeTab={activeTab}
            isLoading={false}
            isLoggingOut={isLoggingOut}
            onTabChange={handleTabChange}
            onLogout={handleLogout}
            renderActiveTab={renderActiveTab}
        />
    );
};

export default ViewModel; 