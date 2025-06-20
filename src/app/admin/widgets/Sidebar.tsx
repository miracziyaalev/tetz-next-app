import React from "react";
import { DashboardTab } from "../viewModel";
import Image from "next/image";

interface SidebarProps {
    activeTab: DashboardTab;
    currentUser: {
        email: string;
        name: string;
        role?: string;
        lastLogin?: string;
    };
    isLoggingOut: boolean;
    onTabChange: (tab: DashboardTab) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    currentUser,
    isLoggingOut,
    onTabChange,
    onLogout
}) => {
    const menuItems = [
        {
            id: "overview" as DashboardTab,
            label: "Genel Bakış",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            id: "createUser" as DashboardTab,
            label: "Kullanıcı Oluştur",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            )
        },
        {
            id: "userSearch" as DashboardTab,
            label: "Kullanıcı Arama",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            id: "companies" as DashboardTab,
            label: "Şirketler",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        }
        // Kullanıcılar ve Ayarlar sekmeleri şimdilik gizlendi (mock veri)
    ];

    return (
        <div className="fixed left-0 top-0 w-64 bg-white shadow-lg h-screen flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                    <Image
                        src="/tetz_logo.png"
                        alt="TETZ Logo"
                        width={120}
                        height={40}
                        className="h-auto"
                    />
                </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200">
                        <Image
                            src="https://tetz-images.kaat.digital/final_logo.png"
                            alt="TETZ Avatar"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    </div>

                    {/* User Details */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {currentUser.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {currentUser.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 flex-1">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onTabChange(item.id)}
                                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${activeTab === item.id
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={onLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoggingOut ? (
                        <>
                            <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Çıkış Yapılıyor...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Çıkış Yap
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar; 