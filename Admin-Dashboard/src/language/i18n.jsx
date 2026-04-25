import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            app: "Admin Dashboard",
            Dashboard: "Dashboard",
            Users: "Users",
            Settings: "Settings",
            Analytics: "Analytics",
            Sections: "Sections",
            Features: "Features",
            Notifications: "Notifications",
            Country: "Countries",
            
            // Sidebar translations
            sidebar_dashboard: "Dashboard",
            sidebar_analytics: "Analytics",
            sidebar_users: "Users",
            sidebar_sections: "Sections",
            sidebar_features: "Features",
            sidebar_notifications: "Notifications",
            sidebar_country: "Countries",
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
            
            // Header translations
            header_settings: "Settings",
            header_logout: "Logout",
            
            // Sections translations
            sections: {
                title: "All Sections",
                description: "Manage all sections ({count})",
                addButton: "Add Section",
                errorTitle: "Error loading sections",
                table: {
                    id: "ID",
                    type: "Type",
                    media: "Media",
                    title: "Title",
                    status: "Status",
                    created: "Created",
                    actions: "Actions"
                },
                empty: {
                    title: "No sections found",
                    subtitle: "Sections will appear here once added."
                },
                buttons: {
                    edit: "Edit",
                    delete: "Delete",
                    active: "Active",
                    inactive: "Inactive"
                },
                status: {
                    active: "Active",
                    inactive: "Inactive"
                }
            },
            
            // Features translations
            features: {
                title: "All Features",
                description: "Manage all features",
                addButton: "Add Feature",
                errorTitle: "Error loading features",
                table: {
                    id: "ID",
                    type: "Type",
                    media: "Media",
                    title: "Title",
                    status: "Status",
                    created: "Created",
                    actions: "Actions"
                },
                empty: {
                    title: "No features found",
                    subtitle: "Features will appear here once added."
                },
                buttons: {
                    edit: "Edit",
                    delete: "Delete",
                    active: "Active",
                    inactive: "Inactive"
                },
                status: {
                    active: "Active",
                    inactive: "Inactive"
                }
            },
            
            // Edit Feature translations
            editFeature: {
                title: "Edit Feature",
                description: "Update feature",
                media: "Media (Image/Video)",
                labelAr: "Label Arabic",
                labelEn: "Label English",
                titleAr: "Title Arabic",
                titleEn: "Title English",
                descriptionAr: "Description Arabic",
                descriptionEn: "Description English",
                status: "Status",
                uploadMedia: "Click to upload or change media",
                mediaFormat: "Image or Video (max 10MB)",
                uploading: "Uploading...",
                uploadingMedia: "Uploading media...",
                mediaFailed: "Failed to load media",
                currentMedia: "Current media",
                updateButton: "Update Feature",
                cancelButton: "Cancel",
                placeholders: {
                    descriptionAr: "Arabic description for blogs...",
                    descriptionEn: "English description for blogs..."
                }
            },
            
            // Edit Section translations
            editSection: {
                title: "Edit Section",
                description: "Update section",
                media: "Media (Image/Video)",
                titleAr: "Title Arabic",
                titleEn: "Title English",
                descriptionAr: "Description Arabic",
                descriptionEn: "Description English",
                labelAr: "Label Arabic",
                labelEn: "Label English",
                type: "Type",
                status: "Status",
                uploadMedia: "Click to upload or change media",
                mediaFormat: "Image or Video (max 10MB)",
                uploading: "Uploading...",
                uploadingMedia: "Uploading media...",
                mediaFailed: "Failed to load media",
                currentMedia: "Current media",
                updateButton: "Update Section",
                cancelButton: "Cancel",
                loading: "Loading section..."
            },
            
            // Common status translations
            active: "Active",
            inactive: "Inactive",
            
            New: "New",
            
            country: {
                title: "Countries",
                description: "Manage countries",
                addButton: "Add Country",
                errorTitle: "Error loading countries",
                table: {
                    flag: "Flag",
                    name: "Name",
                    phoneCode: "Phone Code",
                    phoneLimit: "Phone Limit",
                    status: "Status",
                    actions: "Actions"
                },
                empty: {
                    title: "No countries found",
                    subtitle: "Countries will appear here once added."
                },
                deleteConfirm: "Are you sure you want to delete this country?",
                modal: {
                    add: {
                        title: "Add New Country"
                    },
                    edit: {
                        title: "Edit Country"
                    }
                },
                label: {
                    flag: "Country Flag",
                    nameAr: "Name (Arabic)",
                    nameEn: "Name (English)",
                    phoneCode: "Phone Code (without +)",
                    phoneCodeEdit: "Phone Code",
                    phoneLimit: "Phone Limit"
                },
                upload: {
                    clickToUpload: "Click to upload flag",
                    clickToChange: "Click to change flag",
                    format: "PNG, JPG up to 2MB",
                    uploading: "Uploading your flag...",
                    newUploading: "Uploading new flag...",
                    previewText: "Preview - will be replaced with server URL",
                    currentFlag: "Current flag",
                    replaceHint: "Select new image to replace, or keep current"
                },
                button: {
                    addCountry: "Add Country",
                    updateCountry: "Update Country",
                    edit: "Edit",
                    delete: "Delete",
                    cancel: "Cancel"
                },
                error: {
                    flagUpload: "Flag upload failed",
                    add: "Add failed",
                    edit: "Edit failed",
                    delete: "Delete failed",
                    generic: "{{action}} failed"
                }
            },
        },
    },

    ar: {
        translation: {
            app: "لوحة التحكم",
            Dashboard: "لوحة التحكم",
            Users: "المستخدمين",
            Settings: "الإعدادات",
            Analytics: "الإحصائيات",
            Sections: "الأقسام",
            Features: "المميزات",
            Notifications: "الإشعارات",
            Country: "الدول",
            
            // Sidebar translations
            sidebar_dashboard: "لوحة التحكم",
            sidebar_analytics: "الإحصائيات",
            sidebar_users: "المستخدمين",
            sidebar_sections: "الأقسام",
            sidebar_features: "المميزات",
            sidebar_notifications: "الإشعارات",
            sidebar_country: "الدول",
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
            
            // Header translations
            header_settings: "الإعدادات",
            header_logout: "تسجيل الخروج",
            
            // Sections translations
            sections: {
                title: "جميع الأقسام",
                description: "إدارة جميع الأقسام ({count})",
                addButton: "إضافة قسم",
                errorTitle: "خطأ في تحميل الأقسام",
                table: {
                    id: "المعرف",
                    type: "النوع",
                    media: "الوسائط",
                    title: "العنوان",
                    status: "الحالة",
                    created: "تاريخ الإنشاء",
                    actions: "الإجراءات"
                },
                empty: {
                    title: "لا توجد أقسام",
                    subtitle: "ستظهر الأقسام هنا بعد الإضافة."
                },
                buttons: {
                    edit: "تعديل",
                    delete: "حذف",
                    active: "نشط",
                    inactive: "غير نشط"
                },
                status: {
                    active: "نشط",
                    inactive: "غير نشط"
                }
            },
            
            // Features translations
            features: {
                title: "جميع المميزات",
                description: "إدارة جميع المميزات ({count})",
                addButton: "إضافة مميزة",
                errorTitle: "خطأ في تحميل المميزات",
                table: {
                    id: "المعرف",
                    type: "النوع",
                    media: "الوسائط",
                    title: "العنوان",
                    status: "الحالة",
                    created: "تاريخ الإنشاء",
                    actions: "الإجراءات"
                },
                empty: {
                    title: "لا توجد مميزات",
                    subtitle: "ستظهر المميزات هنا بعد الإضافة."
                },
                buttons: {
                    edit: "تعديل",
                    delete: "حذف",
                    active: "نشط",
                    inactive: "غير نشط"
                },
                status: {
                    active: "نشط",
                    inactive: "غير نشط"
                }
            },
            
            // Edit Feature translations
            editFeature: {
                title: "تعديل المميزة",
                description: "تحديث المميزة",
                media: "الوسائط (صورة/فيديو)",
                labelAr: "التسمية العربية",
                labelEn: "التسمية الإنجليزية",
                titleAr: "العنوان العربي",
                titleEn: "العنوان الإنجليزي",
                descriptionAr: "الوصف العربي",
                descriptionEn: "الوصف الإنجليزي",
                status: "الحالة",
                uploadMedia: "انقر لرفع أو تغيير الوسائط",
                mediaFormat: "صورة أو فيديو (بحد أقصى 10 ميغا)",
                uploading: "جاري الرفع...",
                uploadingMedia: "جاري رفع الوسائط...",
                mediaFailed: "فشل تحميل الوسائط",
                currentMedia: "الوسائط الحالية",
                updateButton: "تحديث المميزة",
                cancelButton: "إلغاء",
                placeholders: {
                    descriptionAr: "وصف عربي للمدونات...",
                    descriptionEn: "وصف إنجليزي للمدونات..."
                }
            },
            
            // Edit Section translations
            editSection: {
                title: "تعديل القسم",
                description: "تحديث القسم",
                media: "الوسائط (صورة/فيديو)",
                titleAr: "العنوان العربي",
                titleEn: "العنوان الإنجليزي",
                descriptionAr: "الوصف العربي",
                descriptionEn: "الوصف الإنجليزي",
                labelAr: "التسمية العربية",
                labelEn: "التسمية الإنجليزية",
                type: "النوع",
                status: "الحالة",
                uploadMedia: "انقر لرفع أو تغيير الوسائط",
                mediaFormat: "صورة أو فيديو (بحد أقصى 10 ميغا)",
                uploading: "جاري الرفع...",
                uploadingMedia: "جاري رفع الوسائط...",
                mediaFailed: "فشل تحميل الوسائط",
                currentMedia: "الوسائط الحالية",
                updateButton: "تحديث القسم",
                cancelButton: "إلغاء",
                loading: "جاري تحميل القسم..."
            },
            
            // Common status translations
            active: "نشط",
            inactive: "غير نشط",
            
            New: "جديد",
            
            country: {
                title: "الدول",
                description: "إدارة الدول",
                addButton: "إضافة دولة",
                errorTitle: "خطأ في تحميل الدول",
                table: {
                    flag: "العلم",
                    name: "الاسم",
                    phoneCode: "كود الهاتف",
                    phoneLimit: "حد الهاتف",
                    status: "الحالة",
                    actions: "الإجراءات"
                },
                empty: {
                    title: "لا توجد دول",
                    subtitle: "ستظهر الدول هنا بعد الإضافة."
                },
                deleteConfirm: "هل أنت متأكد من حذف هذه الدولة؟",
                modal: {
                    add: {
                        title: "إضافة دولة جديدة"
                    },
                    edit: {
                        title: "تعديل الدولة"
                    }
                },
                label: {
                    flag: "علم الدولة",
                    nameAr: "الاسم (عربي)",
                    nameEn: "الاسم (إنجليزي)",
                    phoneCode: "كود الهاتف (بدون +)",
                    phoneCodeEdit: "كود الهاتف",
                    phoneLimit: "حد الهاتف"
                },
                upload: {
                    clickToUpload: "انقر لرفع العلم",
                    clickToChange: "انقر لتغيير العلم",
                    format: "PNG, JPG حتى 2 ميغا",
                    uploading: "جاري رفع العلم...",
                    newUploading: "جاري رفع علم جديد...",
                    previewText: "معاينة - سيتم استبدال برابط الخادم",
                    currentFlag: "العلم الحالي",
                    replaceHint: "اختر صورة جديدة للاستبدال، أو احتفظ بالحالي"
                },
                button: {
                    addCountry: "إضافة الدولة",
                    updateCountry: "تحديث الدولة",
                    edit: "تعديل",
                    delete: "حذف",
                    cancel: "إلغاء"
                },
                error: {
                    flagUpload: "فشل رفع العلم",
                    add: "فشل الإضافة",
                    edit: "فشل التعديل",
                    delete: "فشل الحذف",
                    generic: "فشل {{action}}"
                }
            },
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