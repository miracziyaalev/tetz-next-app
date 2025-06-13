"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from 'html-to-image';

interface User {
    id: string;
    created_at: string;
    updated_at: string;
    phone_number: string;
    full_name: string;
    title: string;
    email: string;
    profile_picture_url: string;
    institution: string;
    role: string;
    other_details: null;
    active_qr_code: string;
    is_in_education_sector: boolean;
    education_sector_type: null;
    user_state: null;
    user_province: null;
}

interface UserCardProps {
    user: User;
    onPrint?: () => void;
}

const UserCard = ({ user, onPrint }: UserCardProps) => {
    const [copySuccess, setCopySuccess] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);
    const qrCodeRef = useRef<HTMLDivElement>(null);

    // Debug: Gelen kullanıcı verilerini konsola yazdır
    useEffect(() => {
        console.log("UserCard bileşenine gelen kullanıcı verisi:", user);
    }, [user]);

    // Varsayılan profil resmi URL'si
    const defaultProfileImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

    // Profil resmi URL'si kontrol ediliyor
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const profileImageUrl = user && user.profile_picture_url &&
        user.profile_picture_url.trim() !== "" &&
        isValidUrl(user.profile_picture_url)
        ? user.profile_picture_url
        : defaultProfileImage;

    // QR kod için vCard değerini al
    const getVCardQRValue = () => {
        if (user.active_qr_code && user.active_qr_code.trim() !== "") {
            return user.active_qr_code;
        }

        // Eğer active_qr_code yoksa, kullanıcı bilgilerinden vCard oluştur
        return `BEGIN:VCARD
VERSION:3.0
N:${user.full_name ? user.full_name.split(' ').slice(1).join(' ') : ''};${user.full_name ? user.full_name.split(' ')[0] : ''};;;
FN:${user.full_name || ''}
TITLE:${user.title || ''}
ORG:${user.institution || ''}
TEL;TYPE=CELL:${user.phone_number || ''}
EMAIL;TYPE=INTERNET:${user.email || ''}
END:VCARD`;
    };

    // vCard'ı panoya kopyala
    const copyToClipboard = () => {
        navigator.clipboard.writeText(getVCardQRValue())
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            })
            .catch(err => {
                console.error('Kopyalama başarısız oldu:', err);
            });
    };

    // QR kodunu PNG olarak indirme fonksiyonu
    const downloadQRCode = () => {
        if (!qrCodeRef.current || typeof window === 'undefined') return;

        try {
            // html-to-image kütüphanesini kullanarak QR kodunu PNG'ye dönüştür
            toPng(qrCodeRef.current, { cacheBust: true, quality: 1.0 })
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = `${user.full_name || "kullanici"}_vcard.png`;
                    link.href = dataUrl;
                    link.click();

                    setDownloadSuccess(true);
                    setTimeout(() => setDownloadSuccess(false), 2000);
                })
                .catch((error) => {
                    console.error('QR kod indirme hatası:', error);
                });
        } catch (error) {
            console.error("QR kod indirme hatası:", error);
        }
    };

    // Kullanıcı verisi yoksa boş div döndür
    if (!user || typeof user !== 'object') {
        return <div className="p-4 text-center text-gray-500">Kullanıcı bilgileri yüklenemedi.</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Üst Kısım - Profil Resmi ve Temel Bilgiler */}
            <div className="tetz-header p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <Image
                                src={profileImageUrl}
                                alt={user.full_name || "Kullanıcı"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 80px, 80px"
                                priority
                            />
                        </div>

                        <div className="flex-grow">
                            <h2 className="text-xl font-bold text-white">{user.full_name || "İsimsiz Kullanıcı"}</h2>
                            <p className="text-md text-white opacity-90">{user.title || "Ünvan Belirtilmemiş"}</p>
                            <p className="text-sm text-white opacity-80">{user.institution || "Kurum Belirtilmemiş"}</p>
                        </div>
                    </div>

                    {onPrint && (
                        <button
                            onClick={onPrint}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 backdrop-blur-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                <rect x="6" y="14" width="12" height="8"></rect>
                            </svg>
                            Yazdır
                        </button>
                    )}
                </div>
            </div>

            {/* Alt Kısım - Katılımcı Bilgileri ve QR Kod */}
            <div className="p-4 space-y-4 bg-white text-gray-800">
                {/* Katılımcı Bilgileri - Genişletilmiş */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#f0f7ff] text-sm font-medium text-[#0066cc]">
                            Katılımcı Bilgileri
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                            <span className="text-gray-600">Eğitim Sektöründe:</span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs">
                                {user.is_in_education_sector !== undefined ? (user.is_in_education_sector ? "Evet" : "Hayır") : "Belirtilmemiş"}
                            </span>
                        </span>
                    </div>

                    {/* İletişim Bilgileri */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                        <div className="flex items-center gap-2 p-2 rounded bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0066cc] opacity-80 flex-shrink-0">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span className="text-sm text-gray-700">{user.phone_number || "Belirtilmemiş"}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0066cc] opacity-80 flex-shrink-0">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <span className="text-sm text-gray-700 truncate">{user.email || "Belirtilmemiş"}</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0066cc] opacity-80 flex-shrink-0">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span className="text-sm text-gray-700 capitalize">{user.role || "Belirtilmemiş"}</span>
                        </div>
                    </div>
                </div>

                {/* QR Kod */}
                <div className="border-t border-gray-100 pt-4">
                    <div className="mb-3">
                        <p className="text-sm text-[#0066cc] font-medium">QR Kod (vCard)</p>
                    </div>

                    {/* QR Kod Görüntüleme Alanı */}
                    <div className="flex flex-col md:flex-row gap-5">
                        {/* QR Kod */}
                        <div className="h-full min-h-[215px] bg-white border border-gray-200 rounded shadow-sm flex items-center justify-center p-4 relative">
                            <button
                                onClick={downloadQRCode}
                                className="absolute top-2 right-2 p-1.5 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1 shadow-sm z-10"
                                title="QR Kodu İndir"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                {downloadSuccess && <span className="text-xs text-green-600 ml-1">✓</span>}
                            </button>
                            <div ref={qrCodeRef} className="bg-white">
                                <QRCodeSVG
                                    value={getVCardQRValue()}
                                    size={180}
                                    bgColor={"#ffffff"}
                                    fgColor={"#000000"}
                                    level={"M"}
                                    includeMargin={true}
                                />
                            </div>
                        </div>
                        {/* vCard String */}
                        <div className="flex-1 h-full">
                            <div className="relative bg-gray-50 p-3 rounded border border-gray-200 h-full min-h-[215px] flex flex-col">
                                <button
                                    onClick={copyToClipboard}
                                    className="absolute top-2 right-2 p-1.5 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1 shadow-sm"
                                    title="vCard'ı kopyala"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                    </svg>
                                    {copySuccess && <span className="text-xs text-green-600">Kopyalandı!</span>}
                                </button>
                                <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap mt-3 mb-2 flex-grow overflow-auto">
                                    {getVCardQRValue()}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard; 