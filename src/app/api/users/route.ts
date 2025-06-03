import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const phoneNumber = searchParams.get("phone");
    const email = searchParams.get("email");
    const fullName = searchParams.get("fullName");

    console.log("API isteği alındı - Arama parametreleri:", { phoneNumber, email, fullName });

    // En az bir arama kriteri olmalı
    if (!phoneNumber && !email && !fullName) {
        return NextResponse.json(
            {
                success: false,
                message: "En az bir arama kriteri belirtilmelidir (telefon, email veya isim)",
            },
            { status: 400 }
        );
    }

    // Sadece bir arama kriteri dolu olabilir
    if ((phoneNumber && email) || (phoneNumber && fullName) || (email && fullName)) {
        return NextResponse.json(
            {
                success: false,
                message: "Sadece bir arama kriteri kullanılabilir (telefon, email veya isim)",
            },
            { status: 400 }
        );
    }

    try {
        const requestBody = {
            "p_phone_number": phoneNumber || "",
            "p_email": email || "",
            "p_full_name": fullName || "",
            "p_lang": "tr"
        };

        console.log("Supabase'e gönderilecek istek:", JSON.stringify(requestBody, null, 2));

        // Supabase API çağrısı yapılıyor
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

        // Yanıt başlıklarını logla
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });
        console.log("Yanıt başlıkları:", headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Supabase API hata yanıtı:", errorText);

            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { error: errorText };
            }

            return NextResponse.json(
                {
                    success: false,
                    message: "Kullanıcı bilgileri alınırken bir hata oluştu",
                    error: errorData
                },
                { status: response.status }
            );
        }

        const responseText = await response.text();
        console.log("Supabase'den gelen ham yanıt:", responseText);

        let userData;
        try {
            userData = JSON.parse(responseText);
            console.log("Supabase'den gelen işlenmiş veri:", userData);
        } catch (error) {
            console.error("JSON parse hatası:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: "API yanıtı işlenirken bir hata oluştu",
                    error: String(error)
                },
                { status: 500 }
            );
        }

        // Kullanıcı bulunamadıysa veya boş veri döndüyse
        if (!userData || (typeof userData === 'object' && Object.keys(userData).length === 0)) {
            console.log("Kullanıcı bulunamadı veya boş veri döndü");
            return NextResponse.json(
                {
                    success: false,
                    message: "Kullanıcı bulunamadı",
                },
                { status: 404 }
            );
        }

        // Başarısız yanıt kontrolü - success: false ise
        if (userData.success === false) {
            console.log("API yanıtı başarısız:", userData.message);
            return NextResponse.json(
                {
                    success: false,
                    message: userData.message || "Kullanıcı bulunamadı",
                },
                { status: 404 }
            );
        }

        // API yanıtının yapısını kontrol et
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