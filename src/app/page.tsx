"use client";

import { useState } from "react";
import UserCard from "../components/UserCard";

interface User {
  id: string;
  created_at: string;
  updated_at: string;
  phone_number: string;
  full_name: string;
  title: string;
  email: string;
  profile_picture_url: string;
  institution: string;
  role: string;
  other_details: null;
  active_qr_code: string;
  is_in_education_sector: boolean;
  education_sector_type: null;
  user_state: null;
  user_province: null;
}

type SearchType = "phone" | "email" | "fullName";

export default function Home() {
  const [searchType, setSearchType] = useState<SearchType>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUser(null); // Önceki kullanıcı verilerini temizle
    setSearched(true); // Arama yapıldığını işaretle

    // Seçilen arama türüne göre değeri al
    let searchParam = "";
    let searchValue = "";

    if (searchType === "phone") {
      searchParam = "phone";
      searchValue = phoneNumber;
    } else if (searchType === "email") {
      searchParam = "email";
      searchValue = email;
    } else if (searchType === "fullName") {
      searchParam = "fullName";
      searchValue = fullName;
    }

    // Arama değeri boş ise hata göster
    if (!searchValue.trim()) {
      setError("Lütfen bir arama değeri girin");
      setLoading(false);
      return;
    }

    try {
      console.log(`API isteği: /api/users?${searchParam}=${encodeURIComponent(searchValue)}`);

      // API çağrısı yapıyoruz
      const response = await fetch(`/api/users?${searchParam}=${encodeURIComponent(searchValue)}`);
      const data = await response.json();

      console.log("API yanıtı:", data);

      // API yanıtını kontrol ediyoruz
      if (data.success === true && data.user) {
        // Kullanıcı verilerini kontrol et
        if (typeof data.user === 'object' && Object.keys(data.user).length > 0) {
          console.log("Kullanıcı verisi UserCard'a aktarılıyor:", data.user);
          setUser(data.user);
        } else {
          setError("Kullanıcı bilgileri eksik veya hatalı");
        }
      } else {
        // Başarısız durum - kullanıcı bulunamadı
        setError(data.message || "Kullanıcı bulunamadı. Lütfen bilgileri kontrol edip tekrar deneyin.");
      }
    } catch (err) {
      console.error("API hatası:", err);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type);
    setError("");
  };

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
            <div className="bg-white rounded-xl shadow-md p-6 mb-4">
              <h2 className="text-lg font-semibold mb-4 text-[#004b96]">
                Katılımcı Arama
              </h2>

              {/* Arama Türü Seçimi */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => handleSearchTypeChange("phone")}
                  className={`px-3 py-1.5 text-sm rounded-md ${searchType === "phone"
                    ? "bg-[#0066cc] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Telefon
                </button>
                <button
                  type="button"
                  onClick={() => handleSearchTypeChange("email")}
                  className={`px-3 py-1.5 text-sm rounded-md ${searchType === "email"
                    ? "bg-[#0066cc] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  E-posta
                </button>
                <button
                  type="button"
                  onClick={() => handleSearchTypeChange("fullName")}
                  className={`px-3 py-1.5 text-sm rounded-md ${searchType === "fullName"
                    ? "bg-[#0066cc] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  İsim
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                  {searchType === "phone" && (
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Telefon Numarası (örn: 905363603060)"
                      className="tetz-input"
                      required
                    />
                  )}

                  {searchType === "email" && (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-posta Adresi"
                      className="tetz-input"
                      required
                    />
                  )}

                  {searchType === "fullName" && (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ad Soyad"
                      className="tetz-input"
                      required
                    />
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="tetz-button"
                  >
                    {loading ? "Aranıyor..." : "Katılımcı Ara"}
                  </button>
                </div>
              </form>

              {error && (
                <div className="p-3 mt-4 text-sm text-red-700 bg-red-50 rounded-md border border-red-100">
                  {error}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-5 text-sm text-gray-600">
              <p className="font-medium text-[#004b96] mb-2">Yardım</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Telefon numarası aramak için {`"905XXXXXXXXX"`} formatını kullanın</li>
                <li>İsim araması büyük/küçük harfe duyarlı değildir</li>
                <li>E-posta adresi tam eşleşme gerektirir</li>
              </ul>
            </div>
          </div>

          {/* Sağ Taraf - Kullanıcı Kartı */}
          <div className="w-full lg:w-2/3">
            {user ? (
              <UserCard user={user} />
            ) : searched && !loading ? (
              <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center text-gray-500">
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-red-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Katılımcı Bulunamadı</h3>
                <p className="text-center text-gray-500 max-w-md">
                  Aradığınız kriterlere uygun bir katılımcı kaydı bulunamadı.
                  Lütfen bilgileri kontrol edip tekrar deneyin.
                </p>
                <div className="mt-6 p-3 bg-blue-50 text-blue-700 text-sm rounded-md">
                  <p>Arama yaparken telefon numarası için ülke kodu ile birlikte giriş yapın. Örneğin: {`"905363603060"`}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center text-gray-500 h-64">
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <circle cx="12" cy="8" r="5"></circle>
                    <path d="M20 21a8 8 0 1 0-16 0"></path>
                  </svg>
                </div>
                <p className="text-center">Katılımcı bilgilerini görüntülemek için arama yapın</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 TETZ | Türkiye Eğitim Teknolojileri Zirvesi</p>
          <p className="mt-1">Tüm Hakları Saklıdır.</p>
        </footer>
      </div>
    </main>
  );
}
