import React from "react";
import { User, SearchType } from "./viewModel";
import BadgeCard from "../../components/BadgeCard";
import { SearchForm } from "./widgets";

interface UserSearchViewProps {
    searchType: SearchType;
    setSearchType: (type: SearchType) => void;
    qrCode: string;
    setQrCode: (val: string) => void;
    phoneNumber: string;
    email: string;
    setEmail: (val: string) => void;
    fullName: string;
    setFullName: (val: string) => void;
    user: User | null;
    loading: boolean;
    printLoading: boolean;
    error: string;
    searched: boolean;
    badgeRef: React.RefObject<HTMLDivElement>;
    qrCodeTextareaRef: React.RefObject<HTMLTextAreaElement>;
    handlePhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    handlePrintPDF: () => void;
    handleRefresh: () => void;
}

const UserSearchView: React.FC<UserSearchViewProps> = ({
    searchType,
    setSearchType,
    qrCode,
    setQrCode,
    phoneNumber,
    email,
    setEmail,
    fullName,
    setFullName,
    user,
    loading,
    printLoading,
    error,
    searched,
    badgeRef,
    qrCodeTextareaRef,
    handlePhoneNumberChange,
    handleSubmit,
    handlePrintPDF,
    handleRefresh,
}) => {
    return (
        <div
            className="min-h-screen w-full overflow-hidden relative"
            style={{ backgroundColor: "#1E184D" }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/4 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-white rounded-full -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <main className="relative flex flex-col py-8 px-4 md:px-8">
                {/* Header */}
                <header className="w-full mb-8 flex flex-col items-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-white">
                        Türkiye Eğitim Teknolojileri Zirvesi
                    </h1>
                    <p className="text-md text-white/70 mb-2">Katılımcı Bilgi Sistemi</p>
                    <div className="h-1 w-20 bg-gradient-to-r from-white/50 to-white/30"></div>
                </header>

                <div className="w-full max-w-4xl mx-auto">
                    <SearchForm
                        searchType={searchType}
                        setSearchType={setSearchType}
                        qrCode={qrCode}
                        setQrCode={setQrCode}
                        phoneNumber={phoneNumber}
                        email={email}
                        setEmail={setEmail}
                        fullName={fullName}
                        setFullName={setFullName}
                        loading={loading}
                        error={error}
                        searched={searched}
                        qrCodeTextareaRef={qrCodeTextareaRef}
                        handlePhoneNumberChange={handlePhoneNumberChange}
                        handleSubmit={handleSubmit}
                        handleRefresh={handleRefresh}
                        user={user}
                        onPrint={handlePrintPDF}
                        printLoading={printLoading}
                    />

                    {/* Yazdırılacak Yaka Kartı */}
                    <div style={{ display: "none" }}>
                        {user && <BadgeCard ref={badgeRef} user={user} customStyle={{ width: "10cm", height: "15cm" }} />}
                    </div>

                    {/* Footer */}
                    <footer className="mt-8 text-center text-sm text-white/50">
                        <p>© 2025 TETZ | Türkiye Eğitim Teknolojileri Zirvesi</p>
                        <p className="mt-1">Tüm Hakları Saklıdır.</p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default UserSearchView;