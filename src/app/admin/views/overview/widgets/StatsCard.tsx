import React from "react";

interface StatsCardProps {
    title: string;
    value: number | undefined | null;
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
    formatValue?: (value: number) => string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    bgColor,
    iconColor,
    formatValue = (val) => val.toLocaleString()
}) => {
    // Güvenli value handling
    const safeValue = value ?? 0;
    const displayValue = formatValue(safeValue);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
                        <div className={`w-5 h-5 ${iconColor}`}>
                            {icon}
                        </div>
                    </div>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{displayValue}</p>
                </div>
            </div>
        </div>
    );
};

export default StatsCard; 