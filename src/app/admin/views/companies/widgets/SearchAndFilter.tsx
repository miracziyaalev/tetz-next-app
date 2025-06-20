import React from "react";

interface SearchAndFilterProps {
    searchTerm: string;
    filterType: 'all' | 'sponsor' | 'exhibitor';
    onSearchChange: (term: string) => void;
    onFilterChange: (type: 'all' | 'sponsor' | 'exhibitor') => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    searchTerm,
    filterType,
    onSearchChange,
    onFilterChange
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        Şirket Ara
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Şirket adı, açıklama veya e-posta ile ara..."
                        />
                    </div>
                </div>

                {/* Filter */}
                <div className="lg:w-64">
                    <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
                        Filtrele
                    </label>
                    <select
                        id="filter"
                        value={filterType}
                        onChange={(e) => onFilterChange(e.target.value as 'all' | 'sponsor' | 'exhibitor')}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="all">Tüm Şirketler</option>
                        <option value="sponsor">Sponsorlar</option>
                        <option value="exhibitor">Katılımcılar</option>
                    </select>
                </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || filterType !== 'all') && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {searchTerm && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            Arama: &ldquo;{searchTerm}&rdquo;
                            <button
                                onClick={() => onSearchChange('')}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </span>
                    )}
                    {filterType !== 'all' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                            Filtre: {filterType === 'sponsor' ? 'Sponsorlar' : 'Katılımcılar'}
                            <button
                                onClick={() => onFilterChange('all')}
                                className="ml-2 text-green-600 hover:text-green-800"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchAndFilter; 