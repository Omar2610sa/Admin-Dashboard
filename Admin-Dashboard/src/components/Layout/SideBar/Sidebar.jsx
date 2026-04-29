import { useState } from "react";
import {
    Home,
    BarChart3,
    Users,
    Box,
    Settings,
    ChevronDown,
    Bell,
    Globe,
    Sparkles,
    Contact,
    Form
} from "lucide-react";
import { useTranslation } from "react-i18next";



// Language 

// Images imports
import logo from "../../../assets/logo-white.png";

const Sidebar = ({ collapsed, currentPage, onPageChange }) => {
    const { t } = useTranslation();

    const [openMenu, setOpenMenu] = useState(null);


    const sidebarData = [
        {
            id: "Dashboard",
            icon: Home,
            label: "Dashboard",
        },

        {
            id: "Users",
            icon: Users,
            label: "Users",
            count: "1",

        },
        {
            id: "Sections",
            icon: Box,
            label: "Sections",
            count: "11",

        },
        {
            id: "Features",
            icon: Sparkles,
            label: "Features",

        },
        {
            id: "ContactUs",
            icon: Contact,
            label: "Contact Us",
        },
        {
            id: "Applications",
            icon: Form,
            label: "Applications",
        },
        {
            id: "Notifications",
            icon: Bell,
            label: "Notifications",
        },
        {
            id: "Country",
            icon: Globe,
            label: "Country",
        },
        {
            id: "Settings",
            icon: Settings,
            label: "Settings",
        },

    ];

    return (
        <div className={`${collapsed ? "hidden md:block w-20" : "w-64"}  transition-all duration-300 ease-in-out bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col relative z-10 overflow-hidden`}>

            {/* Logo */}
            <div className='p-6 bg-gradient-to-r from-blue-500 to-purple-600 border-b border-slate-200/50 dark:border-slate-700/50'>
                <div className='flex items-center space-x-3'>
                    <div className='w-36 h-8  rounded-xl flex items-center justify-center'>
                        <img src={logo} alt="logo" />
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className='sidebar  flex-1 p-4 space-y-2 overflow-y-auto'>
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
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <div className={`flex items-center space-x-3 transition-all duration-300 ease-in-out ${collapsed ? 'opacity-0 translate-x-2 scale-x-75 w-0 invisible pointer-events-none overflow-hidden' : 'opacity-100 translate-x-0 scale-x-100 w-auto visible'}`}>
                                        <span className="font-medium text-slate-800 dark:text-white truncate">
                                            {t(`${item.id}`)}
                                        </span>

                                        {item.count && (
                                            <span className="px-2 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                                                {item.count}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {item.submenu && (
                                    <ChevronDown
                                        className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ease-in-out ${collapsed ? 'opacity-0 scale-0 translate-y-1' : 'opacity-100 scale-100 translate-y-0'} ${openMenu === item.id ? "rotate-180" : ""}`}
                                    />
                                )}
                            </button>

                            {/* Submenu */}
                            {item.submenu && openMenu === item.id && (
                                <div className={` ml-8 mt-2 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${collapsed ? 'opacity-0 max-h-0 p-0' : 'opacity-100 max-h-96 p-2'}`}>
                                    {item.submenu.map((subitem) => (
                                        <button
                                            key={subitem.id}
                                            onClick={() => onPageChange(subitem.id)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${currentPage === subitem.id
                                                ? "bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-white"
                                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                                }`}
                                        >
                                            {t(`${subitem.id}`)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className={`p-4 border-t border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 ease-in-out overflow-hidden ${collapsed ? 'max-h-0 opacity-0 p-0' : 'max-h-32 opacity-100 p-4'}`}>
                <div className='flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50'>
                    <img
                        src={logo}
                        alt="user"
                        className='w-10 h-10 rounded-full ring-2 object-contain ring-blue-500 flex-shrink-0'
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
        </div>
    );
};

export default Sidebar;