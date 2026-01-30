import { useNavigate, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, LogOut, Menu, X, Shield } from "lucide-react";
import { useState } from "react";

export function AdminNavbar({ user, logout, dbuser }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
        { name: "Manage Users", icon: <Users size={20} />, path: "/admin/users" },
        { name: "Event Requests", icon: <Calendar size={20} />, path: "/admin/requests" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/admin/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <Shield size={24} />
                    </div>
                    <span className="font-bold text-slate-800 tracking-tight">Admin Console</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
        fixed left-0 top-0 h-screen bg-slate-900 text-slate-300 w-72 transition-transform duration-300 z-50
        lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-8 border-b border-slate-800/50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h1 className="text-white font-black text-xl tracking-tight leading-none mb-1">CRUISE</h1>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Admin Panel</span>
                    </div>
                </div>

                <nav className="p-6 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`
                flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 font-semibold text-sm
                ${isActive(item.path)
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'hover:bg-slate-800 hover:text-white'}
              `}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="p-6 bg-slate-800/50 rounded-[2rem] border border-slate-700/50 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                                {dbuser?.name?.[0] || user?.email?.[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate">{dbuser?.name || 'Administrator'}</p>
                                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all duration-200 text-sm font-bold"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}