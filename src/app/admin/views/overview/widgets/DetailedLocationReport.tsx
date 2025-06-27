import React, { useState } from "react";

interface District {
    count: number;
    province: string;
}

interface StateData {
    state: string;
    districts: District[];
    total_users: number;
}

interface DetailedLocationReportProps {
    data: StateData[];
}

const DetailedLocationReport: React.FC<DetailedLocationReportProps> = ({ data }) => {
    const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Detaylı Konum Raporu</h3>
                    <p className="text-sm text-gray-500 mt-1">İl ve ilçe bazında kullanıcı dağılımı</p>
                </div>
                <div className="p-6">
                    <div className="text-center text-gray-500 py-8">
                        Henüz konum raporu verisi bulunmuyor
                    </div>
                </div>
            </div>
        );
    }

    const toggleState = (stateName: string) => {
        const newExpanded = new Set(expandedStates);
        if (newExpanded.has(stateName)) {
            newExpanded.delete(stateName);
        } else {
            newExpanded.add(stateName);
        }
        setExpandedStates(newExpanded);
    };

    // Arama filtresi
    const filteredData = data.filter(state =>
        state.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.districts.some(district =>
            district.province.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Toplam kullanıcı sayısı
    const totalUsers = data.reduce((sum, state) => sum + state.total_users, 0);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Detaylı Konum Raporu</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Toplam {totalUsers.toLocaleString()} kullanıcı, {data.length} il
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setExpandedStates(new Set(data.map(s => s.state)))}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Tümünü Aç
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                            onClick={() => setExpandedStates(new Set())}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Tümünü Kapat
                        </button>
                    </div>
                </div>

                {/* Arama */}
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="İl veya ilçe ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
                <div className="p-6 space-y-4">
                    {filteredData.map((stateData, index) => (
                        <div key={stateData.state || `empty-${index}`} className="border border-gray-200 rounded-lg">
                            <div
                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                onClick={() => toggleState(stateData.state)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className={`w-5 h-5 text-gray-400 transition-transform ${expandedStates.has(stateData.state) ? 'rotate-90' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {stateData.state || "Belirtilmemiş"}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            {stateData.districts.length} ilçe
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                        {stateData.total_users.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        %{((stateData.total_users / totalUsers) * 100).toFixed(1)}
                                    </div>
                                </div>
                            </div>

                            {expandedStates.has(stateData.state) && (
                                <div className="border-t border-gray-200 bg-gray-50">
                                    <div className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {stateData.districts
                                                .sort((a, b) => b.count - a.count)
                                                .map((district, districtIndex) => (
                                                    <div
                                                        key={`${district.province}-${districtIndex}`}
                                                        className="flex justify-between items-center p-2 bg-white rounded border border-gray-200"
                                                    >
                                                        <span className="text-sm text-gray-700">
                                                            {district.province || "Belirtilmemiş"}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {district.count.toLocaleString()}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailedLocationReport; 