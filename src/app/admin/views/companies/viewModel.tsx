"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import View from "./view";

export interface Company {
    id: number;
    name: string;
    email?: string;
    address: string;
    fair_id: string;
    logo_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    description: string;
    website_url?: string;
    phone_number?: string;
    area_of_activity?: string;
    sponsorship_level?: string;
    stand_number?: string;
}

export interface CompaniesData {
    companies: Company[];
    isLoading: boolean;
    error: string | null;
    searchTerm: string;
    filterType: 'all' | 'sponsor' | 'exhibitor';
}

const ViewModel = () => {
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<'all' | 'sponsor' | 'exhibitor'>('all');

    // Şirketleri API'den çek
    const fetchCompanies = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    p_lang: 'tr'
                }),
            });

            if (!response.ok) {
                throw new Error('Şirketler yüklenirken bir hata oluştu');
            }

            const result = await response.json();

            if (result.success) {
                setCompanies(result.companies || []);
            } else {
                throw new Error(result.message || 'Şirketler yüklenemedi');
            }

        } catch (err) {
            console.error('Companies fetch error:', err);
            setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    // Filtrelenmiş şirketleri hesapla
    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (company.email && company.email.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesFilter = filterType === 'all' ||
            (filterType === 'sponsor' && company.area_of_activity === 'Sponsor') ||
            (filterType === 'exhibitor' && company.area_of_activity !== 'Sponsor');

        return matchesSearch && matchesFilter;
    });

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
    };

    const handleFilterChange = (type: 'all' | 'sponsor' | 'exhibitor') => {
        setFilterType(type);
    };

    const handleRefresh = () => {
        fetchCompanies();
    };

    const handleCompanyClick = (companyId: number) => {
        // Admin paneli içinde şirket detayları tab'ına yönlendir
        router.push(`/admin?tab=companyDetail&companyId=${companyId}`);
    };

    const data: CompaniesData = {
        companies: filteredCompanies,
        isLoading,
        error,
        searchTerm,
        filterType
    };

    return (
        <View
            data={data}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            onCompanyClick={handleCompanyClick}
        />
    );
};

export default ViewModel; 