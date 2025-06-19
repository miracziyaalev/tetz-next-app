"use client";
import React, { useState, useEffect } from "react";
import View from "./view";

interface City {
    id: number;
    name: string;
    state_id: number;
}

interface State {
    id: number;
    name: string;
    name_ar: string;
    country_id: number;
    city: City[];
}

interface ProvinceData {
    id: number;
    name: string;
    name_ar: string;
    emoji: string;
    emojiU: string;
    state: State[];
}

export interface CreateUserFormData {
    email: string;
    password: string;
    full_name: string;
    title: string;
    institution: string;
    phone_number: string;
    is_in_education_sector: boolean;
    education_sector_type: string;
    user_state: string;
    user_province: string;
}

const ViewModel = () => {
    const [formData, setFormData] = useState<CreateUserFormData>({
        email: '',
        password: '',
        full_name: '',
        title: '',
        institution: '',
        phone_number: '',
        is_in_education_sector: false,
        education_sector_type: '',
        user_state: '',
        user_province: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [provinces, setProvinces] = useState<ProvinceData[]>([]);
    const [availableCities, setAvailableCities] = useState<City[]>([]);
    const [stateSearchTerm, setStateSearchTerm] = useState('');
    const [citySearchTerm, setCitySearchTerm] = useState('');
    const [showStateDropdown, setShowStateDropdown] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    // Provinces verilerini yükle
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const response = await fetch('/provinces.json');
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Provinces yüklenirken hata:', error);
            }
        };

        loadProvinces();
    }, []);

    // İl seçildiğinde ilçeleri güncelle
    useEffect(() => {
        if (formData.user_state && provinces.length > 0) {
            const state = provinces[0].state.find(s => s.name === formData.user_state);
            if (state) {
                setAvailableCities(state.city);
            } else {
                setAvailableCities([]);
            }
        } else {
            setAvailableCities([]);
        }
    }, [formData.user_state, provinces]);

    // Filtrelenmiş il listesi
    const filteredStates = provinces.length > 0
        ? provinces[0].state.filter(state =>
            state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())
        )
        : [];

    // Filtrelenmiş ilçe listesi
    const filteredCities = availableCities.filter(city =>
        city.name.toLowerCase().includes(citySearchTerm.toLowerCase())
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        console.log('=== INPUT CHANGE DEBUG ===');
        console.log('Field name:', name);
        console.log('Field value:', value);
        console.log('Field type:', type);
        console.log('Checked:', checked);
        console.log('==========================');

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // İl değiştiğinde ilçe seçimini sıfırla
        if (name === 'user_state') {
            setFormData(prev => ({
                ...prev,
                user_province: ''
            }));
            setCitySearchTerm('');
        }
    };

    const handleStateSelect = (stateName: string) => {
        setFormData(prev => ({
            ...prev,
            user_state: stateName,
            user_province: ''
        }));
        setStateSearchTerm(stateName);
        setShowStateDropdown(false);
        setCitySearchTerm('');
    };

    const handleCitySelect = (cityName: string) => {
        setFormData(prev => ({
            ...prev,
            user_province: cityName
        }));
        setCitySearchTerm(cityName);
        setShowCityDropdown(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Debug: Form verisini detaylı logla
        console.log('=== FORM DEBUG ===');
        console.log('Form gönderilmeden önce veri:', formData);
        console.log('Email:', formData.email);
        console.log('Password:', formData.password ? '[HIDDEN]' : 'undefined');
        console.log('Full Name:', formData.full_name);
        console.log('Title:', formData.title);
        console.log('Institution:', formData.institution);
        console.log('Phone Number:', formData.phone_number);
        console.log('Is in Education Sector:', formData.is_in_education_sector);
        console.log('Education Sector Type:', formData.education_sector_type);
        console.log('User State:', formData.user_state);
        console.log('User Province:', formData.user_province);
        console.log('==================');

        // Form validation
        const requiredFields = ['email', 'password', 'full_name', 'title', 'institution', 'phone_number'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof CreateUserFormData]);

        if (missingFields.length > 0) {
            setError(`Eksik alanlar: ${missingFields.join(', ')}`);
            setLoading(false);
            return;
        }

        // Eğitim sektörü seçiliyse ek validation
        if (formData.is_in_education_sector) {
            if (!formData.education_sector_type) {
                setError('Eğitim sektörü türü seçilmelidir');
                setLoading(false);
                return;
            }
            if (!formData.user_state) {
                setError('İl seçilmelidir');
                setLoading(false);
                return;
            }
            if (!formData.user_province) {
                setError('İlçe seçilmelidir');
                setLoading(false);
                return;
            }
        }

        try {
            // localStorage'dan admin token'ını al
            const adminToken = localStorage.getItem('adminToken');

            if (!adminToken) {
                throw new Error('Admin oturumu bulunamadı. Lütfen tekrar giriş yapın.');
            }

            // API'ye gönderilecek veriyi hazırla
            const requestData = {
                email: formData.email,
                password: formData.password,
                full_name: formData.full_name,
                title: formData.title,
                institution: formData.institution,
                phone_number: formData.phone_number,
                is_in_education_sector: formData.is_in_education_sector,
                education_sector_type: formData.education_sector_type,
                user_state: formData.user_state,
                user_province: formData.user_province
            };

            console.log('=== API REQUEST DEBUG ===');
            console.log('API\'ye gönderilecek veri:', {
                ...requestData,
                password: '[HIDDEN]'
            });
            console.log('========================');

            const response = await fetch('/api/auth/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Kullanıcı oluşturulamadı');
            }

            setSuccess(true);
            setFormData({
                email: '',
                password: '',
                full_name: '',
                title: '',
                institution: '',
                phone_number: '',
                is_in_education_sector: false,
                education_sector_type: '',
                user_state: '',
                user_province: ''
            });
            setAvailableCities([]);
            setStateSearchTerm('');
            setCitySearchTerm('');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleClearForm = () => {
        setFormData({
            email: '',
            password: '',
            full_name: '',
            title: '',
            institution: '',
            phone_number: '',
            is_in_education_sector: false,
            education_sector_type: '',
            user_state: '',
            user_province: ''
        });
        setError(null);
        setSuccess(false);
        setAvailableCities([]);
        setStateSearchTerm('');
        setCitySearchTerm('');
    };

    return (
        <View
            formData={formData}
            loading={loading}
            error={error}
            success={success}
            stateSearchTerm={stateSearchTerm}
            citySearchTerm={citySearchTerm}
            showStateDropdown={showStateDropdown}
            showCityDropdown={showCityDropdown}
            filteredStates={filteredStates}
            filteredCities={filteredCities}
            availableCities={availableCities}
            onInputChange={handleInputChange}
            onStateSelect={handleStateSelect}
            onCitySelect={handleCitySelect}
            onSubmit={handleSubmit}
            onClearForm={handleClearForm}
            setStateSearchTerm={setStateSearchTerm}
            setCitySearchTerm={setCitySearchTerm}
            setShowStateDropdown={setShowStateDropdown}
            setShowCityDropdown={setShowCityDropdown}
        />
    );
};

export default ViewModel; 