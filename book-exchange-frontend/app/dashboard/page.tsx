"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";

import BooksTab from "@/components/books/BooksTab";
import ExchangesTab from "@/components/exchanges/ExchangeTab";
import BrowseTab from "@/components/browse/BrowseBookTab";

import {
  LayoutDashboard,
  BookOpen,
  RefreshCcw,
  Shield,
  LogOut,
  Menu,
  Sun,
  Moon,
  Bell,
  Globe2,
  Inbox,
  Clock,
  Sparkles,
  Send,
  ChevronRight,
  Activity,
  PlusCircle,
} from "lucide-react";

type Book = {
  id: string;
  title: string;
  author: string;
  condition: string;
  owner_id: string;
};

type Exchange = {
  id: string;
  requester_id: string;
  owner_id: string;
  requested_book_id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
};

type User = {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  books: Book[];
};

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // Defaulted to true to match landing page

  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [sentExchanges, setSentExchanges] = useState<Exchange[]>([]);
  const [receivedExchanges, setReceivedExchanges] = useState<Exchange[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/home");
      return;
    }

    api
      .get<User>("/users/me")
      .then(async (res) => {
        const currentUser = res.data;
        setUser(currentUser);

        if (currentUser.role === "ADMIN") {
          const booksRes = await api.get<Book[]>("/books/");
          setAllBooks(booksRes.data);
        }

        const sentRes = await api.get<Exchange[]>("/exchanges/sent");
        const receivedRes = await api.get<Exchange[]>("/exchanges/received");

        setSentExchanges(sentRes.data);
        setReceivedExchanges(receivedRes.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/home");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-white border-t-transparent rounded-full mb-4"
        />
        <p className="text-zinc-400 font-medium">Loading workspace...</p>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";
  const totalBooks = isAdmin ? allBooks.length : user.books.length;
  const totalSent = sentExchanges.length;
  const totalReceived = receivedExchanges.length;
  const pendingCount = receivedExchanges.filter(
    (ex) => ex.status === "PENDING",
  ).length;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "books", label: "My Library", icon: BookOpen },
    { id: "exchanges", label: "Exchanges", icon: RefreshCcw },
    { id: "browse", label: "Browse", icon: Globe2 },
  ];

  if (isAdmin) {
    navItems.push({ id: "admin", label: "Admin Panel", icon: Shield });
  }

  const conditionColors: Record<string, string> = {
    NEW: darkMode
      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      : "bg-emerald-100 text-emerald-700 border border-emerald-200",
    LIKE_NEW: darkMode
      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
      : "bg-blue-100 text-blue-700 border border-blue-200",
    GOOD: darkMode
      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
      : "bg-indigo-100 text-indigo-700 border border-indigo-200",
    FAIR: darkMode
      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
      : "bg-amber-100 text-amber-700 border border-amber-200",
    POOR: darkMode
      ? "bg-red-500/10 text-red-400 border border-red-500/20"
      : "bg-red-100 text-red-700 border border-red-200",
  };

  // Dynamic Theme Classes
  const theme = {
    bg: darkMode ? "bg-zinc-950" : "bg-zinc-100",
    sidebar: darkMode
      ? "bg-zinc-950 border-zinc-800"
      : "bg-white border-zinc-200",
    header: darkMode
      ? "bg-zinc-950/80 border-zinc-800"
      : "bg-white/80 border-zinc-200",
    card: darkMode
      ? "bg-zinc-900 border-zinc-800 shadow-none"
      : "bg-white border-zinc-200 shadow-sm",
    textMain: darkMode ? "text-white" : "text-zinc-900",
    textMuted: darkMode ? "text-zinc-400" : "text-zinc-500",
    hover: darkMode ? "hover:bg-zinc-800" : "hover:bg-zinc-100",
    navActive: darkMode
      ? "bg-orange-500 text-white shadow-lg shadow-yellow-500/20"
      : "bg-orange-600 text-white shadow-md shadow-red-500/20",
    navInactive: darkMode
      ? "text-zinc-400 hover:bg-zinc-900 hover:text-white"
      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
  };

  return (
    <div
      className={`min-h-screen flex font-sans transition-colors duration-300 ${theme.bg} ${theme.textMain}`}
    >
      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`h-screen border-r flex flex-col p-4 sticky top-0 z-20 overflow-hidden shrink-0 ${theme.sidebar}`}
      >
        {/* TOP / LOGO */}
        <div className="flex items-center justify-between mb-8 h-10 px-2">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Link
                  href="/home"
                  className="font-bold text-xl tracking-tight hover:text-orange-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg font-bold text-xl">
                      B
                    </div>
                    <span className={`text-xl font-bold tracking-tight text-white transition-colors ${theme.textMain} `}
                    >
                      Swappy
                    </span>
                  </div>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="short"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto"
              >
                <Link
                  href="/home"
                  className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg font-bold text-xl"
                >
                  B
                </Link>
              </motion.div>
            )}
          </AnimatePresence>



          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-1.5 rounded-lg transition-colors ${theme.hover}`}
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className={`mx-auto mb-8 p-2 rounded-lg transition-colors ${theme.hover}`}
          >
            <Menu size={20} />
          </button>
        )}

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full whitespace-nowrap ${isActive ? theme.navActive : theme.navInactive}`}
              >
                <Icon size={20} className="shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>

        {/* BOTTOM ACTIONS */}
        <div
          className={`space-y-1.5 pt-4 border-t mt-auto ${darkMode ? "border-zinc-800" : "border-zinc-200"}`}
        >
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full whitespace-nowrap ${theme.navInactive}`}
          >
            {darkMode ? (
              <Sun size={20} className="shrink-0" />
            ) : (
              <Moon size={20} className="shrink-0" />
            )}
            {sidebarOpen && (
              <span className="text-sm font-medium">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full whitespace-nowrap ${darkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"}`}
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header
          className={`h-16 backdrop-blur-md border-b flex justify-between items-center px-8 sticky top-0 z-10 transition-colors duration-300 ${theme.header}`}
        >
          <h2 className="text-lg font-semibold capitalize tracking-tight flex items-center gap-2">
            {navItems.find((i) => i.id === activeTab)?.label}
          </h2>

          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-full relative ${theme.hover}`}>
              <Bell size={18} className={theme.textMuted} />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-zinc-950" />
              )}
            </button>
            <div
              className={`h-6 w-px ${darkMode ? "bg-zinc-800" : "bg-zinc-200"}`}
            />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">
                  {user.username}
                </p>
                <p className={`text-xs mt-1 ${theme.textMuted}`}>{user.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === "dashboard" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* WELCOME BANNER */}
                <div
                  className={`relative overflow-hidden rounded-2xl p-8 border ${darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-sm"}`}
                >
                  {/* Decorative background shape */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 mb-2">
                        Welcome back, {user.username}{" "}
                        <Sparkles className="text-orange-500" size={24} />
                      </h1>
                      <p className={theme.textMuted}>
                        You have{" "}
                        <strong className={theme.textMain}>
                          {pendingCount} pending requests
                        </strong>{" "}
                        waiting for your review today.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("exchanges")}
                      className="shrink-0 bg-amber-500/10 text-amber-300 border border-amber-600/20 hover:bg-orange-600 px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      Review Requests <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* STATS BENTO */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      title: "My Library",
                      value: totalBooks,
                      icon: BookOpen,
                      color: "text-blue-500",
                      bg: "bg-blue-500/10",
                    },
                    {
                      title: "Received Requests",
                      value: totalReceived,
                      icon: Inbox,
                      color: "text-emerald-500",
                      bg: "bg-emerald-500/10",
                    },
                    {
                      title: "Sent Requests",
                      value: totalSent,
                      icon: Send,
                      color: "text-purple-500",
                      bg: "bg-purple-500/10",
                    },
                    {
                      title: "Pending Actions",
                      value: pendingCount,
                      icon: Clock,
                      color: "text-amber-500",
                      bg: "bg-amber-500/10",
                    },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-6 rounded-2xl border flex flex-col justify-between h-32 ${theme.card}`}
                      >
                        <div className="flex justify-between items-start">
                          <p
                            className={`text-sm font-medium ${theme.textMuted}`}
                          >
                            {stat.title}
                          </p>
                          <div className={`p-2 rounded-lg ${stat.bg}`}>
                            <Icon size={18} className={stat.color} />
                          </div>
                        </div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column (Quick Actions & Recent Books) */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* QUICK ACTIONS */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity size={18} /> Quick Actions
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setActiveTab("books")}
                          className={`text-left p-5 rounded-2xl border group transition-all ${theme.card} ${theme.hover}`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`p-2 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors`}
                            >
                              <PlusCircle size={20} />
                            </div>
                            <h4 className="font-semibold">Add New Book</h4>
                          </div>
                          <p className={`text-sm ${theme.textMuted}`}>
                            Upload a new book to your public library.
                          </p>
                        </button>

                        <button
                          onClick={() => setActiveTab("browse")}
                          className={`text-left p-5 rounded-2xl border group transition-all ${theme.card} ${theme.hover}`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors`}
                            >
                              <Globe2 size={20} />
                            </div>
                            <h4 className="font-semibold">Discover Books</h4>
                          </div>
                          <p className={`text-sm ${theme.textMuted}`}>
                            Find your next read from the community.
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* RECENT BOOKS */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          Recently Added
                        </h3>
                        <button
                          onClick={() => setActiveTab("books")}
                          className={`text-sm hover:underline ${theme.textMuted}`}
                        >
                          View all
                        </button>
                      </div>

                      {/* Empty State vs List */}
                      {totalBooks === 0 ? (
                        <div
                          className={`p-8 text-center rounded-2xl border border-dashed ${theme.card}`}
                        >
                          <BookOpen
                            className={`mx-auto mb-3 opacity-20 ${theme.textMain}`}
                            size={32}
                          />
                          <p className={theme.textMuted}>
                            Your library is empty. Add some books to get
                            started.
                          </p>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                          {(isAdmin ? allBooks : user.books)
                            .slice(0, 4)
                            .map((book) => (
                              <div
                                key={book.id}
                                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${theme.card}`}
                              >
                                <div>
                                  <h4
                                    className="font-semibold line-clamp-1"
                                    title={book.title}
                                  >
                                    {book.title}
                                  </h4>
                                  <p
                                    className={`text-sm ${theme.textMuted} line-clamp-1`}
                                  >
                                    {book.author}
                                  </p>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span
                                    className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md tracking-wider ${conditionColors[book.condition]}`}
                                  >
                                    {book.condition.replace("_", " ")}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column (Activity Feed) */}
                  <div className="lg:col-span-1">
                    <div
                      className={`rounded-2xl border p-6 h-full ${theme.card}`}
                    >
                      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Clock size={18} /> Recent Activity
                      </h3>

                      <div
                        className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 
                        before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 
                        before:bg-linear-to-b before:from-zinc-200 before:via-zinc-200 
                        before:to-transparent dark:before:from-zinc-800 dark:before:via-zinc-800"
                      >
                        {/* We combine sent/received just to show a mock feed. Adjust logic as needed. */}
                        {[...receivedExchanges, ...sentExchanges].slice(0, 5)
                          .length === 0 && (
                          <p className={`text-sm ${theme.textMuted}`}>
                            No recent activity.
                          </p>
                        )}

                        {receivedExchanges.slice(0, 3).map((ex) => (
                          <div
                            key={ex.id}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                          >
                            <div
                              className={`flex items-center justify-center w-5 h-5 rounded-full border-2 bg-zinc-50 dark:bg-zinc-950 border-emerald-500 z-10 shrink-0`}
                            ></div>
                            <div className="w-[calc(100%-2.5rem)] ml-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  Request received
                                </span>
                                <span className={`text-xs ${theme.textMuted}`}>
                                  Status: {ex.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {sentExchanges.slice(0, 3).map((ex) => (
                          <div
                            key={ex.id}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                          >
                            <div
                              className={`flex items-center justify-center w-5 h-5 rounded-full border-2 bg-zinc-50 dark:bg-zinc-950 border-indigo-500 z-10 shrink-0`}
                            ></div>
                            <div className="w-[calc(100%-2.5rem)] ml-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  Request sent
                                </span>
                                <span className={`text-xs ${theme.textMuted}`}>
                                  Status: {ex.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "books" && (
              <BooksTab userId={user.id} role={user.role} />
            )}
            {activeTab === "exchanges" && <ExchangesTab />}
            {activeTab === "browse" && <BrowseTab userId={user.id} />}

            {activeTab === "admin" && isAdmin && (
              <div
                className={`p-8 rounded-2xl border text-center ${theme.card}`}
              >
                <Shield
                  className={`mx-auto mb-4 opacity-50 ${theme.textMuted}`}
                  size={48}
                />
                <h3 className="text-xl font-semibold mb-2">Admin Controls</h3>
                <p className={theme.textMuted}>
                  System management and analytics coming soon.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
