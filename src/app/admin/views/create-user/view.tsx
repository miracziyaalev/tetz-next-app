import React from "react";
import { CreateUserFormData } from "./viewModel";

interface City {
    id: number;
    name: string;
    state_id: number;
}

interface ViewProps {
    formData: CreateUserFormData;
    loading: boolean;
    error: string | null;
    success: boolean;
    stateSearchTerm: string;
    citySearchTerm: string;
    showStateDropdown: boolean;
    showCityDropdown: boolean;
    filteredStates: Array<{ id: number; name: string }>;
    filteredCities: City[];
    availableCities: City[];
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onStateSelect: (stateName: string) => void;
    onCitySelect: (cityName: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClearForm: () => void;
    setStateSearchTerm: (term: string) => void;
    setCitySearchTerm: (term: string) => void;
    setShowStateDropdown: (show: boolean) => void;
    setShowCityDropdown: (show: boolean) => void;
}

const View: React.FC<ViewProps> = ({
    formData,
    loading,
    error,
    success,
    stateSearchTerm,
    citySearchTerm,
    showStateDropdown,
    showCityDropdown,
    filteredStates,
    filteredCities,
    availableCities,
    onInputChange,
    onStateSelect,
    onCitySelect,
    onSubmit,
    onClearForm,
    setStateSearchTerm,
    setCitySearchTerm,
    setShowStateDropdown,
    setShowCityDropdown
}) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Oluştur</h1>
                <p className="text-gray-600 mt-1">Sisteme yeni kullanıcı ekleyin</p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">Başarılı!</h3>
                            <div className="mt-2 text-sm text-green-700">
                                <p>Kullanıcı başarıyla oluşturuldu.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Hata!</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                                Ad Soyad *
                            </label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={onInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ad Soyad"
                            />
                        </div>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Ünvan *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={onInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ünvan"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                E-posta *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={onInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="kullanici@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre *
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={onInputChange}
                                required
                                minLength={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="En az 6 karakter"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                                Kurum *
                            </label>
                            <input
                                type="text"
                                id="institution"
                                name="institution"
                                value={formData.institution}
                                onChange={onInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Kurum adı"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                                Telefon *
                            </label>
                            <input
                                type="tel"
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={onInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="5550000000"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_in_education_sector"
                                name="is_in_education_sector"
                                checked={formData.is_in_education_sector}
                                onChange={onInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_in_education_sector" className="ml-2 block text-sm text-gray-900">
                                Eğitim sektöründe çalışıyor
                            </label>
                        </div>

                        {formData.is_in_education_sector && (
                            <>
                                <div>
                                    <label htmlFor="education_sector_type" className="block text-sm font-medium text-gray-700 mb-2">
                                        Eğitim Sektörü Türü *
                                    </label>
                                    <select
                                        id="education_sector_type"
                                        name="education_sector_type"
                                        value={formData.education_sector_type}
                                        onChange={onInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Seçiniz</option>
                                        <option value="meb">MEB</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label htmlFor="user_state" className="block text-sm font-medium text-gray-700 mb-2">
                                            İl *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="user_state"
                                                name="user_state"
                                                value={formData.user_state}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setStateSearchTerm(value);
                                                    onInputChange(e);
                                                }}
                                                onFocus={() => setShowStateDropdown(true)}
                                                onBlur={() => setTimeout(() => setShowStateDropdown(false), 200)}
                                                placeholder="İl ara veya seçiniz"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>

                                        {showStateDropdown && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {filteredStates.length > 0 ? (
                                                    filteredStates.map((state) => (
                                                        <div
                                                            key={state.id}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                            onClick={() => onStateSelect(state.name)}
                                                        >
                                                            {state.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-sm text-gray-500">
                                                        İl bulunamadı
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="user_province" className="block text-sm font-medium text-gray-700 mb-2">
                                            İlçe *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="user_province"
                                                name="user_province"
                                                value={formData.user_province}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setCitySearchTerm(value);
                                                    onInputChange(e);
                                                }}
                                                onFocus={() => setShowCityDropdown(true)}
                                                onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                                                placeholder={!formData.user_state ? 'Önce il seçiniz' : 'İlçe ara veya seçiniz'}
                                                required
                                                disabled={!formData.user_state || availableCities.length === 0}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>

                                        {showCityDropdown && formData.user_state && availableCities.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {filteredCities.length > 0 ? (
                                                    filteredCities.map((city) => (
                                                        <div
                                                            key={city.id}
                                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                            onClick={() => onCitySelect(city.name)}
                                                        >
                                                            {city.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-sm text-gray-500">
                                                        İlçe bulunamadı
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClearForm}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        >
                            Temizle
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loading ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default View; 