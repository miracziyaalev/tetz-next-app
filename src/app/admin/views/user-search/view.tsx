import React from "react";
import { User, SearchType } from "./viewModel";
import BadgeCard from "../../../../components/BadgeCard";
import SearchForm from "../../../user-search/widgets/SearchForm";

interface AdminUserSearchViewProps {
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

const AdminUserSearchView: React.FC<AdminUserSearchViewProps> = ({
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
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Arama</h1>
                <p className="text-gray-600 mt-1">Katılımcı bilgilerini arayın ve görüntüleyin</p>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                    variant="light"
                />
            </div>

            {/* Yazdırılacak Yaka Kartı */}
            <div style={{ display: "none" }}>
                {user && <BadgeCard ref={badgeRef} user={user} customStyle={{ width: "10cm", height: "15cm" }} />}
            </div>
        </div>
    );
};

export default AdminUserSearchView; 