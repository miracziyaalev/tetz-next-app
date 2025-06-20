"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import View from "./view";

export interface CompanyDetail {
    id: number;
    fair_id: string;
    name: {
        en: string;
        tr: string;
    };
    description: {
        en: string;
        tr: string;
    };
    logo_url?: string;
    website_url?: string;
    representative_info?: Record<string, unknown>;
    area_of_activity?: string;
    stand_number?: string;
    sponsorship_level?: string;
    phone_number?: string;
    email?: string;
    address: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CompanyFormData {
    name: {
        en: string;
        tr: string;
    };
    description: {
        en: string;
        tr: string;
    };
    logo_url: string;
    website_url: string;
    area_of_activity: string;
    stand_number: string;
    sponsorship_level: string;
    phone_number: string;
    email: string;
    address: string;
    is_active: boolean;
}

export interface CompanyDetailData {
    company: CompanyDetail | null;
    isLoading: boolean;
    error: string | null;
    lang: 'tr' | 'en';
    isEditing: boolean;
    isSaving: boolean;
    formData: CompanyFormData | null;
}

const ViewModel = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [company, setCompany] = useState<CompanyDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lang, setLang] = useState<'tr' | 'en'>('tr');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<CompanyFormData | null>(null);

    const companyId = searchParams.get('companyId');

    const fetchCompanyDetails = useCallback(async () => {
        if (!companyId) {
            setError('Şirket ID bulunamadı');
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/companies/${companyId}?lang=${lang}`);

            if (!response.ok) {
                throw new Error('Şirket detayları yüklenirken bir hata oluştu');
            }

            const result = await response.json();

            if (result.success) {
                const companyData = result.company?.company || result.company;
                setCompany(companyData);

                // Form verilerini hazırla
                if (companyData) {
                    setFormData({
                        name: companyData.name,
                        description: companyData.description,
                        logo_url: companyData.logo_url || '',
                        website_url: companyData.website_url || '',
                        area_of_activity: companyData.area_of_activity || '',
                        stand_number: companyData.stand_number || '',
                        sponsorship_level: companyData.sponsorship_level || '',
                        phone_number: companyData.phone_number || '',
                        email: companyData.email || '',
                        address: companyData.address,
                        is_active: companyData.is_active
                    });
                }
            } else {
                throw new Error(result.message || 'Şirket detayları yüklenemedi');
            }

        } catch (err) {
            console.error('Company detail fetch error:', err);
            setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    }, [companyId, lang]);

    useEffect(() => {
        if (companyId) {
            fetchCompanyDetails();
        }
    }, [companyId, lang, fetchCompanyDetails]);

    const handleLanguageChange = (newLang: 'tr' | 'en') => {
        setLang(newLang);
    };

    const handleBackToList = () => {
        router.push('/admin?tab=companies');
    };

    const handleRefresh = () => {
        fetchCompanyDetails();
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleFormChange = (field: keyof CompanyFormData, value: string | boolean | { en: string; tr: string }) => {
        if (!formData) return;

        if (field === 'name' || field === 'description') {
            // JSON formatında gelen çok dilli veriyi direkt ata
            setFormData({
                ...formData,
                [field]: value as { en: string; tr: string }
            });
        } else {
            setFormData({
                ...formData,
                [field]: value
            });
        }
    };

    const handleSave = async () => {
        if (!formData || !companyId) return;

        // Form validasyonu
        if (!formData.name.tr || !formData.name.en) {
            setError('Şirket adı hem Türkçe hem İngilizce olmalıdır');
            return;
        }

        if (!formData.description.tr || !formData.description.en) {
            setError('Açıklama hem Türkçe hem İngilizce olmalıdır');
            return;
        }

        if (!formData.address) {
            setError('Adres alanı zorunludur');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);

            // Admin token'ını al
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                setError('Admin oturumu bulunamadı');
                return;
            }

            console.log('Sending update request for company:', companyId);
            console.log('Form data:', JSON.stringify(formData, null, 2));

            const response = await fetch(`/api/companies/${companyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Şirket güncellenirken bir hata oluştu');
            }

            const result = await response.json();
            console.log('Success response:', result);

            if (result.success) {
                // Başarılı güncelleme - şirket verilerini yenile
                await fetchCompanyDetails();
                setIsEditing(false);
            } else {
                throw new Error(result.message || 'Şirket güncellenemedi');
            }

        } catch (err) {
            console.error('Save error:', err);
            setError(err instanceof Error ? err.message : 'Kaydetme sırasında bir hata oluştu');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Form verilerini orijinal haline geri yükle
        if (company) {
            setFormData({
                name: company.name,
                description: company.description,
                logo_url: company.logo_url || '',
                website_url: company.website_url || '',
                area_of_activity: company.area_of_activity || '',
                stand_number: company.stand_number || '',
                sponsorship_level: company.sponsorship_level || '',
                phone_number: company.phone_number || '',
                email: company.email || '',
                address: company.address,
                is_active: company.is_active
            });
        }
    };

    const data: CompanyDetailData = {
        company,
        isLoading,
        error,
        lang,
        isEditing,
        isSaving,
        formData
    };

    return (
        <View
            data={data}
            onLanguageChange={handleLanguageChange}
            onBackToList={handleBackToList}
            onRefresh={handleRefresh}
            onEditToggle={handleEditToggle}
            onFormChange={handleFormChange}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );
};

export default ViewModel; 