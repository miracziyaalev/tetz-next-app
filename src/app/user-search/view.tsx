import React from "react";
import { User, SearchType } from "./viewModel";
import UserCard from "../../components/UserCard";
import BadgeCard from "../../components/BadgeCard";
import { SearchForm, HelpBox, NotFound, EmptyState } from "./widgets";

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
        <main className="flex min-h-screen flex-col py-4 px-4 md:px-8 bg-[#f5f9ff] text-gray-800">
            {/* Header */}
            <header className="w-full mb-8 flex flex-col items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-[#0066cc]">
                    Türkiye Eğitim Teknolojileri Zirvesi
                </h1>
                <p className="text-md text-gray-600 mb-2">Katılımcı Bilgi Sistemi</p>
                <div className="h-1 w-20 bg-gradient-to-r from-[#0066cc] to-[#004b96]"></div>
            </header>

            <div className="w-full max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sol Taraf - Arama Formu */}
                    <div className="w-full lg:w-1/3">
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
                        />

                        <HelpBox />
                    </div>

                    {/* Sağ Taraf - Kullanıcı Kartı */}
                    <div className="w-full lg:w-2/3">
                        {user ? (
                            <div className="space-y-4">
                                <UserCard user={user} onPrint={handlePrintPDF} printLoading={printLoading} />
                            </div>
                        ) : searched && !loading ? (
                            <NotFound />
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>

                {/* Yazdırılacak Yaka Kartı */}
                <div style={{ display: "none" }}>
                    {user && <BadgeCard ref={badgeRef} user={user} customStyle={{ width: "10cm", height: "15cm" }} />}
                </div>

                {/* Footer */}
                <footer className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2025 TETZ | Türkiye Eğitim Teknolojileri Zirvesi</p>
                    <p className="mt-1">Tüm Hakları Saklıdır.</p>
                </footer>
            </div>
        </main>
    );
};

export default UserSearchView; 