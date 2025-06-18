"use client";
import React, { useState } from "react";
import View from "./view";

export interface SettingsData {
    general: {
        siteName: string;
        siteDescription: string;
        contactEmail: string;
        maintenanceMode: boolean;
    };
    notifications: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        weeklyReports: boolean;
    };
    security: {
        twoFactorAuth: boolean;
        sessionTimeout: number;
        passwordPolicy: string;
    };
}

const ViewModel = () => {
    const [data, setData] = useState<SettingsData>({
        general: {
            siteName: "TETZ Platform",
            siteDescription: "Eğitim Teknolojileri Platformu",
            contactEmail: "admin@tetz.com",
            maintenanceMode: false
        },
        notifications: {
            emailNotifications: true,
            pushNotifications: false,
            weeklyReports: true
        },
        security: {
            twoFactorAuth: false,
            sessionTimeout: 30,
            passwordPolicy: "Güçlü"
        }
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGeneralChange = (field: keyof SettingsData['general'], value: string | boolean) => {
        setData(prev => ({
            ...prev,
            general: {
                ...prev.general,
                [field]: value
            }
        }));
    };

    const handleNotificationsChange = (field: keyof SettingsData['notifications'], value: boolean) => {
        setData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [field]: value
            }
        }));
    };

    const handleSecurityChange = (field: keyof SettingsData['security'], value: boolean | number | string) => {
        setData(prev => ({
            ...prev,
            security: {
                ...prev.security,
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // TODO: API'ye ayarları kaydet
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            setSuccess(true);
        } catch {
            setError('Ayarlar kaydedilirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View
            data={data}
            loading={loading}
            success={success}
            error={error}
            onGeneralChange={handleGeneralChange}
            onNotificationsChange={handleNotificationsChange}
            onSecurityChange={handleSecurityChange}
            onSave={handleSave}
        />
    );
};

export default ViewModel; 