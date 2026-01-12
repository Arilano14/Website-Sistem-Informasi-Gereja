import { useAuthContext } from "@/context/AuthContext";

export default function useUser() {
  const { user, loading } = useAuthContext();

  return {
    data: user,
    loading,
    role: user?.role
  };
}