"use client";
import React from "react";
import Image from "next/image";

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
    printLoading?: boolean;
}

const UserCard = ({ user, onPrint, printLoading = false }: UserCardProps) => {
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

    // Kullanıcı verisi yoksa boş div döndür
    if (!user || typeof user !== 'object') {
        return <div className="p-4 text-center text-gray-500">Kullanıcı bilgileri yüklenemedi.</div>;
    }

    return (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden w-full max-w-sm">
            {/* Üst Kısım - Profil ve Temel Bilgiler */}
            <div className="p-4 flex flex-col items-center text-center">
                {/* Profil Resmi */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-lg mb-3">
                    <Image
                        src={profileImageUrl}
                        alt={user.full_name || "Kullanıcı"}
                        fill
                        className="object-cover"
                        sizes="80px"
                        priority
                    />
                </div>

                {/* İsim ve Sektör */}
                <div className="space-y-1 mb-2">
                    <h2 className="text-lg font-semibold text-white">{user.full_name || "İsimsiz Kullanıcı"}</h2>
                    <span className="inline-block px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-xs">
                        {user.is_in_education_sector ? "Eğitim Sektörü" : "Diğer Sektör"}
                    </span>
                </div>

                {/* Unvan ve Kurum */}
                <div className="space-y-0.5">
                    <p className="text-sm text-white/80">{user.title || "Ünvan Belirtilmemiş"}</p>
                    <p className="text-sm text-white/60">{user.institution || "Kurum Belirtilmemiş"}</p>
                </div>

                {/* Yazdır Butonu */}
                {onPrint && (
                    <button
                        onClick={onPrint}
                        disabled={printLoading}
                        className={`mt-3 flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg transition-all duration-200 border backdrop-blur-sm w-full ${printLoading
                            ? 'bg-white/5 text-white/50 border-white/10 cursor-not-allowed'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                            }`}
                    >
                        {printLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="sr-only">Hazırlanıyor...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                    <rect x="6" y="14" width="12" height="8"></rect>
                                </svg>
                                <span>Yazdır</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Alt Kısım - İletişim Bilgileri */}
            <div className="border-t border-white/10">
                <div className="grid grid-cols-1 divide-y divide-white/10">
                    <div className="flex items-center gap-2 p-2.5 px-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 flex-shrink-0">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span className="text-sm text-white/70 truncate">{user.phone_number || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 px-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 flex-shrink-0">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span className="text-sm text-white/70 truncate">{user.email || "Belirtilmemiş"}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 px-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 flex-shrink-0">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span className="text-sm text-white/70 truncate capitalize">{user.role || "Belirtilmemiş"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard; 