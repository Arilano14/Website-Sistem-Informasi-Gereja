import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
    const { signIn, signUp, signOut } = useAuthContext();
    const navigate = useNavigate();

    const signInWithCredentials = async ({ email, password, callbackUrl, redirect }) => {
        try {
            await signIn({ email, password });
            if (redirect) {
                navigate(callbackUrl || "/");
            }
        } catch (error) {
            throw new Error(error.message || "Login failed");
        }
    };

    const signUpWithCredentials = async ({ email, password, name, callbackUrl, redirect }) => {
        try {
            await signUp({ email, password, name });
            if (redirect) {
                navigate("/account/signin"); // Usually redirect to signin after signup
            }
        } catch (error) {
            throw new Error(error.message || "Signup failed");
        }
    };

    return {
        signInWithCredentials,
        signUpWithCredentials,
        signOut
    };
}
