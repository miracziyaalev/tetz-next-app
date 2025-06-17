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
        const phoneMatch = qrContent.match(/TEL[^:]*:([^A-Z\r\n]+)/i);
        if (phoneMatch) {
            phone = phoneMatch[1].trim();
            console.log("Telefon bulundu:", phone);
        } else {
            console.log("Telefon bulunamadı");
        }

        // vCard'dan email'i çıkar (EMAIL ile başlayan kısım)
        const emailMatch = qrContent.match(/EMAIL[^:]*:([^A-Z\r\n]+)/i);
        if (emailMatch) {
            email = emailMatch[1].trim();
            console.log("Email bulundu:", email);
        } else {
            console.log("Email bulunamadı");
        }

        // Debug için tüm eşleşmeleri göster
        console.log("Tüm EMAIL eşleşmeleri:", qrContent.match(/EMAIL[^:]*:([^A-Z\r\n]+)/gi));
    } else {
        console.log("vCard formatı değil");
    }

    return { phone, email };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { qrContent } = body;

        const result = extractContactFromVCard(qrContent);

        return NextResponse.json({
            success: true,
            result,
            originalContent: qrContent
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
} 