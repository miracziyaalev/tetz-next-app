"use client";
import React, { useState, useEffect } from "react";
import View from "./view";

export interface OverviewData {
    general_stats: {
        total_users: number;
        new_users_today: number;
        new_users_last_24h: number;
    };
    location_stats: {
        top_10_states: Array<{
            count: number;
            state: string;
        }>;
    };
    fair_activity_stats: {
        tetz_entries_today: number;
        total_tetz_entries: number;
        gate_entries_today: number;
    };
    registration_trends: {
        daily_registrations_last_14_days: Array<{
            count: number;
            registration_date: string;
        }>;
    };
    education_sector_stats: {
        by_type: Array<{
            type: string;
            count: number;
        }>;
        total_in_sector: number;
    };
}

export interface LocationReportData {
    report: Array<{
        state: string;
        districts: Array<{
            count: number;
            province: string;
        }>;
        total_users: number;
    }>;
    success: boolean;
}

const ViewModel: React.FC = () => {
    const [data, setData] = useState<OverviewData | null>(null);
    const [locationReportData, setLocationReportData] = useState<LocationReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError(null);

                // localStorage'dan admin token'ı al
                const adminToken = localStorage.getItem('adminToken');

                if (!adminToken) {
                    throw new Error('Oturum açmanız gerekiyor');
                }

                console.log('Admin token bulundu');

                // Dashboard ve konum raporu verilerini paralel olarak al
                const [dashboardResponse, locationReportResponse] = await Promise.all([
                    fetch('/api/dashboard', {
                        headers: {
                            'Authorization': `Bearer ${adminToken}`
                        }
                    }),
                    fetch('/api/location-report', {
                        headers: {
                            'Authorization': `Bearer ${adminToken}`
                        }
                    })
                ]);

                console.log('Dashboard API response status:', dashboardResponse.status);
                console.log('Location Report API response status:', locationReportResponse.status);

                // Dashboard verilerini işle
                if (!dashboardResponse.ok) {
                    const errorData = await dashboardResponse.json();
                    console.error('Dashboard API error:', errorData);
                    throw new Error(errorData.message || 'Dashboard verileri alınamadı');
                }

                const dashboardResult = await dashboardResponse.json();
                console.log('Dashboard API result:', dashboardResult);

                if (dashboardResult.success && dashboardResult.data) {
                    // Data validation
                    const dashboardData = dashboardResult.data;

                    // Güvenli data yapısı oluştur
                    const safeData: OverviewData = {
                        general_stats: {
                            total_users: dashboardData.general_stats?.total_users ?? 0,
                            new_users_today: dashboardData.general_stats?.new_users_today ?? 0,
                            new_users_last_24h: dashboardData.general_stats?.new_users_last_24h ?? 0
                        },
                        location_stats: {
                            top_10_states: dashboardData.location_stats?.top_10_states ?? []
                        },
                        fair_activity_stats: {
                            tetz_entries_today: dashboardData.fair_activity_stats?.tetz_entries_today ?? 0,
                            total_tetz_entries: dashboardData.fair_activity_stats?.total_tetz_entries ?? 0,
                            gate_entries_today: dashboardData.fair_activity_stats?.gate_entries_today ?? 0
                        },
                        registration_trends: {
                            daily_registrations_last_14_days: dashboardData.registration_trends?.daily_registrations_last_14_days ?? []
                        },
                        education_sector_stats: {
                            by_type: dashboardData.education_sector_stats?.by_type ?? [],
                            total_in_sector: dashboardData.education_sector_stats?.total_in_sector ?? 0
                        }
                    };

                    setData(safeData);
                } else {
                    throw new Error('Dashboard veri formatı geçersiz');
                }

                // Konum raporu verilerini işle
                if (locationReportResponse.ok) {
                    const locationReportResult = await locationReportResponse.json();
                    console.log('Location Report API result:', locationReportResult);

                    if (locationReportResult.success && locationReportResult.data) {
                        setLocationReportData(locationReportResult.data);
                    } else {
                        console.warn('Konum raporu verisi alınamadı, ancak devam ediliyor');
                    }
                } else {
                    console.warn('Konum raporu API hatası, ancak devam ediliyor');
                }

            } catch (err) {
                console.error('Veri çekme hatası:', err);
                setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Dashboard verileri yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Hata Oluştu</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    return <View data={data} locationReportData={locationReportData} />;
};

export default ViewModel; 