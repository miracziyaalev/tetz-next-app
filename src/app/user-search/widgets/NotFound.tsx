import React from "react";

const NotFound: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 flex flex-col items-center justify-center text-white/80">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-300">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Katılımcı Bulunamadı</h3>
            <p className="text-center text-white/70 max-w-md">
                Aradığınız kriterlere uygun bir katılımcı kaydı bulunamadı.
                Lütfen bilgileri kontrol edip tekrar deneyin.
            </p>
            <div className="mt-6 p-3 bg-blue-500/20 text-blue-200 text-sm rounded-md border border-blue-400/30">
                <p>Arama yaparken telefon numarası için ülke kodu ile birlikte giriş yapın. Örneğin: {`"905363603060"`}</p>
            </div>
        </div>
    );
};

export default NotFound; 