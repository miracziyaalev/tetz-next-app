import React from "react";
import { SearchType } from "../viewModel";

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
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-4">
            <h2 className="text-lg font-semibold mb-4 text-[#004b96]">
                Katılımcı Arama
            </h2>

            {/* Arama Türü Seçimi */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setSearchType("qrCode")}
                    className={`px-3 py-1.5 text-sm rounded-md ${searchType === "qrCode"
                        ? "bg-[#0066cc] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    QR Kod
                </button>
                <button
                    type="button"
                    onClick={() => setSearchType("phone")}
                    className={`px-3 py-1.5 text-sm rounded-md ${searchType === "phone"
                        ? "bg-[#0066cc] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Telefon
                </button>
                <button
                    type="button"
                    onClick={() => setSearchType("email")}
                    className={`px-3 py-1.5 text-sm rounded-md ${searchType === "email"
                        ? "bg-[#0066cc] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    E-posta
                </button>
                <button
                    type="button"
                    onClick={() => setSearchType("fullName")}
                    className={`px-3 py-1.5 text-sm rounded-md ${searchType === "fullName"
                        ? "bg-[#0066cc] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    İsim
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                    {searchType === "qrCode" && (
                        <textarea
                            ref={qrCodeTextareaRef}
                            value={qrCode}
                            onChange={(e) => setQrCode(e.target.value)}
                            placeholder="QR kod içeriğini buraya yapıştırın (vCard formatı desteklenir)"
                            className="tetz-input min-h-[100px] resize-none"
                            required
                        />
                    )}

                    {searchType === "phone" && (
                        <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            placeholder="Telefon Numarası (örn: 905363603060)"
                            className="tetz-input"
                            required
                        />
                    )}

                    {searchType === "email" && (
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-posta Adresi"
                            className="tetz-input"
                            required
                        />
                    )}

                    {searchType === "fullName" && (
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ad Soyad"
                            className="tetz-input"
                            required
                        />
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="tetz-button"
                    >
                        {loading ? "Aranıyor..." : "Katılımcı Ara"}
                    </button>

                    {/* Yenile butonu - sadece arama yapıldıktan sonra görünür */}
                    {searched && (
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                <path d="M21 3v5h-5"></path>
                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                                <path d="M3 21v-5h5"></path>
                            </svg>
                            Yenile
                        </button>
                    )}
                </div>
            </form>

            {error && (
                <div className="p-3 mt-4 text-sm text-red-700 bg-red-50 rounded-md border border-red-100">
                    {error}
                </div>
            )}
        </div>
    );
};

export default SearchForm; 