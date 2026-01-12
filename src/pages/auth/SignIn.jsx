import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "@/utils/useAuth";
import { useSearchParams } from "react-router-dom";

export default function SignInPage() {
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { signInWithCredentials } = useAuth();

    useEffect(() => {
        const errorParam = searchParams.get("error");
        if (errorParam) {
            const errorMessages = {
                CredentialsSignin: "Password atau Gmail salah",
                AccessDenied: "Anda tidak memiliki akses untuk masuk.",
                Configuration: "Terjadi masalah server. Silakan coba lagi nanti.",
            };
            setError(errorMessages[errorParam] || "Terjadi kesalahan. Silakan coba lagi.");
        }
    }, [searchParams]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!email || !password) {
            setError("Mohon isi semua kolom");
            setLoading(false);
            return;
        }

        try {
            await signInWithCredentials({
                email,
                password,
                callbackUrl: "/",
                redirect: true,
            });
        } catch (err) {
            const errorMessages = {
                CredentialsSignin: "Password atau Gmail salah",
                AccessDenied: "Anda tidak memiliki akses untuk masuk.",
                Configuration: "Terjadi masalah server. Silakan coba lagi nanti.",
            };

            setError(
                errorMessages[err.message] || err.message || "Terjadi kesalahan. Silakan coba lagi.",
            );
            setLoading(false);
        }
    };

    const isFormValid = email && password;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="bg-white rounded-[30px] shadow-xl overflow-hidden max-w-6xl w-full flex flex-col md:flex-row min-h-[650px]">
                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-800">Masuk</h2>
                        <a
                            href="/account/signup"
                            className="text-blue-400 hover:text-blue-500 font-medium"
                        >
                            Daftar
                        </a>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-colors text-gray-700 placeholder-gray-400"
                                placeholder="Nomor Ponsel atau Email"
                            />
                        </div>

                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-colors text-gray-700 placeholder-gray-400 pr-12"
                                placeholder="Kata Sandi"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-gray-500"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 font-bold rounded-lg transition-colors disabled:opacity-70 uppercase tracking-wider ${isFormValid
                                ? "bg-blue-500 hover:bg-blue-600 text-white"
                                : "bg-gray-300 hover:bg-gray-400 text-white"
                                }`}
                        >
                            {loading ? "MEMPROSES..." : "MASUK"}
                        </button>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Lupa kata sandi?</span>
                            <a href="#" className="text-blue-400 hover:text-blue-500 font-medium">
                                Klik disini
                            </a>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-400">
                                    atau masuk dengan
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                className="w-5 h-5 mr-3"
                            />
                            <span className="text-gray-600 font-medium">Google</span>
                        </button>
                    </form>

                    <div className="mt-auto pt-8 text-xs text-gray-400">
                        © 2025 GBKP. All Rights Reserved
                    </div>
                </div>

                {/* Right Side - Image/Info */}
                <div className="hidden md:block w-1/2 relative overflow-hidden">
                    <img
                        src="/images/side-right.png"
                        alt="Gereja GBKP"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
