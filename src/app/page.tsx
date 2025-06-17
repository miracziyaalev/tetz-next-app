"use client";

import React, { useRef, useState, useEffect } from "react";
import UserCard from "../components/UserCard";
import BadgeCard from "../components/BadgeCard";

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

type SearchType = "qrCode" | "phone" | "email" | "fullName";

export default function Home() {
  const [searchType, setSearchType] = useState<SearchType>("qrCode");
  const [qrCode, setQrCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  const qrCodeTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Sayfa yüklendiğinde QR kod alanına otomatik focus
  useEffect(() => {
    if (searchType === "qrCode" && qrCodeTextareaRef.current) {
      qrCodeTextareaRef.current.focus();
    }
  }, [searchType]);

  // QR kod değiştiğinde otomatik arama yap
  useEffect(() => {
    if (searchType === "qrCode" && qrCode.trim()) {
      // QR kod içeriği varsa 1.5 saniye bekleyip otomatik arama yap
      const timeoutId = setTimeout(() => {
        handleAutoSearch();
      }, 500);

      // Cleanup: yeni değişiklik olduğunda önceki timeout'u iptal et
      return () => clearTimeout(timeoutId);
    }
  }, [qrCode, searchType]);

  // Otomatik arama fonksiyonu
  const handleAutoSearch = async () => {
    if (!qrCode.trim() || loading) return;

    setLoading(true);
    setError("");
    setUser(null);
    setSearched(true);

    try {
      console.log(`Otomatik API isteği: /api/users?qrCode=${encodeURIComponent(qrCode)}`);

      const response = await fetch(`/api/users?qrCode=${encodeURIComponent(qrCode)}`);
      const data = await response.json();

      console.log("Otomatik API yanıtı:", data);

      if (data.success === true && data.user) {
        if (typeof data.user === 'object' && Object.keys(data.user).length > 0) {
          console.log("Kullanıcı verisi UserCard'a aktarılıyor:", data.user);
          setUser(data.user);
        } else {
          setError("Kullanıcı bilgileri eksik veya hatalı");
        }
      } else {
        setError(data.message || "Kullanıcı bulunamadı. Lütfen bilgileri kontrol edip tekrar deneyin.");
      }
    } catch (err) {
      console.error("Otomatik API hatası:", err);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPDF = async () => {
    if (!badgeRef.current) return;

    setPrintLoading(true);
    setError("");

    try {
      // @ts-expect-error: html2pdf.js için tip bulunamadı
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 0,
        filename: `${user?.full_name}.pdf`,
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "cm", format: [11, 15], orientation: "portrait" },
      };

      html2pdf()
        .set(opt)
        .from(badgeRef.current)
        .toPdf()
        .get('pdf')
        // @ts-expect-error: pdf tipi bilinmiyor, html2pdf.js için
        .then(pdf => {
          const blob = pdf.output('blob');
          const url = URL.createObjectURL(blob);

          // PDF'i yeni bir iframe'de aç ve doğrudan yazdır
          const printFrame = document.createElement('iframe');
          printFrame.style.position = 'absolute';
          printFrame.style.left = '-9999px';
          printFrame.style.top = '-9999px';
          printFrame.style.width = '0';
          printFrame.style.height = '0';
          printFrame.src = url;

          document.body.appendChild(printFrame);

          printFrame.onload = () => {
            try {
              // iframe yüklendiğinde yazdırma dialogunu aç
              printFrame.contentWindow?.print();

              // Loading'i biraz daha uzun tut (kullanıcının görebilmesi için)
              setTimeout(() => {
                setPrintLoading(false);
              }, 1500); // 1.5 saniye daha bekle

              // Yazdırma işlemi tamamlandıktan sonra iframe'i kaldır
              // Daha uzun süre bekle ve yazdırma olaylarını dinle
              const cleanup = () => {
                setTimeout(() => {
                  if (document.body.contains(printFrame)) {
                    document.body.removeChild(printFrame);
                  }
                  URL.revokeObjectURL(url);
                }, 5000); // 5 saniye bekle
              };

              // Yazdırma işlemi tamamlandığında temizlik yap
              if (printFrame.contentWindow) {
                printFrame.contentWindow.onafterprint = cleanup;
                printFrame.contentWindow.onbeforeprint = () => {
                  console.log('Yazdırma başlıyor...');
                };
              }

              // Fallback: 10 saniye sonra otomatik temizlik
              setTimeout(cleanup, 10000);

            } catch (error) {
              console.error('Yazdırma hatası:', error);
              setPrintLoading(false);
              // Hata durumunda alternatif yöntem
              window.open(url, '_blank');
              setTimeout(() => {
                if (document.body.contains(printFrame)) {
                  document.body.removeChild(printFrame);
                }
              }, 2000);
            }
          };

          // Hata durumunda fallback
          printFrame.onerror = () => {
            console.error('PDF yükleme hatası, alternatif yöntem kullanılıyor');
            setPrintLoading(false);
            window.open(url, '_blank');
            setTimeout(() => {
              if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
              }
            }, 2000);
          };
        });
    } catch (error) {
      console.error('Yazdırma hatası:', error);
      setPrintLoading(false);
      setError('Yazdırma sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  // Telefon numarası değişikliğini sadece rakam olarak kabul eden fonksiyon
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sadece rakam karakterlerini kabul et
    const numbersOnly = e.target.value.replace(/\D/g, '');
    setPhoneNumber(numbersOnly);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUser(null); // Önceki kullanıcı verilerini temizle
    setSearched(true); // Arama yapıldığını işaretle

    // Seçilen arama türüne göre değeri al
    let searchParam = "";
    let searchValue = "";

    if (searchType === "qrCode") {
      searchParam = "qrCode";
      searchValue = qrCode;
    } else if (searchType === "phone") {
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
                  onClick={() => handleSearchTypeChange("qrCode")}
                  className={`px-3 py-1.5 text-sm rounded-md ${searchType === "qrCode"
                    ? "bg-[#0066cc] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  QR Kod
                </button>
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
                  {searchType === "qrCode" && (
                    <textarea
                      ref={qrCodeTextareaRef}
                      value={qrCode}
                      onChange={(e) => setQrCode(e.target.value)}
                      placeholder="QR kod içeriğini buraya yapıştırın (vCard formatı desteklenir)"
                      className="tetz-input min-h-[100px] resize-none"
                      required
                    />
                  )}

                  {searchType === "phone" && (
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
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

                <li>vCard formatı desteklenir (BEGIN:VCARD...END:VCARD)</li>
                <li>Telefon numarası aramak için {`"905XXXXXXXXX"`} formatını kullanın</li>
                <li>İsim araması büyük/küçük harfe duyarlı değildir</li>
                <li>E-posta adresi tam eşleşme gerektirir</li>
              </ul>
            </div>
          </div>

          {/* Sağ Taraf - Kullanıcı Kartı */}
          <div className="w-full lg:w-2/3">
            {user ? (
              <div className="space-y-4">
                <UserCard user={user} onPrint={handlePrintPDF} printLoading={printLoading} />
              </div>
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
}
