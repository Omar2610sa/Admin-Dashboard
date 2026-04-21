import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SunnyIcon from '@mui/icons-material/Sunny';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import logo from "../../../assets/logo-white.png";

const Header = ({ sideBarCollapsed, onToggle }) => {

    const { t } = useTranslation();

    const toggleLang = () => {
        const newLang = i18n.language === "en" ? "ar" : "en";
        i18n.changeLanguage(newLang);
    };

    useEffect(() => {
        document.dir = i18n.language === "ar" ? "rtl" : "ltr";
    }, [i18n.language]);

    return (
        <div className='bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4'>
            <div className='flex items-center justify-between'>

                <div className='flex items-center space-x-4'>
                    <button
                        onClick={onToggle}
                        className='p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                    >
                        <MenuIcon className='w-5 h-5' />
                    </button>

                    <div className='hidden md:block'>
                        <h1 className='text-2xl font-black text-slate-500 dark:text-white'>
                            {t("app")}
                        </h1>
                    </div>
                </div>

                <div className='flex-1 max-w-md mx-8'>
                    <div className='relative'>
                        <SearchIcon className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
                        <input
                            type="text"
                            placeholder={t("Search")}
                            className='w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                        />
                    </div>
                </div>

                <div className='flex items-center space-x-3'>
                    <button className='hidden lg:flex items-center space-x-2 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg cursor-pointer transition-all rounded-xl'>
                        <AddIcon className='w-4 h-4' />
                        <span className='text-sm font-medium'>{t("New")}</span>
                    </button>

                    <button className='p-2.5 rounded-xl text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
                        <SunnyIcon className='w-5 h-5' />
                    </button>

                    <button className='relative p-2.5 rounded-xl text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
                        <NotificationsIcon className='w-5 h-5' />
                        <span className='absolute top-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>5</span>
                    </button>

                    <button
                        onClick={toggleLang}
                        className='p-2.5 rounded-xl text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                    >
                        <LanguageIcon className='w-5 h-5' />
                    </button>

                    <div className='flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-700'>
                        <img src={logo} className='w-8 h-8 rounded-full ring-2 object-contain ring-blue-500' alt="" />
                        <div className='hidden md:block'>
                            <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
                                {t("UserName")}
                            </p>
                            <p className='text-xs text-slate-500 dark:text-slate-400'>
                                {t("Role")}
                            </p>
                        </div>
                        <KeyboardArrowDownIcon className='w-4 h-4 text-slate-400' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;