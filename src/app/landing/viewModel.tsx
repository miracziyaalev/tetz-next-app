"use client";
import React, { useState } from "react";
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
    const [showAdminModal, setShowAdminModal] = useState(false);

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

    const handleAdminLogin = () => {
        console.log("Admin login button clicked!");
        setShowAdminModal(true);
    };

    const handleCloseAdminModal = () => {
        setShowAdminModal(false);
    };

    return (
        <View
            data={data}
            onQRGeneration={handleQRGeneration}
            showAdminModal={showAdminModal}
            onAdminLogin={handleAdminLogin}
            onCloseAdminModal={handleCloseAdminModal}
        />
    );
};

export default ViewModel; 