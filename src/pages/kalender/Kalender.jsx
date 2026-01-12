import { useState, useEffect } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    User,
} from "lucide-react";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    getDay,
} from "date-fns";
import { id as idLocale } from "date-fns/locale";
import useUser from "@/utils/useUser";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function KalenderPage() {
    const { data: user, loading } = useUser();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [birthdays, setBirthdays] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loadingBirthdays, setLoadingBirthdays] = useState(false);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            window.location.href = "/account/signin";
        }
    }, [user, loading]);

    // Fetch birthdays for current month
    useEffect(() => {
        if (!user) return;

        const fetchBirthdays = async () => {
            setLoadingBirthdays(true);
            try {
                const month = currentDate.getMonth() + 1;
                const response = await fetch(`/api/jemaat/birthdays.php?month=${month}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch birthdays");
                }
                const data = await response.json();
                setBirthdays(data.birthdays || []);
            } catch (error) {
                console.error("Error fetching birthdays:", error);
                console.warn("Using MOCK birthday data");
                // Generate some random birthdays for the current month
                const mockBirthdays = [];
                const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

                for (let i = 0; i < 5; i++) {
                    mockBirthdays.push({
                        id: i,
                        nama: `Jemaat Mock ${i + 1}`,
                        tgl_lahir: Math.floor(Math.random() * daysInMonth) + 1,
                        thn_lahir: 1990 + Math.floor(Math.random() * 20),
                        sektor: Math.floor(Math.random() * 4) + 1
                    });
                }
                setBirthdays(mockBirthdays);
            } finally {
                setLoadingBirthdays(false);
            }
        };

        fetchBirthdays();
    }, [currentDate, user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = getDay(monthStart);

    // Create array of empty cells for days before month starts
    const emptyDays = Array(firstDayOfWeek).fill(null);

    const previousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
        );
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
        );
    };

    const getBirthdaysForDate = (date) => {
        const day = date.getDate();
        return birthdays.filter((b) => b.tgl_lahir === day);
    };

    const handleDateClick = (date) => {
        const birthdaysOnDate = getBirthdaysForDate(date);
        if (birthdaysOnDate.length > 0) {
            setSelectedDate(date);
        }
    };

    const selectedDateBirthdays = selectedDate
        ? getBirthdaysForDate(selectedDate)
        : [];

    return (
        <div className="h-screen overflow-hidden bg-gray-50 dark:bg-[#121212]">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex h-[calc(100vh-64px)] relative">
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden dark:bg-black dark:bg-opacity-70"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <div className="flex-1 overflow-auto">
                    <div className="p-6 max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Kalender Ulang Tahun
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Lihat dan kelola ulang tahun jemaat
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Calendar Card */}
                            <div className="lg:col-span-2">
                                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-200 dark:border-[#404040] p-6">
                                    {/* Calendar Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {format(currentDate, "MMMM yyyy", { locale: idLocale })}
                                        </h2>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={previousMonth}
                                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2A2A] text-gray-600 dark:text-gray-400 transition-colors"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentDate(new Date())}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-lg transition-colors"
                                            >
                                                Hari Ini
                                            </button>
                                            <button
                                                onClick={nextMonth}
                                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2A2A] text-gray-600 dark:text-gray-400 transition-colors"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="grid grid-cols-7 gap-2">
                                        {/* Day Headers */}
                                        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(
                                            (day) => (
                                                <div
                                                    key={day}
                                                    className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
                                                >
                                                    {day}
                                                </div>
                                            ),
                                        )}

                                        {/* Empty cells before month starts */}
                                        {emptyDays.map((_, index) => (
                                            <div key={`empty-${index}`} className="aspect-square" />
                                        ))}

                                        {/* Calendar Days */}
                                        {daysInMonth.map((date) => {
                                            const birthdaysOnDate = getBirthdaysForDate(date);
                                            const hasBirthdays = birthdaysOnDate.length > 0;
                                            const isToday = isSameDay(date, new Date());
                                            const isSelected =
                                                selectedDate && isSameDay(date, selectedDate);

                                            return (
                                                <button
                                                    key={date.toString()}
                                                    onClick={() => handleDateClick(date)}
                                                    className={`aspect-square p-2 rounded-lg text-sm font-medium transition-all relative ${isToday
                                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                                        : isSelected
                                                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500"
                                                            : hasBirthdays
                                                                ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2A2A2A]"
                                                        }`}
                                                >
                                                    <span>{format(date, "d")}</span>
                                                    {hasBirthdays && (
                                                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                                                            {birthdaysOnDate.slice(0, 3).map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`w-1 h-1 rounded-full ${isToday
                                                                        ? "bg-white"
                                                                        : "bg-purple-500 dark:bg-purple-400"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {loadingBirthdays && (
                                        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            Memuat data ulang tahun...
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Birthdays List */}
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-200 dark:border-[#404040] p-6">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <CalendarIcon
                                            size={20}
                                            className="text-purple-600 dark:text-purple-400"
                                        />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {selectedDate
                                                ? format(selectedDate, "d MMMM yyyy", {
                                                    locale: idLocale,
                                                })
                                                : "Pilih Tanggal"}
                                        </h3>
                                    </div>

                                    {selectedDate ? (
                                        selectedDateBirthdays.length > 0 ? (
                                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                                {selectedDateBirthdays.map((birthday) => (
                                                    <a
                                                        key={birthday.id}
                                                        href={`/jemaat?id=${birthday.id}`}
                                                        className="block p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-purple-200 dark:border-purple-800/30"
                                                    >
                                                        <div className="flex items-start space-x-3">
                                                            <div className="flex-shrink-0 w-10 h-10 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                                                                <User
                                                                    size={20}
                                                                    className="text-purple-700 dark:text-purple-300"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                                                    {birthday.nama}
                                                                </p>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    Sektor {birthday.sektor}
                                                                </p>
                                                                {birthday.thn_lahir && (
                                                                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                                                        Usia:{" "}
                                                                        {new Date().getFullYear() -
                                                                            birthday.thn_lahir}{" "}
                                                                        tahun
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <CalendarIcon
                                                    size={48}
                                                    className="mx-auto text-gray-300 dark:text-gray-600 mb-3"
                                                />
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    Tidak ada ulang tahun pada tanggal ini
                                                </p>
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-center py-8">
                                            <CalendarIcon
                                                size={48}
                                                className="mx-auto text-gray-300 dark:text-gray-600 mb-3"
                                            />
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Klik tanggal di kalender untuk melihat ulang tahun
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Monthly Summary */}
                                <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800/30 p-6">
                                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-4">
                                        Ringkasan Bulan Ini
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-purple-700 dark:text-purple-300">
                                                Total Ulang Tahun
                                            </span>
                                            <span className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                                                {birthdays.length}
                                            </span>
                                        </div>
                                        <div className="pt-3 border-t border-purple-200 dark:border-purple-800/30">
                                            <p className="text-sm text-purple-600 dark:text-purple-400">
                                                {birthdays.length > 0
                                                    ? `Ada ${birthdays.length} jemaat yang berulang tahun bulan ini`
                                                    : "Tidak ada ulang tahun bulan ini"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
