"use client";
import React from "react";
import Image from "next/image";

interface QRCodeProps {
    qrCodeUrl: string;
}

const QRCode: React.FC<QRCodeProps> = ({ qrCodeUrl }) => {
    return (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-5 rounded-3xl shadow-2xl border border-white/50 transform transition-all duration-300 hover:scale-105">
            {/* Title Section */}
            <div className="text-center mb-4">
                <h3 className="text-white/90 text-xl font-medium mb-2">
                    TETZ Mobil  <br /> Uygulamasını İndirin
                </h3>
                <p className="text-white/70 text-base">
                    QR kodu tarayarak hızlıca <br />  erişin ve kayıt olun
                </p>
            </div>

            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <Image
                    src={qrCodeUrl}
                    alt="QR Code"
                    width={120}
                    height={120}
                    className="relative w-full h-auto"
                />
            </div>
        </div>
    );
};

export default QRCode; 