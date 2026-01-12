import { useAuthContext } from "@/context/AuthContext";

export default function useUser() {
    const { user, loading } = useAuthContext();

    return {
        data: user, // Map context user to 'data' to match existing usage
        loading,
        role: user?.role
    };
}
