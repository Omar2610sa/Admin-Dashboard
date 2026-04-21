import { useState } from "react";
import {
    Home,
    BarChart3,
    Users,
    Box,
    Settings,
    ChevronDown,
    Bell
} from "lucide-react";
import { useTranslation } from "react-i18next";



// Language 

// Images imports
import logo from "../../../assets/logo-white.png";

const Sidebar = ({ collapsed, onToggle, currentPage, onPageChange }) => {
    const { t } = useTranslation();

    const [openMenu, setOpenMenu] = useState(null);


    const sidebarData = [
        {
            id: "dashboard",
            icon: Home,
            label: "Dashboard",
        },
        {
            id: "analytics",
            icon: BarChart3,
            label: "Analytics",
        },
        {
            id: "users",
            icon: Users,
            label: "Users",
            count: "2k",
            submenu: [
                { id: "all-users", label: "All Users" },
                { id: "roles", label: "Roles & Permissions" },
                { id: "activity", label: "User Activity" },
            ],
        },
        {
            id: "sections",
            icon: Box,
            label: "Sections",
            count: "11",
            submenu: [
                { id: "all-sections", label: "All Sections" },
                { id: "categories", label: "Categories" },
                { id: "inventory", label: "Inventory" },
            ],
        },
        {
            id: "notifications",
            icon: Bell,
            label: "Notifications",
        },
        {
            id: "settings",
            icon: Settings,
            label: "Settings",
            submenu: [
                { id: "general", label: "General" },
                { id: "security", label: "Security" },
                { id: "notifications-settings", label: "Notifications" },
            ],
        },
    ];

    return (
        <div className={`${collapsed ? "w-20" : "w-64"} transition duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10`}>

            {/* Logo */}
            <div className='p-6 border-b border-slate-200/50 dark:border-slate-700/50'>
                <div className='flex items-center space-x-3'>
                    <div className='w-36 h-8  rounded-xl flex items-center justify-center shadow-lg'>
                        <img src={logo} alt="logo" />
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className='flex-1 p-4 space-y-2 overflow-y-auto'>
                {sidebarData.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div key={item.id}>
                            <button
                                onClick={() => {
                                    if (item.submenu) {
                                        setOpenMenu(openMenu === item.id ? null : item.id);
                                    } else {
                                        onPageChange(item.id);
                                    }
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${currentPage === item.id
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className="w-5 h-5" />

                                    {!collapsed && (
                                        <>
                                            <span className="font-medium ml-2 text-slate-800 dark:text-white truncate">
                                                {t(`sidebar_${item.id}`)}
                                            </span>

                                            {item.count && (
                                                <span className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                                                    {item.count}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>

                                {item.submenu && !collapsed && (
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${openMenu === item.id ? "rotate-180" : ""
                                            }`}
                                    />
                                )}
                            </button>

                            {/* Submenu */}
                            {item.submenu && openMenu === item.id && !collapsed && (
                                <div className="ml-8 mt-2 space-y-1">
                                    {item.submenu.map((subitem) => (
                                        <button
                                            key={subitem.id}
                                            onClick={() => onPageChange(subitem.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${currentPage === subitem.id
                                                ? "bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-white"
                                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                                }`}
                                        >
                                            {t(`sidebar_${subitem.id}`)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* User Profile */}
            {!collapsed && (
                <div className='p-4 border-t border-slate-200/50 dark:border-slate-700/50'>
                    <div className='flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50'>
                        <img
                            src={logo}
                            alt="user"
                            className='w-10 h-10 rounded-full ring-2 object-contain ring-blue-500'
                        />
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-medium text-slate-800 dark:text-white truncate'>
                                {t('sidebar_user_name')}
                            </p>
                            <p className='text-xs text-slate-500 dark:text-slate-400 truncate'>
                                {t('sidebar_administrator')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;