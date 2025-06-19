import React from "react";

interface RegistrationData {
    count: number;
    registration_date: string;
}

interface RegistrationTrendProps {
    data: RegistrationData[];
}

const RegistrationTrend: React.FC<RegistrationTrendProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Son 14 Günlük Kayıt Trendi</h3>
                    <p className="text-sm text-gray-500 mt-1">Günlük kayıt sayıları</p>
                </div>
                <div className="p-6">
                    <div className="text-center text-gray-500 py-8">
                        Henüz kayıt trendi verisi bulunmuyor
                    </div>
                </div>
            </div>
        );
    }

    const maxCount = Math.max(...data.map(item => item.count));
    const minHeight = 20; // Minimum bar height
    const maxHeight = 120; // Maximum bar height

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short'
        });
    };

    const calculateBarHeight = (count: number) => {
        if (maxCount === 0) return minHeight;
        const percentage = count / maxCount;
        return Math.max(minHeight, percentage * maxHeight);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Son 14 Günlük Kayıt Trendi</h3>
                <p className="text-sm text-gray-500 mt-1">Günlük kayıt sayıları</p>
            </div>
            <div className="p-6">
                <div className="flex items-end space-x-2 h-48">
                    {data.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-gray-200 rounded-t-sm relative">
                                <div
                                    className="bg-gradient-to-t from-green-600 to-green-500 rounded-t-sm transition-all duration-300 hover:from-green-700 hover:to-green-600 cursor-pointer"
                                    style={{
                                        height: `${calculateBarHeight(item.count)}px`,
                                        minHeight: `${minHeight}px`
                                    }}
                                    title={`${item.count} kayıt - ${formatDate(item.registration_date)}`}
                                />
                            </div>
                            <div className="mt-2 text-xs text-gray-500 text-center">
                                {formatDate(item.registration_date)}
                            </div>
                            <div className="text-xs font-medium text-gray-900 mt-1">
                                {item.count}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RegistrationTrend; 