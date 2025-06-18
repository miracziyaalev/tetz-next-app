import React from "react";
import Image from "next/image";

interface HeroSectionProps {
    title: string;
    subtitle: string;
    qrCodeUrl: string;
    logoUrl: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    qrCodeUrl,
}) => {
    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Phone Image */}
            <div className="relative w-full">
                <div className="relative w-[280px] mx-auto">
                    <Image
                        src="/phone.webp"
                        alt="TETZ Mobile App Preview"
                        width={280}
                        height={560}
                        className="w-full h-auto"
                        priority
                    />
                </div>
            </div>

            {/* QR Code */}
            <div className="absolute top-1/3 right-0 translate-x-1/2">
                <div className="bg-white p-4 rounded-2xl shadow-2xl">
                    <div className="w-24 h-24 relative">
                        <Image
                            src={qrCodeUrl}
                            alt="QR Code"
                            width={96}
                            height={96}
                            className="w-full h-full"
                        />
                    </div>
                    <p className="text-center text-gray-600 mt-2 font-medium text-sm">
                        QR Kodu Tara
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HeroSection; 