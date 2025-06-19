import React from "react";
import { OverviewData } from "./viewModel";
import {
    StatsCard,
    LocationChart,
    RegistrationTrend,
    EducationSectorChart
} from "./widgets";

interface ViewProps {
    data: OverviewData | null;
}

const View: React.FC<ViewProps> = ({ data }) => {
    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-gray-600 text-xl mb-4">📊</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Veri Bulunamadı</h2>
                    <p className="text-gray-600">Dashboard verileri yüklenemedi</p>
                </div>
            </div>
        );
    }

    // Güvenli data erişimi
    const generalStats = data.general_stats || {};
    const fairActivityStats = data.fair_activity_stats || {};
    const locationStats = data.location_stats || {};
    const registrationTrends = data.registration_trends || {};
    const educationSectorStats = data.education_sector_stats || {};

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Genel Bakış</h1>
                <p className="text-gray-600 mt-1">Sistem genel durumu ve istatistikler</p>
            </div>

            {/* Stats Grid - 4 kart */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard
                    title="Toplam Kullanıcı"
                    value={generalStats.total_users}
                    icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                    }
                    bgColor="bg-blue-100"
                    iconColor="text-blue-600"
                />

                <StatsCard
                    title="Son 24 Saat"
                    value={generalStats.new_users_last_24h}
                    icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    }
                    bgColor="bg-green-100"
                    iconColor="text-green-600"
                />

                <StatsCard
                    title="Bugünkü Kayıt"
                    value={generalStats.new_users_today}
                    icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                    bgColor="bg-purple-100"
                    iconColor="text-purple-600"
                />

                <StatsCard
                    title="Bugünkü Giriş"
                    value={fairActivityStats.entries_today}
                    icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    bgColor="bg-yellow-100"
                    iconColor="text-yellow-600"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Registration Trend */}
                <RegistrationTrend
                    data={registrationTrends.daily_registrations_last_14_days || []}
                />

                {/* Education Sector */}
                <EducationSectorChart
                    data={educationSectorStats.by_type || []}
                    total={educationSectorStats.total_in_sector || 0}
                />
            </div>

            {/* Location Chart - Full Width */}
            <LocationChart data={locationStats.top_10_states || []} />
        </div>
    );
};

export default View; 