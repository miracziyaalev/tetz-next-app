import React from "react";

const HelpBox: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-5 text-sm text-white/80">
            <p className="font-medium text-white mb-2">Yardım</p>
            <ul className="list-disc pl-5 space-y-1">
                <li>vCard formatı desteklenir (BEGIN:VCARD...END:VCARD)</li>
                <li>Telefon numarası aramak için {`"905XXXXXXXXX"`} formatını kullanın</li>
                <li>İsim araması büyük/küçük harfe duyarlı değildir</li>
                <li>E-posta adresi tam eşleşme gerektirir</li>
            </ul>
        </div>
    );
};

export default HelpBox; 