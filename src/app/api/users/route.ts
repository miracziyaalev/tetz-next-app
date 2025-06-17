import { NextRequest, NextResponse } from "next/server";

// vCard formatındaki QR kod içeriğini temizleyen fonksiyon
function extractContactFromVCard(qrContent: string): { phone: string; email: string } {
    if (!qrContent) return { phone: "", email: "" };

    let phone = "";
    let email = "";

    console.log("Ham vCard içeriği:", qrContent);

    // vCard formatını kontrol et
    if (qrContent.includes("BEGIN:VCARD")) {
        // vCard'dan telefon numarasını çıkar (TEL ile başlayan kısım)
        const phoneMatch = qrContent.match(/TEL[^:]*:([0-9]+)/i);
        if (phoneMatch) {
            phone = phoneMatch[1].trim();
            console.log("Telefon bulundu:", phone);
        } else {
            console.log("Telefon bulunamadı");
        }

        // vCard'dan email'i çıkar (EMAIL ile başlayan kısım)
        const emailMatch = qrContent.match(/EMAIL[^:]*:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
        if (emailMatch) {
            email = emailMatch[1].trim();
            console.log("Email bulundu:", email);
        } else {
            console.log("Email bulunamadı");
        }
    } else {
        console.log("vCard formatı değil");
    }

    return { phone, email };
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const qrCode = searchParams.get("qrCode");
    const phoneNumber = searchParams.get("phone");
    const email = searchParams.get("email");
    const fullName = searchParams.get("fullName");

    console.log("API isteği alındı - Arama parametreleri:", { qrCode, phoneNumber, email, fullName });

    // En az bir arama kriteri olmalı
    if (!qrCode && !phoneNumber && !email && !fullName) {
        return NextResponse.json(
            {
                success: false,
                message: "En az bir arama kriteri belirtilmelidir (QR kod, telefon, email veya isim)",
            },
            { status: 400 }
        );
    }

    // Sadece bir arama kriteri dolu olabilir
    const filledCriteria = [qrCode, phoneNumber, email, fullName].filter(Boolean);
    if (filledCriteria.length > 1) {
        return NextResponse.json(
            {
                success: false,
                message: "Sadece bir arama kriteri kullanılabilir (QR kod, telefon, email veya isim)",
            },
            { status: 400 }
        );
    }

    try {
        // QR kod içeriğinden telefon ve email çıkar
        const extractedContact = extractContactFromVCard(qrCode || "");

        // Öncelik telefon numarası, yoksa email kullan
        let finalPhone = "";
        let finalEmail = "";
        let searchType = "";
        let fallbackEmail = ""; // Fallback için email'i sakla

        // Önce parametre olarak gelen telefon/email'i kontrol et
        if (phoneNumber) {
            finalPhone = phoneNumber;
            searchType = "parametre telefon";
            // Fallback için email'i sakla
            if (extractedContact.email) fallbackEmail = extractedContact.email;
        } else if (email) {
            finalEmail = email;
            searchType = "parametre email";
        } else if (extractedContact.phone) {
            // QR kod içeriğinden telefon çıkarıldıysa onu kullan
            finalPhone = extractedContact.phone;
            searchType = "QR telefon";
            // Fallback için email'i sakla
            if (extractedContact.email) fallbackEmail = extractedContact.email;
        } else if (extractedContact.email) {
            // QR kod içeriğinden email çıkarıldıysa onu kullan
            finalEmail = extractedContact.email;
            searchType = "QR email";
        }

        console.log("=== ARAMA KRİTERLERİ ===");
        console.log("Arama tipi:", searchType);
        console.log("Kullanılacak telefon:", finalPhone);
        console.log("Kullanılacak email:", finalEmail);
        console.log("Fallback email:", fallbackEmail);
        console.log("QR kod içeriğinden çıkarılan:", extractedContact);
        console.log("Parametreler:", { phoneNumber, email, fullName, qrCode });

        // Hiçbir arama kriteri bulunamadıysa hata döndür
        if (!finalPhone && !finalEmail && !fullName) {
            console.log("Hiçbir arama kriteri bulunamadı!");
            return NextResponse.json(
                {
                    success: false,
                    message: "Geçerli bir arama kriteri bulunamadı (telefon, email veya isim)",
                },
                { status: 400 }
            );
        }

        // Supabase API çağrısı yapan fonksiyon
        async function searchUser(phone: string, email: string) {
            const requestBody = {
                "p_active_qr_code": "",
                "p_phone_number": phone,
                "p_email": email,
                "p_full_name": fullName || "",
                "p_lang": "tr"
            };

            console.log("Supabase'e gönderilecek istek:", JSON.stringify(requestBody, null, 2));

            const response = await fetch("https://yrdzcrunsaahbyalnryr.supabase.co/rest/v1/rpc/find_user_by_criteria", {
                method: "POST",
                headers: {
                    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZHpjcnVuc2FhaGJ5YWxucnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Nzk4MDYsImV4cCI6MjA2MjM1NTgwNn0.0fNVNUZvWkoqYcOr-i0sDRKW0FY_nLI2EczATyYIZ-c",
                    "Content-Type": "application/json",
                    "Prefer": "return=representation"
                },
                body: JSON.stringify(requestBody)
            });

            console.log("Supabase API yanıt durumu:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Supabase API hata yanıtı:", errorText);
                return null;
            }

            const responseText = await response.text();
            console.log("Supabase'den gelen ham yanıt:", responseText);

            try {
                const userData = JSON.parse(responseText);
                console.log("Supabase'den gelen işlenmiş veri:", userData);

                // Kullanıcı bulunamadıysa veya boş veri döndüyse
                if (!userData || (typeof userData === 'object' && Object.keys(userData).length === 0)) {
                    console.log("Kullanıcı bulunamadı veya boş veri döndü");
                    return null;
                }

                // Başarısız yanıt kontrolü - success: false ise
                if (userData.success === false) {
                    console.log("API yanıtı başarısız:", userData.message);
                    return null;
                }

                return userData;
            } catch (error) {
                console.error("JSON parse hatası:", error);
                return null;
            }
        }

        // İlk arama - telefon veya email ile
        let userData = await searchUser(finalPhone, finalEmail);

        // Eğer telefon ile arama yapıldıysa ve kullanıcı bulunamadıysa, email ile de dene
        if (!userData && finalPhone && fallbackEmail) {
            console.log("Telefon ile kullanıcı bulunamadı, email ile deneniyor...");
            userData = await searchUser("", fallbackEmail);
        }

        // Sonuç kontrolü
        if (!userData) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Kullanıcı bulunamadı",
                },
                { status: 404 }
            );
        }

        // Başarılı yanıt
        if (userData.success && userData.user) {
            console.log("API yanıtı başarılı, kullanıcı verisi döndürülüyor");
            return NextResponse.json(userData, { status: 200 });
        } else {
            console.log("Kullanıcı verisi doğrudan döndürülüyor");
            return NextResponse.json(
                {
                    success: true,
                    message: "Kullanıcı bilgileri başarıyla getirildi",
                    user: userData
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("API hatası:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Kullanıcı bilgileri getirilirken bir hata oluştu",
                error: String(error)
            },
            { status: 500 }
        );
    }
} 