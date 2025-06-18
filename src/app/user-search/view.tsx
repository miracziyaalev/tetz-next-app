import React from "react";
import Image from "next/image";
import { User, SearchType } from "./viewModel";
import BadgeCard from "../../components/BadgeCard";
import { SearchForm } from "./widgets";
import AdminLoginButton from "../landing/widgets/AdminLoginButton";
import AdminLoginModal from "../landing/widgets/AdminLoginModal";
import WelcomeButton from "./widgets/WelcomeButton";

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
    showAdminModal: boolean;
    onAdminLogin: () => void;
    onCloseAdminModal: () => void;
    onWelcomeClick: () => void;
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
    showAdminModal,
    onAdminLogin,
    onCloseAdminModal,
    onWelcomeClick,
}) => {
    return (
        <div className="min-h-screen w-full overflow-hidden relative flex flex-col">
            {/* Background Image */}
            <Image
                src="/yatayy.jpg"
                alt="Background"
                fill
                className="object-cover"
                priority
            />

            {/* Welcome Button - Sol Üst */}
            <div className="absolute top-8 left-8 z-20">
                <WelcomeButton onWelcomeClick={onWelcomeClick} />
            </div>

            {/* Admin Login Button - Sağ Üst */}
            <div className="absolute top-8 right-8 z-20">
                <AdminLoginButton onAdminLogin={onAdminLogin} />
            </div>

            {/* Ana İçerik */}
            <main className="flex-grow flex flex-col pt-8 px-4 md:px-8 relative z-10">
                {/* Header */}
                <header className="w-full mb-8 flex flex-col items-center">
                    <div className="mb-2 w-48 h-auto relative">
                        <Image
                            src="/white-tetz.png"
                            alt="TETZ Logo"
                            width={192}
                            height={96}
                            priority
                        />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-white">
                        Türkiye Eğitim Teknolojileri Zirvesi
                    </h1>
                    <p className="text-md text-white/70 mb-2">Katılımcı Bilgi Sistemi</p>
                    <div className="h-1 w-20 bg-gradient-to-r from-white/50 to-white/30"></div>
                </header>

                <div className="flex items-start justify-center mt-4">
                    <div className="w-full max-w-4xl">
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
                    </div>
                </div>
            </main>

            {/* Yazdırılacak Yaka Kartı */}
            <div style={{ display: "none" }}>
                {user && <BadgeCard ref={badgeRef} user={user} customStyle={{ width: "10cm", height: "15cm" }} />}
            </div>

            {/* Footer */}
            <footer className="relative text-center py-4 text-white/60 text-sm border-t border-white/10 z-10">
                © 2025 TETZ | Türkiye Eğitim Teknolojileri Zirvesi
                <br />
                Tüm Hakları Saklıdır.
            </footer>

            {/* Admin Login Modal */}
            {showAdminModal && (
                <AdminLoginModal onClose={onCloseAdminModal} />
            )}
        </div>
    );
};

export default UserSearchView;