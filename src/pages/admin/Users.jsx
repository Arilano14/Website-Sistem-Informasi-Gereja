import { useState, useEffect } from "react";
import { Search, Shield, User, AlertCircle, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function Users() {
    const { data: currentUser, loading: userLoading } = useUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ... (fetchUsers and handleRoleUpdate existing code) ...

    // Fetch Users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const url = searchQuery
                ? "/api/admin/users/search.php"
                : "/api/admin/users/index.php";

            const options = searchQuery ? {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keyword: searchQuery })
            } : { method: "GET" };

            const response = await fetch(url, options);
            const data = await response.json();

            if (data.success) {
                setUsers(data.data);
            } else if (data.error) {
                // If search not found, just clear list or show error
                if (searchQuery) setUsers([]);
                else toast.error(data.error);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            toast.error("Gagal memuat data user");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.role === 'admin') {
            fetchUsers();
        }
    }, [currentUser, searchQuery]);

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            setUpdatingId(userId);
            const response = await fetch("/api/admin/users/update-role.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: newRole })
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message);
                // Update local state without refetching
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                toast.error(result.error || "Gagal mengubah role");
            }
        } catch (err) {
            toast.error("Terjadi kesalahan sistem");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!confirm(`Yakin ingin menghapus user "${userName}"? Tindakan ini tidak bisa dibatalkan.`)) return;

        try {
            const token = localStorage.getItem('token'); // Assuming you store token here
            const response = await fetch(`/api/admin/users/delete.php?id=${userId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success(result.message);
                setUsers(users.filter(u => u.id !== userId));
            } else {
                toast.error(result.error || "Gagal menghapus user");
            }
        } catch (err) {
            console.error(err);
            toast.error("Terjadi kesalahan sistem saat menghapus user");
        }
    };

    if (userLoading || (!currentUser && loading)) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // ... (Access Control Block) ...
    if (currentUser && currentUser.role !== 'admin') {
        return (
            <div className="h-screen overflow-hidden bg-gray-50 dark:bg-[#121212] flex flex-col">
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    <main className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-[#121212]">
                        <div className="text-center max-w-md w-full p-8 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg border border-gray-100 dark:border-[#404040]">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield size={40} className="text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                Akses Ditolak
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Akun Anda bukan admin sehingga tidak memiliki akses ke halaman ini.
                            </p>
                            <a
                                href="/"
                                className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Kembali ke Dashboard
                            </a>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-hidden bg-gray-50 dark:bg-[#121212] flex flex-col transition-colors duration-300">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-[#121212]">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen User</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola hak akses pengguna aplikasi</p>
                        </div>
                        {/* Removed Bulk Delete Button */}
                    </div>

                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm p-4 mb-4 border border-gray-100 dark:border-[#404040]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                className="w-full pl-10 pr-4 py-2 border dark:border-[#404040] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-[#404040]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 dark:bg-[#2A2A2A] border-b border-gray-100 dark:border-[#404040]">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">Nama</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">Aksi</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider text-right">Hapus</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#404040]">
                                    {loading ? (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 italic">Memuat data...</td></tr>
                                    ) : users.length === 0 ? (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 italic">Tidak ada data ditemukan</td></tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className="hover:bg-blue-50/50 dark:hover:bg-[#262626] transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {user.name}
                                                        {user.id === currentUser.id && <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">Anda</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        }`}>
                                                        {user.role === 'admin' ? <Shield size={12} className="mr-1" /> : <User size={12} className="mr-1" />}
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        disabled={updatingId === user.id || user.id === currentUser.id}
                                                        value={user.role}
                                                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                                        className="text-sm border border-gray-200 dark:border-[#404040] rounded-lg px-3 py-1.5 bg-white dark:bg-[#2A2A2A] text-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 outline-none transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-[#333]"
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    {user.id !== currentUser.id && (
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id, user.name)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                            title="Hapus Permanen"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
