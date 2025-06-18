import React from "react";
import { AdminData, DashboardTab } from "./viewModel";
import Sidebar from "./widgets/Sidebar";

interface ViewProps {
    data: AdminData;
    activeTab: DashboardTab;
    isLoading: boolean;
    isLoggingOut: boolean;
    onTabChange: (tab: DashboardTab) => void;
    onLogout: () => void;
    renderActiveTab: () => React.ReactNode;
}

const View: React.FC<ViewProps> = ({
    data,
    activeTab,
    isLoading,
    isLoggingOut,
    onTabChange,
    onLogout,
    renderActiveTab
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="flex">
                {/* Sidebar */}
                <Sidebar
                    activeTab={activeTab}
                    currentUser={data.currentUser}
                    isLoggingOut={isLoggingOut}
                    onTabChange={onTabChange}
                    onLogout={onLogout}
                />

                {/* Main Content */}
                <div className="flex-1 min-h-screen">
                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            renderActiveTab()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default View; 