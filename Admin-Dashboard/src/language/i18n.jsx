import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            app: "Admin Dashboard",
            Dashboard: "Dashboard",
            Users: "Users",
            Settings: "Settings",
            sidebar_dashboard: "Dashboard",
            sidebar_analytics: "Analytics",
            sidebar_users: "Users",
            sidebar_sections: "Sections",
            sidebar_notifications: "Notifications",
            sidebar_settings: "Settings",
            sidebar_all_users: "All Users",
            sidebar_roles: "Roles & Permissions",
            sidebar_activity: "User Activity",
            sidebar_all_sections: "All Sections",
            sidebar_categories: "Categories",
            sidebar_inventory: "Inventory",
            sidebar_general: "General",
            sidebar_security: "Security",
            sidebar_notifications_settings: "Notifications",
            sidebar_user_name: "Omar Salam",
            sidebar_administrator: "Administrator",
            header_settings: "Settings",
            header_logout: "Logout",
            New: "New",
        },
    },

    ar: {
        translation: {
            app: "لوحة التحكم", 
            Dashboard: "لوحة التحكم",
            Users: "المستخدمين",
            Settings: "الإعدادات",
            sidebar_dashboard: "لوحة التحكم",
            sidebar_analytics: "الإحصائيات",
            sidebar_users: "المستخدمين",
            sidebar_sections: "الأقسام",
            sidebar_notifications: "الإشعارات",
            sidebar_settings: "الإعدادات",
            sidebar_all_users: "جميع المستخدمين",
            sidebar_roles: "الأدوار والصلاحيات",
            sidebar_activity: "نشاط المستخدم",
            sidebar_all_sections: "جميع الأقسام",
            sidebar_categories: "الفئات",
            sidebar_inventory: "المخزون",
            sidebar_general: "عام",
            sidebar_security: "الأمان",
            sidebar_notifications_settings: "إعدادات الإشعارات",
            sidebar_user_name: "Omar Salam",
            sidebar_administrator: "مدير النظام",
            header_settings: "الإعدادات",
            header_logout: "تسجيل الخروج",
            New: "جديد",

        },
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;