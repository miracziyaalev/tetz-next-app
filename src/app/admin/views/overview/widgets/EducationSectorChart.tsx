import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";

interface EducationData {
    type: string;
    count: number;
}

interface ChartData {
    name: string;
    value: number;
    color: string;
}

interface EducationSectorChartProps {
    data: EducationData[];
    total: number;
}

const EducationSectorChart: React.FC<EducationSectorChartProps> = ({ data, total }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-base font-medium text-gray-900">Eğitim Sektörü Dağılımı</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Toplam {total.toLocaleString()} eğitim kurumu</p>
                </div>
                <div className="p-4">
                    <div className="text-center text-gray-500 py-6">
                        Henüz eğitim sektörü verisi bulunmuyor
                    </div>
                </div>
            </div>
        );
    }

    const COLORS = {
        meb: '#3B82F6', // blue-500
        private: '#8B5CF6', // purple-500
        default: '#6B7280' // gray-500
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'meb':
                return 'MEB';
            case 'private':
                return 'Özel';
            default:
                return type.charAt(0).toUpperCase() + type.slice(1);
        }
    };

    const getTypeColor = (type: string) => {
        return COLORS[type as keyof typeof COLORS] || COLORS.default;
    };

    // Recharts için veriyi hazırla
    const chartData = data.map(item => ({
        name: getTypeLabel(item.type),
        value: item.count,
        color: getTypeColor(item.type)
    }));

    const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            const data = payload[0].payload as ChartData;
            return (
                <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{data.name}</p>
                    <p className="text-xs text-gray-600">
                        {data.value.toLocaleString()} kurum
                        <span className="text-gray-400 ml-1">
                            ({((data.value / total) * 100).toFixed(1)}%)
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-900">Eğitim Sektörü Dağılımı</h3>
                <p className="text-sm text-gray-500 mt-0.5">Toplam {total.toLocaleString()} eğitim kurumu</p>
            </div>
            <div className="p-4">
                <div className="flex items-center">
                    {/* Pasta Chart */}
                    <div className="flex-1" style={{ height: "200px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            stroke="white"
                                            strokeWidth={1}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-2 pl-4">
                        {data.map((item) => {
                            const percentage = ((item.count / total) * 100).toFixed(1);
                            const color = getTypeColor(item.type);

                            return (
                                <div key={item.type} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                        <span className="text-sm font-medium text-gray-900">
                                            {getTypeLabel(item.type)}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-sm text-gray-500">
                                            {item.count.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            ({percentage}%)
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationSectorChart; 