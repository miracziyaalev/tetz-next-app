"use client";
import React from "react";
import View from "./view";

export interface OverviewData {
    stats: {
        totalUsers: number;
        activeUsers: number;
        newUsers: number;
    };
    recentActivity: Array<{
        id: string;
        type: string;
        description: string;
        timestamp: string;
        user: string;
    }>;
}

const ViewModel: React.FC<{ data: OverviewData }> = ({ data }) => {
    return <View data={data} />;
};

export default ViewModel; 