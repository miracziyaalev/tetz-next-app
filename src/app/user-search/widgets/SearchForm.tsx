import React, { useState } from "react";
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
}) => {
    const [showHelp, setShowHelp] = useState(false);

    const handleHelpClick = () => {
        setShowHelp(!showHelp);
    };

    return (
        <div className="flex justify-center w-full pb-8">
            <div
                className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 transition-all duration-700 ease-in-out ${user ? 'w-full' : 'w-[400px]'}`}
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
                                <h2 className="text-lg font-semibold text-white">
                                    Katılımcı Arama
                                </h2>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={handleHelpClick}
                                        className="flex items-center justify-center w-8 h-8 bg-white/10 hover:bg-white/20 text-white/80 rounded-lg transition-all duration-200 border border-white/20"
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
                                            className="absolute z-50 top-full right-0 mt-2 bg-gradient-to-br from-white/30 to-white/20 backdrop-blur-md rounded-xl shadow-2xl border border-white/30 p-4 text-sm text-white w-64"
                                        >
                                            <div className="space-y-2">
                                                <p className="font-medium text-white">Arama Yardımı</p>
                                                <ul className="space-y-1 text-xs text-white">
                                                    <li>• <strong>QR Kod:</strong> vCard formatı desteklenir</li>
                                                    <li>• <strong>Telefon:</strong> 905XXXXXXXXX formatını kullanın</li>
                                                    <li>• <strong>İsim:</strong> Büyük/küçük harfe duyarlı değildir</li>
                                                    <li>• <strong>E-posta:</strong> Tam eşleşme gerektirir</li>
                                                </ul>
                                            </div>
                                            <button
                                                onClick={() => setShowHelp(false)}
                                                className="absolute top-2 right-2 text-white hover:text-white/80 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </button>
                                            {/* Üçgen İşaretçi */}
                                            <div
                                                className="absolute -top-2 right-3 w-4 h-4 bg-gradient-to-br from-white/30 to-white/20 border-l border-t border-white/30 transform rotate-45"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Arama Türü Seçimi */}
                            <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setSearchType("qrCode")}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 ${searchType === "qrCode"
                                        ? "bg-white/20 text-white shadow-lg border border-white/30"
                                        : "text-white/70 hover:bg-white/10 hover:text-white/90"
                                        }`}
                                >
                                    QR Kod
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchType("phone")}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 ${searchType === "phone"
                                        ? "bg-white/20 text-white shadow-lg border border-white/30"
                                        : "text-white/70 hover:bg-white/10 hover:text-white/90"
                                        }`}
                                >
                                    Telefon
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchType("email")}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 ${searchType === "email"
                                        ? "bg-white/20 text-white shadow-lg border border-white/30"
                                        : "text-white/70 hover:bg-white/10 hover:text-white/90"
                                        }`}
                                >
                                    E-posta
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSearchType("fullName")}
                                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-all duration-200 ${searchType === "fullName"
                                        ? "bg-white/20 text-white shadow-lg border border-white/30"
                                        : "text-white/70 hover:bg-white/10 hover:text-white/90"
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
                                                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all duration-200 resize-none min-h-[200px]"
                                                required
                                            />
                                        </div>
                                    )}

                                    {searchType === "phone" && (
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={phoneNumber}
                                                onChange={handlePhoneNumberChange}
                                                placeholder="Telefon Numarası (örn: 905363603060)"
                                                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    )}

                                    {searchType === "email" && (
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="E-posta Adresi"
                                                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all duration-200"
                                                required
                                            />
                                        </div>
                                    )}

                                    {searchType === "fullName" && (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Ad Soyad"
                                                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all duration-200"
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
                                            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white/80 rounded-lg transition-all duration-200 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                                        className="flex-1 flex items-center justify-center gap-1.5 px-6 py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-all duration-200 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                                <div className="p-3 text-sm text-red-200 bg-red-500/20 rounded-md border border-red-400/30">
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
                        {user && <UserCard user={user} onPrint={onPrint} printLoading={printLoading} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchForm; 