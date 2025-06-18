"use client";
import React from "react";
import { useRouter } from "next/navigation";
import View from "@/app/landing/view";

export interface LandingData {
    title: string;
    subtitle: string;
    date: string;
    location: string;
    qrCodeUrl: string;
    logoUrl: string;
    backgroundColor: string;
}

const ViewModel = () => {
    const router = useRouter();

    const data: LandingData = {
        title: "Geleceğe Hoşgeldiniz!",
        subtitle: "Türkiye Eğitim Teknolojileri Zirvesi",
        date: "20-22 Haziran, 2025",
        location: "Pullman Convention Center İstanbul / TÜRKİYE",
        qrCodeUrl: "/qr.png",
        logoUrl: "/white-tetz.png",
        backgroundColor: "#1E184D"
    };

    const handleQRGeneration = () => {
        router.push("/user-search");
    };

    return (
        <View
            data={data}
            isLoading={false}
            onQRGeneration={handleQRGeneration}
        />
    );
};

export default ViewModel; 