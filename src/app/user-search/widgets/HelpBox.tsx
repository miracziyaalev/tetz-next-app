import React from "react";

const HelpBox: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-md p-5 text-sm text-gray-600">
            <p className="font-medium text-[#004b96] mb-2">Yardım</p>
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