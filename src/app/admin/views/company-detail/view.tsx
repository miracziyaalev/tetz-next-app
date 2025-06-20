import React, { useState, useEffect } from "react";
import { CompanyDetailData, CompanyFormData, CompanyDetail } from "./viewModel";
import { ArrowLeftIcon, PencilIcon, CheckIcon, XMarkIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface ViewProps {
    data: CompanyDetailData;
    onLanguageChange: (lang: 'tr' | 'en') => void;
    onBackToList: () => void;
    onRefresh: () => void;
    onEditToggle: () => void;
    onFormChange: (field: keyof CompanyFormData, value: string | boolean | { en: string; tr: string }) => void;
    onSave: () => Promise<void>;
    onCancel: () => void;
}

const View: React.FC<ViewProps> = ({
    data,
    onLanguageChange,
    onBackToList,
    onRefresh,
    onEditToggle,
    onFormChange,
    onSave,
    onCancel
}) => {
    const { company, isLoading, error, lang, isEditing, isSaving, formData } = data;
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Başarı mesajını göster ve otomatik gizle
    useEffect(() => {
        if (showSuccessMessage) {
            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessMessage]);

    const handleSaveWithSuccess = async () => {
        await onSave();
        setShowSuccessMessage(true);
    };

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                    <XMarkIcon className="h-6 w-6 text-red-400 mr-3" />
                    <h3 className="text-lg font-medium text-red-800">Hata</h3>
                </div>
                <p className="mt-2 text-red-700">{error}</p>
                <div className="mt-4 flex space-x-3">
                    <button
                        onClick={onRefresh}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Tekrar Dene
                    </button>
                    <button
                        onClick={onBackToList}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Listeye Dön
                    </button>
                </div>
            </div>
        );
    }

    if (!company || !formData) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800">Şirket bulunamadı</p>
            </div>
        );
    }

    return (
        <div>
            {/* Başarı Mesajı */}
            {showSuccessMessage && (
                <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
                        <span className="text-green-800 font-medium">Şirket başarıyla güncellendi!</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onBackToList}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Şirketler Listesi</span>
                    </button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? 'Şirket Düzenle' : company.name[lang]}
                    </h1>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Dil Değiştirme */}
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                        <button
                            onClick={() => onLanguageChange('tr')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${lang === 'tr'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            TR
                        </button>
                        <button
                            onClick={() => onLanguageChange('en')}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${lang === 'en'
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            EN
                        </button>
                    </div>

                    {/* Düzenleme Butonları */}
                    {!isEditing ? (
                        <button
                            onClick={onEditToggle}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PencilIcon className="h-4 w-4" />
                            <span>Düzenle</span>
                        </button>
                    ) : (
                        <div className="flex space-x-2">
                            <button
                                onClick={onCancel}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <XMarkIcon className="h-4 w-4" />
                                <span>İptal</span>
                            </button>
                            <button
                                onClick={handleSaveWithSuccess}
                                disabled={isSaving}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                <CheckIcon className="h-4 w-4" />
                                <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Ana İçerik */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Hata Mesajı */}
                {error && (
                    <div className="bg-red-50 border-b border-red-200 p-4">
                        <div className="flex items-center">
                            <XMarkIcon className="h-5 w-5 text-red-400 mr-2" />
                            <span className="text-red-800 font-medium">{error}</span>
                        </div>
                    </div>
                )}

                {isEditing ? (
                    <CompanyEditForm
                        formData={formData}
                        onFormChange={onFormChange}
                    />
                ) : (
                    <CompanyDetailView company={company} lang={lang} />
                )}
            </div>
        </div>
    );
};

// Şirket Detay Görünümü
const CompanyDetailView: React.FC<{ company: CompanyDetail; lang: 'tr' | 'en' }> = ({ company, lang }) => {
    return (
        <div className="p-6">
            {/* Logo ve Temel Bilgiler */}
            <div className="flex items-start space-x-6 mb-8">
                {company.logo_url && (
                    <div className="flex-shrink-0">
                        <Image
                            src={company.logo_url}
                            alt={company.name[lang]}
                            width={96}
                            height={96}
                            className="object-contain border border-gray-200 rounded-lg"
                        />
                    </div>
                )}

                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {company.name[lang]}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {company.description[lang]}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                        {company.website_url && (
                            <a
                                href={company.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                            >
                                <GlobeAltIcon className="h-4 w-4" />
                                <span>Website</span>
                            </a>
                        )}
                        {company.email && (
                            <a
                                href={`mailto:${company.email}`}
                                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                            >
                                <span>📧 {company.email}</span>
                            </a>
                        )}
                        {company.phone_number && (
                            <span className="flex items-center space-x-1 text-gray-600">
                                <span>📞 {company.phone_number}</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Detay Bilgileri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <DetailItem label="Fuar ID" value={company.fair_id} lang={lang} />
                    <DetailItem label="Aktivite Alanı" value={company.area_of_activity} lang={lang} />
                    <DetailItem label="Stand Numarası" value={company.stand_number} lang={lang} />
                    <DetailItem label="Sponsorluk Seviyesi" value={company.sponsorship_level} lang={lang} />
                </div>

                <div className="space-y-4">
                    <DetailItem label="Adres" value={company.address} lang={lang} />
                    <DetailItem
                        label="Durum"
                        value={company.is_active ? 'Aktif' : 'Pasif'}
                        className={company.is_active ? 'text-green-600' : 'text-red-600'}
                        lang={lang}
                    />
                    <DetailItem label="Oluşturulma" value={new Date(company.created_at).toLocaleDateString('tr-TR')} lang={lang} />
                    <DetailItem label="Güncellenme" value={new Date(company.updated_at).toLocaleDateString('tr-TR')} lang={lang} />
                </div>
            </div>
        </div>
    );
};

// Şirket Düzenleme Formu
const CompanyEditForm: React.FC<{
    formData: CompanyFormData;
    onFormChange: (field: keyof CompanyFormData, value: string | boolean | { en: string; tr: string }) => void;
}> = ({ formData, onFormChange }) => {
    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sol Kolon - Temel Bilgiler */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Temel Bilgiler
                    </h3>

                    {/* İsim (JSON Format) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Şirket Adı (JSON Format)
                        </label>
                        <textarea
                            value={JSON.stringify(formData.name, null, 2)}
                            onChange={(e) => {
                                try {
                                    const parsed = JSON.parse(e.target.value);
                                    onFormChange('name', parsed);
                                } catch (error) {
                                    console.warn('Invalid JSON for name field:', error);
                                    // JSON geçersizse değişiklik yapma
                                }
                            }}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                            placeholder={`{
  "tr": "Türkçe şirket adı",
  "en": "English company name"
}`}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            JSON formatında tr ve en anahtarları ile girin
                        </p>
                    </div>

                    {/* Açıklama (JSON Format) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Açıklama (JSON Format)
                        </label>
                        <textarea
                            value={JSON.stringify(formData.description, null, 2)}
                            onChange={(e) => {
                                try {
                                    const parsed = JSON.parse(e.target.value);
                                    onFormChange('description', parsed);
                                } catch (error) {
                                    console.warn('Invalid JSON for description field:', error);
                                    // JSON geçersizse değişiklik yapma
                                }
                            }}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                            placeholder={`{
  "tr": "Türkçe açıklama",
  "en": "English description"
}`}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            JSON formatında tr ve en anahtarları ile girin
                        </p>
                    </div>

                    {/* Logo URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Logo URL
                        </label>
                        <input
                            type="url"
                            value={formData.logo_url}
                            onChange={(e) => onFormChange('logo_url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/logo.png"
                        />
                    </div>

                    {/* Website URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website URL
                        </label>
                        <input
                            type="url"
                            value={formData.website_url}
                            onChange={(e) => onFormChange('website_url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com"
                        />
                    </div>
                </div>

                {/* Sağ Kolon - İletişim ve Fuar Bilgileri */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        İletişim ve Fuar Bilgileri
                    </h3>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => onFormChange('email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="info@example.com"
                        />
                    </div>

                    {/* Telefon */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefon
                        </label>
                        <input
                            type="tel"
                            value={formData.phone_number}
                            onChange={(e) => onFormChange('phone_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+90 212 123 45 67"
                        />
                    </div>

                    {/* Adres */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adres
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => onFormChange('address', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Şirket adresini girin"
                        />
                    </div>

                    {/* Aktivite Alanı */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Aktivite Alanı
                        </label>
                        <input
                            type="text"
                            value={formData.area_of_activity}
                            onChange={(e) => onFormChange('area_of_activity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Teknoloji, Sağlık, Eğitim..."
                        />
                    </div>

                    {/* Stand Numarası */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stand Numarası
                        </label>
                        <input
                            type="text"
                            value={formData.stand_number}
                            onChange={(e) => onFormChange('stand_number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="A-15"
                        />
                    </div>

                    {/* Sponsorluk Seviyesi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sponsorluk Seviyesi
                        </label>
                        <select
                            value={formData.sponsorship_level}
                            onChange={(e) => onFormChange('sponsorship_level', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Seçiniz</option>
                            <option value="gold">Altın Sponsor</option>
                            <option value="silver">Gümüş Sponsor</option>
                            <option value="bronze">Bronz Sponsor</option>
                            <option value="regular">Normal Katılımcı</option>
                        </select>
                    </div>

                    {/* Aktif/Pasif Durumu */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => onFormChange('is_active', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                            Aktif Şirket
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Detay Öğesi Bileşeni
const DetailItem: React.FC<{
    label: string;
    value?: string | { en: string; tr: string } | null;
    className?: string;
    lang?: 'tr' | 'en';
}> = ({ label, value, className = "text-gray-900", lang = 'tr' }) => {
    if (!value) return null;

    // Çok dilli veri yapısını kontrol et
    let displayValue: string;
    if (typeof value === 'object' && value !== null && 'en' in value && 'tr' in value) {
        displayValue = value[lang];
    } else {
        displayValue = String(value);
    }

    if (!displayValue) return null;

    return (
        <div>
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className={`mt-1 text-sm ${className}`}>{displayValue}</dd>
        </div>
    );
};

export default View; 