import React from "react";
import { SettingsData } from "./viewModel";

interface ViewProps {
    data: SettingsData;
    loading: boolean;
    success: boolean;
    error: string | null;
    onGeneralChange: (field: keyof SettingsData['general'], value: string | boolean) => void;
    onNotificationsChange: (field: keyof SettingsData['notifications'], value: boolean) => void;
    onSecurityChange: (field: keyof SettingsData['security'], value: boolean | number | string) => void;
    onSave: () => void;
}

const View: React.FC<ViewProps> = ({
    data,
    loading,
    success,
    error,
    onGeneralChange,
    onNotificationsChange,
    onSecurityChange,
    onSave
}) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
                <p className="text-gray-600 mt-1">Sistem ayarlarını yönetin</p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">Başarılı!</h3>
                            <div className="mt-2 text-sm text-green-700">
                                <p>Ayarlar başarıyla kaydedildi.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Hata!</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* General Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Genel Ayarlar</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                            Site Adı
                        </label>
                        <input
                            type="text"
                            id="siteName"
                            value={data.general.siteName}
                            onChange={(e) => onGeneralChange('siteName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-2">
                            Site Açıklaması
                        </label>
                        <textarea
                            id="siteDescription"
                            rows={3}
                            value={data.general.siteDescription}
                            onChange={(e) => onGeneralChange('siteDescription', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                            İletişim E-posta
                        </label>
                        <input
                            type="email"
                            id="contactEmail"
                            value={data.general.contactEmail}
                            onChange={(e) => onGeneralChange('contactEmail', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="maintenanceMode"
                            checked={data.general.maintenanceMode}
                            onChange={(e) => onGeneralChange('maintenanceMode', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                            Bakım Modu
                        </label>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Bildirim Ayarları</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="emailNotifications"
                            checked={data.notifications.emailNotifications}
                            onChange={(e) => onNotificationsChange('emailNotifications', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                            E-posta Bildirimleri
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="pushNotifications"
                            checked={data.notifications.pushNotifications}
                            onChange={(e) => onNotificationsChange('pushNotifications', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="pushNotifications" className="ml-2 block text-sm text-gray-900">
                            Push Bildirimleri
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="weeklyReports"
                            checked={data.notifications.weeklyReports}
                            onChange={(e) => onNotificationsChange('weeklyReports', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="weeklyReports" className="ml-2 block text-sm text-gray-900">
                            Haftalık Raporlar
                        </label>
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Güvenlik Ayarları</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="twoFactorAuth"
                            checked={data.security.twoFactorAuth}
                            onChange={(e) => onSecurityChange('twoFactorAuth', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-900">
                            İki Faktörlü Kimlik Doğrulama
                        </label>
                    </div>

                    <div>
                        <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-2">
                            Oturum Zaman Aşımı (dakika)
                        </label>
                        <input
                            type="number"
                            id="sessionTimeout"
                            value={data.security.sessionTimeout}
                            onChange={(e) => onSecurityChange('sessionTimeout', parseInt(e.target.value))}
                            min="5"
                            max="1440"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="passwordPolicy" className="block text-sm font-medium text-gray-700 mb-2">
                            Şifre Politikası
                        </label>
                        <select
                            id="passwordPolicy"
                            value={data.security.passwordPolicy}
                            onChange={(e) => onSecurityChange('passwordPolicy', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="Zayıf">Zayıf</option>
                            <option value="Orta">Orta</option>
                            <option value="Güçlü">Güçlü</option>
                            <option value="Çok Güçlü">Çok Güçlü</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={onSave}
                    disabled={loading}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {loading && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                </button>
            </div>
        </div>
    );
};

export default View; 