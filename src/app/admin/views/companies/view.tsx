import React from "react";
import { CompaniesData } from "./viewModel";
import CompanyCard from "./widgets/CompanyCard";
import SearchAndFilter from "./widgets/SearchAndFilter";

interface ViewProps {
    data: CompaniesData;
    onSearchChange: (term: string) => void;
    onFilterChange: (type: 'all' | 'sponsor' | 'exhibitor') => void;
    onRefresh: () => void;
    onCompanyClick?: (companyId: number) => void;
}

const View: React.FC<ViewProps> = ({
    data,
    onSearchChange,
    onFilterChange,
    onRefresh,
    onCompanyClick
}) => {
    const { companies, isLoading, error, searchTerm, filterType } = data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                    <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 className="text-lg font-medium text-red-800">Hata</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
                <button
                    onClick={onRefresh}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Şirketler</h1>
                    <p className="text-gray-600 mt-1">
                        Toplam {companies.length} şirket bulundu
                    </p>
                </div>
                <button
                    onClick={onRefresh}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Yenile
                </button>
            </div>

            {/* Search and Filter */}
            <SearchAndFilter
                searchTerm={searchTerm}
                filterType={filterType}
                onSearchChange={onSearchChange}
                onFilterChange={onFilterChange}
            />

            {/* Companies Grid */}
            {companies.length === 0 ? (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Şirket bulunamadı</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Arama kriterlerinize uygun şirket bulunamadı.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <CompanyCard
                            key={company.id}
                            company={company}
                            onCompanyClick={onCompanyClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default View; 