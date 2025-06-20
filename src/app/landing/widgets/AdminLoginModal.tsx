import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminLoginModalProps {
    onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose }) => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // Modal açılış animasyonu
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // API çağrısı
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username,
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Giriş başarısız');
            }

            if (data.success) {
                // Session bilgilerini localStorage'a kaydet
                localStorage.setItem('adminToken', data.session.access_token);

                // Kullanıcı bilgilerine son giriş zamanını ekle
                const userWithLastLogin = {
                    ...data.user,
                    lastLogin: new Date().toISOString()
                };
                localStorage.setItem('adminUser', JSON.stringify(userWithLastLogin));

                // Admin sayfasına yönlendir
                router.push('/admin');
            } else {
                setError('Giriş başarısız');
            }

        } catch (err: Error | unknown) {
            console.error('Login error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Giriş yapılırken bir hata oluştu';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
    };

    return (
        <div className={`fixed inset-0 z-50 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div className="relative h-full flex items-center justify-center p-4">
                <div className={`w-full max-w-md transition-all duration-500 transform ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
                    {/* Glass Modal */}
                    <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-sm border-b border-white/20 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Yönetici Girişi</h2>
                                    <p className="text-white/70 text-sm">TETZ Yönetim Paneli</p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-lg transition-all duration-200 flex items-center justify-center border border-white/20"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-6 space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-white/90 mb-2">
                                        E-posta
                                    </label>
                                    <input
                                        id="username"
                                        type="email"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 backdrop-blur-sm"
                                        placeholder="admin@tetz.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                                        Şifre
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 backdrop-blur-sm"
                                        placeholder="Şifrenizi girin"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 text-sm text-red-200 bg-red-500/20 rounded-xl border border-red-400/30 backdrop-blur-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-white/30 backdrop-blur-sm"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Giriş Yapılıyor...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Giriş Yap
                                        </>
                                    )}
                                </button>
                            </form>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginModal; 