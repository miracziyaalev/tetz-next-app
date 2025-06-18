import React from "react";

interface AdminLoginButtonProps {
    onAdminLogin: () => void;
}

const AdminLoginButton: React.FC<AdminLoginButtonProps> = ({ onAdminLogin }) => {
    return (
        <button
            onClick={onAdminLogin}
            className="text-white/70 hover:text-white transition-colors"
        >
            Yönetici
        </button>
    );
};

export default AdminLoginButton; 