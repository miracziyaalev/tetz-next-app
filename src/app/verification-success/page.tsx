"use client";

export default function VerificationSuccess() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--tetz-light)] p-6">
            <div className="tetz-card w-full max-w-md p-8">
                <div className="flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e6f7ff]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-[var(--tetz-accent)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <h1 className="mt-6 text-center text-2xl font-bold text-[var(--tetz-primary)]">
                    Hesabınız Doğrulandı!
                </h1>

                <p className="mt-3 text-center text-gray-600">
                    E-posta adresiniz başarıyla doğrulandı. Artık uygulamayı kullanabilirsiniz.
                </p>

                <div className="mt-6 text-center">
                    <div className="rounded-lg bg-[#e6f7ff] px-4 py-3 text-center text-[var(--tetz-accent)]">
                        <p className="font-medium">Doğrulama işlemi tamamlandı!</p>
                        <p className="mt-1">Lütfen manuel olarak uygulamayı açınız.</p>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Bu sayfayı kapatabilir ve uygulamaya geri dönebilirsiniz.
                </div>
            </div>
        </div>
    );
} 