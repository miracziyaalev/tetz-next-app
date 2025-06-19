import React from "react";

interface LocationData {
    count: number;
    state: string;
}

interface LocationChartProps {
    data: LocationData[];
}

const LocationChart: React.FC<LocationChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">En Çok Kayıt Olan İller</h3>
                    <p className="text-sm text-gray-500 mt-1">Top 10 il bazında kayıt dağılımı</p>
                </div>
                <div className="p-6">
                    <div className="text-center text-gray-500 py-8">
                        Henüz lokasyon verisi bulunmuyor
                    </div>
                </div>
            </div>
        );
    }

    const maxCount = Math.max(...data.map(item => item.count));

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">En Çok Kayıt Olan İller</h3>
                <p className="text-sm text-gray-500 mt-1">Top 10 il bazında kayıt dağılımı</p>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={item.state} className="flex items-center space-x-4">
                            <div className="w-16 text-sm font-medium text-gray-900">
                                {index + 1}.
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-900">{item.state}</span>
                                    <span className="text-sm text-gray-500">{item.count.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(item.count / maxCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocationChart; 