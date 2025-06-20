"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import View from "./view";

// Import view models
import OverviewViewModel from "./views/overview/viewModel";
import CreateUserViewModel from "./views/create-user/viewModel";
import UserSearchViewModel from "./views/user-search/viewModel";
import CompaniesViewModel from "./views/companies/viewModel";
import CompanyDetailViewModel from "./views/company-detail/viewModel";

export interface AdminData {
    currentUser: {
        email: string;
        name: string;
        role?: string;
        lastLogin?: string;
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
    lastLogin?: string;
}

export type DashboardTab = "overview" | "createUser" | "users" | "userSearch" | "companies" | "companyDetail" | "settings";

const ViewModel = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

    // URL'den tab'ı al, varsayılan olarak overview
    const getActiveTabFromURL = useCallback((): DashboardTab => {
        const tab = searchParams.get('tab') as DashboardTab;
        const validTabs = ['overview', 'createUser', 'userSearch', 'companies', 'companyDetail'];

        // Eğer tab geçerli değilse veya gizli sekmelerden biriyse overview'a yönlendir
        if (!tab || !validTabs.includes(tab)) {
            return 'overview';
        }

        return tab;
    }, [searchParams]);

    const [activeTab, setActiveTab] = useState<DashboardTab>(getActiveTabFromURL());

    // URL değiştiğinde tab'ı güncelle
    useEffect(() => {
        const newTab = getActiveTabFromURL();
        setActiveTab(newTab);

        // Şirket detayları için ID'yi al
        if (newTab === 'companyDetail') {
            const companyId = searchParams.get('companyId');
            setSelectedCompanyId(companyId);
        }
    }, [searchParams, getActiveTabFromURL]);

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
                // API'den veri gelmezse localStorage'dan al
                const storedUser = localStorage.getItem('adminUser');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setCurrentUser(parsedUser);
                    setIsAuthenticated(true);
                } else {
                    router.push('/');
                }
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
            name: currentUser?.name || "TETZ Admin",
            role: currentUser?.role || "admin",
            lastLogin: currentUser?.lastLogin || new Date().toISOString()
        },
        stats: {
            totalUsers: 1250,
            activeUsers: 890,
            newUsers: 45
        }
    };

    const handleTabChange = (tab: DashboardTab) => {
        setActiveTab(tab);
        // URL'yi güncelle
        const params = new URLSearchParams(searchParams);
        params.set('tab', tab);
        router.push(`/admin?${params.toString()}`);
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
                return <OverviewViewModel />;
            case "createUser":
                return <CreateUserViewModel />;
            case "userSearch":
                return <UserSearchViewModel />;
            case "companies":
                return <CompaniesViewModel />;
            case "companyDetail":
                return selectedCompanyId ? <CompanyDetailViewModel /> : <CompaniesViewModel />;
            case "users":
            case "settings":
                // Bu sekmeler şimdilik gizli (mock veri)
                return <OverviewViewModel />;
            default:
                return <OverviewViewModel />;
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