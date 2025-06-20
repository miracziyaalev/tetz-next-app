import React from "react";
import Image from "next/image";
import { Company } from "../viewModel";

interface CompanyCardProps {
    company: Company;
    onCompanyClick?: (companyId: number) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onCompanyClick }) => {
    const getSponsorshipBadge = (level?: string) => {
        if (!level) return null;

        const badgeColors = {
            gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
            silver: "bg-gray-100 text-gray-800 border-gray-200",
            bronze: "bg-orange-100 text-orange-800 border-orange-200"
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColors[level as keyof typeof badgeColors] || badgeColors.silver}`}>
                {level.charAt(0).toUpperCase() + level.slice(1)} Sponsor
            </span>
        );
    };

    const getActivityBadge = (activity?: string) => {
        if (!activity) return null;

        const isSponsor = activity === 'Sponsor';
        const badgeClass = isSponsor
            ? "bg-blue-100 text-blue-800 border-blue-200"
            : "bg-green-100 text-green-800 border-green-200";

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}>
                {isSponsor ? 'Sponsor' : 'Katılımcı'}
            </span>
        );
    };

    const handleCardClick = () => {
        if (onCompanyClick) {
            onCompanyClick(company.id);
        }
    };

    return (
        <div
            className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 ${onCompanyClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
            onClick={handleCardClick}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {company.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {getActivityBadge(company.area_of_activity)}
                            {getSponsorshipBadge(company.sponsorship_level)}
                        </div>
                        {company.stand_number && (
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Stand:</span> {company.stand_number}
                            </div>
                        )}
                    </div>
                    {company.logo_url && (
                        <div className="ml-4">
                            <Image
                                src={company.logo_url}
                                alt={`${company.name} logo`}
                                width={64}
                                height={64}
                                className="object-contain rounded-lg border border-gray-200"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Description */}
                <div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                        {company.description}
                    </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                    {company.email && (
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{company.email}</span>
                        </div>
                    )}

                    {company.phone_number && (
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{company.phone_number}</span>
                        </div>
                    )}

                    {company.website_url && (
                        <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                            </svg>
                            <a
                                href={company.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 truncate"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {company.website_url.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    )}
                </div>

                {/* Address */}
                <div className="text-sm text-gray-600">
                    <div className="flex items-start">
                        <svg className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-2">{company.address}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>ID: {company.id}</span>
                    <span>
                        {new Date(company.created_at).toLocaleDateString('tr-TR')}
                    </span>
                </div>
            </div>

            {/* Click indicator */}
            {onCompanyClick && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default CompanyCard; 