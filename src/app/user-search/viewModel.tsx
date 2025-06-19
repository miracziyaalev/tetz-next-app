"use client";

import React, { useState, useRef, useEffect } from "react";
import UserSearchView from "./view";

export interface User {
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

export type SearchType = "qrCode" | "phone" | "email" | "fullName";

const UserSearchViewModel = () => {
    // State yönetimi
    const [searchType, setSearchType] = useState<SearchType>("qrCode");
    const [qrCode, setQrCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [printLoading, setPrintLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const badgeRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
    const qrCodeTextareaRef = useRef<HTMLTextAreaElement>(null) as React.RefObject<HTMLTextAreaElement>;

    // Admin login fonksiyonları
    const handleAdminLogin = () => {
        setShowAdminModal(true);
    };

    const handleCloseAdminModal = () => {
        setShowAdminModal(false);
    };

    // Welcome butonu fonksiyonu
    const handleWelcomeClick = () => {
        window.location.href = '/';
    };

    // Sayfa yüklendiğinde QR kod alanına otomatik focus
    useEffect(() => {
        if (searchType === "qrCode" && qrCodeTextareaRef.current) {
            qrCodeTextareaRef.current.focus();
        }
    }, [searchType]);

    // PDF yazdırma fonksiyonu
    const handlePrintPDF = async () => {
        if (!badgeRef.current) return;
        setPrintLoading(true);
        setError("");
        try {
            // @ts-expect-error: html2pdf.js için tip bulunamadı
            const html2pdf = (await import('html2pdf.js')).default;
            const opt = {
                margin: 0,
                filename: `${user?.full_name}.pdf`,
                image: { type: "jpeg", quality: 1.0 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "cm", format: [11, 15], orientation: "portrait" },
            };
            html2pdf()
                .set(opt)
                .from(badgeRef.current)
                .toPdf()
                .get('pdf')
                // @ts-expect-error: pdf tipi bilinmiyor, html2pdf.js için
                .then(pdf => {
                    const blob = pdf.output('blob');
                    const url = URL.createObjectURL(blob);
                    const printFrame = document.createElement('iframe');
                    printFrame.style.position = 'absolute';
                    printFrame.style.left = '-9999px';
                    printFrame.style.top = '-9999px';
                    printFrame.style.width = '0';
                    printFrame.style.height = '0';
                    printFrame.src = url;
                    document.body.appendChild(printFrame);
                    printFrame.onload = () => {
                        try {
                            printFrame.contentWindow?.print();
                            setTimeout(() => {
                                setPrintLoading(false);
                            }, 1500);
                            const cleanup = () => {
                                setTimeout(() => {
                                    if (document.body.contains(printFrame)) {
                                        document.body.removeChild(printFrame);
                                    }
                                    URL.revokeObjectURL(url);
                                }, 5000);
                            };
                            if (printFrame.contentWindow) {
                                printFrame.contentWindow.onafterprint = cleanup;
                                printFrame.contentWindow.onbeforeprint = () => { };
                            }
                            setTimeout(cleanup, 10000);
                        } catch {
                            setPrintLoading(false);
                            window.open(url, '_blank');
                            setTimeout(() => {
                                if (document.body.contains(printFrame)) {
                                    document.body.removeChild(printFrame);
                                }
                            }, 2000);
                        }
                    };
                    printFrame.onerror = () => {
                        setPrintLoading(false);
                        window.open(url, '_blank');
                        setTimeout(() => {
                            if (document.body.contains(printFrame)) {
                                document.body.removeChild(printFrame);
                            }
                        }, 2000);
                    };
                });
        } catch {
            setPrintLoading(false);
            setError('Yazdırma sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        }
    };

    // Telefon numarası değişikliğini sadece rakam olarak kabul eden fonksiyon
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numbersOnly = e.target.value.replace(/\D/g, '');
        setPhoneNumber(numbersOnly);
    };

    // Form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setUser(null);
        setSearched(true);
        let searchParam = "";
        let searchValue = "";
        if (searchType === "qrCode") {
            searchParam = "qrCode";
            searchValue = qrCode;
        } else if (searchType === "phone") {
            searchParam = "phone";
            searchValue = phoneNumber;
        } else if (searchType === "email") {
            searchParam = "email";
            searchValue = email;
        } else if (searchType === "fullName") {
            searchParam = "fullName";
            searchValue = fullName;
        }
        if (!searchValue.trim()) {
            setError("Lütfen bir arama değeri girin");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`/api/users?${searchParam}=${encodeURIComponent(searchValue)}`);
            const data = await response.json();
            if (data.success === true && data.user) {
                if (typeof data.user === 'object' && Object.keys(data.user).length > 0) {
                    setUser(data.user);
                } else {
                    setError("Kullanıcı bilgileri eksik veya hatalı");
                }
            } else {
                setError(data.message || "Kullanıcı bulunamadı. Lütfen bilgileri kontrol edip tekrar deneyin.");
            }
        } catch {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    // Arama türü değişikliği
    const handleSearchTypeChange = (type: SearchType) => {
        setSearchType(type);
        setError("");
    };

    // Yenile fonksiyonu
    const handleRefresh = () => {
        setQrCode("");
        setPhoneNumber("");
        setEmail("");
        setFullName("");
        setUser(null);
        setError("");
        setSearched(false);
        setLoading(false);
        setPrintLoading(false);
        if (qrCodeTextareaRef.current) {
            qrCodeTextareaRef.current.focus();
        }
    };

    // View'a tüm state ve fonksiyonları props olarak iletiyoruz
    return (
        <UserSearchView
            searchType={searchType}
            setSearchType={handleSearchTypeChange}
            qrCode={qrCode}
            setQrCode={setQrCode}
            phoneNumber={phoneNumber}
            email={email}
            setEmail={setEmail}
            fullName={fullName}
            setFullName={setFullName}
            user={user}
            loading={loading}
            printLoading={printLoading}
            error={error}
            searched={searched}
            badgeRef={badgeRef}
            qrCodeTextareaRef={qrCodeTextareaRef}
            handlePhoneNumberChange={handlePhoneNumberChange}
            handleSubmit={handleSubmit}
            handlePrintPDF={handlePrintPDF}
            handleRefresh={handleRefresh}
            showAdminModal={showAdminModal}
            onAdminLogin={handleAdminLogin}
            onCloseAdminModal={handleCloseAdminModal}
            onWelcomeClick={handleWelcomeClick}
        />
    );
};

export default UserSearchViewModel; 