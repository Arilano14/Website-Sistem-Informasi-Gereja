import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
    user: null,
    loading: true,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in localStorage on mount
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const signIn = async ({ email, password }) => {
        try {
            // Replace this with actual API call to your PHP backend
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Login failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.token && data.user) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
                return true;
            }
            return false;

        } catch (error) {
            console.error("Sign in error:", error);
            throw error;
        }
    };

    const signUp = async ({ name, email, password }) => {
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Signup failed: ${response.status} ${response.statusText}`);
            }

            return true; // Return success but don't auto-login unless API returns token
        } catch (error) {
            console.error("Sign up error:", error);
            throw error;
        }
    };

    const signOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/account/signin";
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
