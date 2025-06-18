import React, { useState, useRef, useEffect } from "react";
import { SearchType, User } from "../viewModel";
import UserCard from "../../../components/UserCard";

interface SearchFormProps {
    searchType: SearchType;
    setSearchType: (type: SearchType) => void;
    qrCode: string;
    setQrCode: (val: string) => void;
    phoneNumber: string;
    email: string;
    setEmail: (val: string) => void;
    fullName: string;
    setFullName: (val: string) => void;
    loading: boolean;
    error: string;
    searched: boolean;
    qrCodeTextareaRef: React.RefObject<HTMLTextAreaElement>;
    handlePhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleRefresh: () => void;
    user: User | null;
    onPrint?: () => void;
    printLoading?: boolean;
    variant?: "dark" | "light";
}

const SearchForm: React.FC<SearchFormProps> = ({
    searchType,
    setSearchType,
    qrCode,
    setQrCode,
    phoneNumber,
    email,
    setEmail,
    fullName,
    setFullName,
    loading,
    error,
    searched,
    qrCodeTextareaRef,
    handlePhoneNumberChange,
    handleSubmit,
    handleRefresh,
    user,
    onPrint,
    printLoading,
    variant = "dark",
}) => {
    const [showHelp, setShowHelp] = useState(false);

    // Her field tipi için ref'ler
    const phoneInputRef = useRef<HTMLInputElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const fullNameInputRef = useRef<HTMLInputElement>(null);

    // searchType değiştiğinde ilgili field'a focus ol
    useEffect(() => {
        const focusTimeout = setTimeout(() => {
            switch (searchType) {
                case "qrCode":
                    qrCodeTextareaRef.current?.focus();
                    break;
                case "phone":
                    phoneInputRef.current?.focus();
                    break;
                case "email":
                    emailInputRef.current?.focus();
                    break;
                case "fullName":
                    fullNameInputRef.current?.focus();
                    break;
            }
        }, 100); // Kısa bir gecikme ile focus

        return () => clearTimeout(focusTimeout);
    }, [searchType, qrCodeTextareaRef]);

    const handleHelpClick = () => {
        setShowHelp(!showHelp);
    };

    // Tema stilleri
    const isDark = variant === "dark";
    const containerClass = isDark
        ? "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/50"
        : "bg-white shadow-lg border border-gray-200";
    const textClass = isDark ? "text-white" : "text-gray-800";
    const textSecondaryClass = isDark ? "text-white/70" : "text-gray-600";
    const inputClass = isDark
        ? "bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-white/40"
        : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500";
    const buttonClass = isDark
        ? "bg-white/10 hover:bg-white/20 text-white/80 border border-white/20"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300";
    const buttonPrimaryClass = isDark
        ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
        : "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600";
    const tabActiveClass = isDark
        ? "bg-white/20 text-white shadow-lg border border-white/30"
        : "bg-blue-100 text-blue-700 shadow-lg border border-blue-200";
    const tabInactiveClass = isDark
        ? "text-white/70 hover:bg-white/10 hover:text-white/90"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    const tabContainerClass = isDark
        ? "bg-white/5 border border-white/10"
        : "bg-gray-100 border border-gray-200";
    const errorClass = isDark
        ? "text-red-200 bg-red-500/20 border border-red-400/30"
        : "text-red-700 bg-red-50 border border-red-200";
    const helpClass = isDark
        ? "bg-gradient-to-br from-white/30 to-white/20 backdrop-blur-md border border-white/30 text-white"
        : "bg-white shadow-xl border border-gray-200 text-gray-800";

    return (
        <div className="flex justify-center w-full pb-8">
            <div
                className={`${containerClass} rounded-3xl shadow-2xl p-6 transition-all duration-700 ease-in-out ${user ? 'w-full' : 'w-[400px]'}`}
            >
                <div className={`flex transition-all duration-700 ease-in-out ${user ? 'gap-8 opacity-100' : 'gap-0 opacity-100'
                    }`}>
                    {/* Sol Kolon - Form */}
                    <div
                        className={`flex flex-col gap-6 transition-all duration-700 ease-in-out ${user ? 'w-[400px] flex-shrink-0' : 'w-full'
                            }`}
                    >
                        {/* Arama Formu */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className={`text-lg font-semibold ${textClass}`}>
                                    Katılımcı Arama
                                </h2>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={handleHelpClick}
                                        className={`flex items-center justify-center w-8 h-8 ${buttonClass} rounded-lg transition-all duration-200`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                    </button>

                                    {/* Help Popup */}
                                    {showHelp && (
                                        <div
                                            className={`absolute z-50 top-full right-0 mt-2 ${helpClass} rounded-xl shadow-2xl p-4 text-sm w-64`}
                                        >
                                            <div className="space-y-2">
                                                <p className={`font-medium ${textClass}`}>Arama Yardımı</p>
                                                <ul className={`space-y-1 text-xs ${textSecondaryClass}`}>
                                                    <li>• <strong>QR Kod:</strong> vCard formatı desteklenir</li>
                                                    <li>• <strong>Telefon:</strong> 905XXXXXXXXX formatını kullanın</li>
                                                    <li>• <strong>İsim:</strong> Büyük/küçük harfe duyarlı değildir</li>
                                                    <li>• <strong>E-posta:</strong> Tam eşleşme gerektirir</li>
                                                </ul>
                                            </div>
                                            <button
                                                onClick={() => setShowHelp(false)}
                                                className={`absolute top-2 right-2 ${textSecondaryClass} hover:opacity-80 transition-colors`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </button>
                                            {/* Üçgen İşaretçi */}
                                            <div
                                                className={`absolute -top-2 right-3 w-4 h-4 ${isDark ? 'bg-gradient-to-br from-white/30 to-white/20 border-l border-t border-white/30' : 'bg-white border-l border-t border-gray-200'} transform rotate-45`}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Arama Türü Seçimi */}
                            <div className={`flex flex-wrap gap-2 ${tabContainerClass} p-1 rounded-lg`}>
                                <button
                                    type="button"
                                    onClick={() => setSearchType("qrCode")}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 ${searchType === "qrCode"
                                        ? tabActiveClass
                                        : tabInactiveClass
                                        }`}
                                >
                                    QR Kod
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchType("phone")}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 ${searchType === "phone"
                                        ? tabActiveClass
                                        : tabInactiveClass
                                        }`}
                                >
                                    Telefon
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchType("email")}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 ${searchType === "email"
                                        ? tabActiveClass
                                        : tabInactiveClass
                                        }`}
                                >
                                    E-posta
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchType("fullName")}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 ${searchType === "fullName"
                                        ? tabActiveClass
                                        : tabInactiveClass
                                        }`}
                                >
                                    İsim
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    {searchType === "qrCode" && (
                                        <div className="relative">
                                            <textarea
                                                ref={qrCodeTextareaRef}
                                                value={qrCode}
                                                onChange={(e) => setQrCode(e.target.value)}
                                                placeholder="QR kod içeriğini buraya yapıştırın (vCard formatı desteklenir)"
                                                className={`w-full ${inputClass} rounded-lg p-3 focus:outline-none transition-all duration-200 resize-none min-h-[200px]`}
                                                required
                                            />
                                        </div>
                                    )}

                                    {searchType === "phone" && (
                                        <div className="relative">
                                            <input
                                                ref={phoneInputRef}
                                                type="tel"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={phoneNumber}
                                                onChange={handlePhoneNumberChange}
                                                placeholder="Telefon Numarası (örn: 905363603060)"
                                                className={`w-full ${inputClass} rounded-lg p-3 focus:outline-none transition-all duration-200`}
                                                required
                                            />
                                        </div>
                                    )}

                                    {searchType === "email" && (
                                        <div className="relative">
                                            <input
                                                ref={emailInputRef}
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="E-posta Adresi"
                                                className={`w-full ${inputClass} rounded-lg p-3 focus:outline-none transition-all duration-200`}
                                                required
                                            />
                                        </div>
                                    )}

                                    {searchType === "fullName" && (
                                        <div className="relative">
                                            <input
                                                ref={fullNameInputRef}
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Ad Soyad"
                                                className={`w-full ${inputClass} rounded-lg p-3 focus:outline-none transition-all duration-200`}
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-stretch gap-2">
                                    {searched && (
                                        <button
                                            type="button"
                                            onClick={handleRefresh}
                                            disabled={loading}
                                            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 ${buttonClass} rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                                <path d="M21 3v5h-5"></path>
                                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                                                <path d="M3 21v-5h5"></path>
                                            </svg>
                                            Yenile
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`flex-1 flex items-center justify-center gap-1.5 px-6 py-2.5 ${buttonPrimaryClass} font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
                                    >
                                        {loading ? (
                                            <span>...</span>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="11" cy="11" r="8"></circle>
                                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                                </svg>
                                                Ara
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {error && (
                                <div className={`p-3 text-sm ${errorClass} rounded-md`}>
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sağ Taraf - Kullanıcı Kartı */}
                    <div
                        className={`transition-all duration-700 ease-in-out ${user
                            ? 'opacity-100 w-full flex-grow flex items-start justify-center'
                            : 'opacity-0 w-0 overflow-hidden'
                            }`}
                        style={{
                            transform: user ? 'translateX(0)' : 'translateX(-20px)',
                            visibility: user ? 'visible' : 'hidden'
                        }}
                    >
                        {user && <UserCard user={user} onPrint={onPrint} printLoading={printLoading} variant={variant} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchForm; 