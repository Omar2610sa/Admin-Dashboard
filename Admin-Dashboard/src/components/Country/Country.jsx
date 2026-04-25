import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../language/i18n';
import useFetch from '../../Hooks/useFetch';
import api from '../../APIs/api';


const Country = () => {
    const { data: countries, error } = useFetch('/api/admin/countries');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCountry, setEditingCountry] = useState(null);

    // New flag handling states
    // eslint-disable-next-line no-unused-vars
    const [flagFile, setFlagFile] = useState(null);
    const [flagValue, setFlagValue] = useState('');
    const [flagPreviewUrl, setFlagPreviewUrl] = useState('');
    const [uploadingFlag, setUploadingFlag] = useState(false);

    const { t } = useTranslation();
    const isArabic = i18n.language === "ar";

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const fixFlagUrl = (url) => {
        if (!url) return "";

        if (url.includes("https://") && url.indexOf("https://") !== url.lastIndexOf("https://")) {
            const parts = url.split("https://");
            return "https://" + parts[parts.length - 1];
        }

        return url;
    };

    // New: Flag upload function
    const uploadFlag = async (file) => {
        if (!file) return;

        setUploadingFlag(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', 'countries');
        formData.append('attachment_type', 'image');

        try {
            const response = await api.post('/api/general/attachments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Parse response.data (filename.png)
            const filename = response.data.data;
            setFlagValue(filename);
            setFlagPreviewUrl(`https://api-araf.vue.aait-d.com/medias/countries/${filename}`);
        } catch (err) {
            console.error('Flag upload failed:', err);
            alert('Flag upload failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setUploadingFlag(false);
            setFlagFile(null);
        }
    };


    // New: Flag file change handler
    const handleFlagChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFlagFile(file);
            // Instant local preview
            setFlagPreviewUrl(URL.createObjectURL(file));
            uploadFlag(file);
        }
    };


    // Reset flag states
    const resetFlagStates = () => {
        setFlagFile(null);
        setFlagValue('');
        setFlagPreviewUrl('');
        setUploadingFlag(false);
    };

    const handleDelete = async (id) => {
        if (!confirm(t('country.deleteConfirm'))) return;

        try {
            await api.delete(`/api/admin/countries/${id}`);
            window.location.reload();
        } catch (err) {
            alert('Delete failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const countryData = Object.fromEntries(formData);

        try {
            await api.post('/api/admin/countries', countryData);
            setShowAddModal(false);
            e.target.reset();
            resetFlagStates();
            window.location.reload();
        } catch (err) {
            alert('Add failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const countryData = Object.fromEntries(formData);

        try {
            await api.put(`/api/admin/countries/${editingCountry.id}`, countryData);
            setEditingCountry(null);
            resetFlagStates();
            window.location.reload();
        } catch (err) {
            alert('Edit failed: ' + (err.response?.data?.message || err.message));
        }
    };

    // Edit modal open - prefill flag
    const openEditModal = (country) => {
        setEditingCountry(country);
        setFlagValue(country.flag || '');
        setFlagPreviewUrl('');
        // Preview will show via fixFlagUrl(flagValue) in template
    };

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white">{t('country.title')}</h1>
                    </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">{t('country.errorTitle')}</h3>
                    <p className="text-red-700 dark:text-red-300">{error.message || error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">{t('country.title')}</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {t('country.description', { count: countries?.length || 0 })} ({countries?.length || 0})
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowAddModal(true);
                        resetFlagStates();
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
                >
                    {t('country.addButton')}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                {countries && countries.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-center">
                            <thead className="bg-slate-50  dark:bg-slate-700/50">
                                <tr>
                                    <th className={`px-6 py-4  text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>{t('country.table.flag')}</th>
                                    <th className={`px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>{t('country.table.name')}</th>
                                    <th className={`px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>{t('country.table.phoneCode')}</th>
                                    <th className={`px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>{t('country.table.phoneLimit')}</th>
                                    <th className={`px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>{t('country.table.status')}</th>
                                    <th className={`px-6 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>{t('country.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {countries.map((country) => (
                                    <tr key={country.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img
                                                src={fixFlagUrl(country.flag)}
                                                alt={country.name_en}
                                                className="w-12 h-8 object-cover rounded-lg shadow-md"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-flag.png';
                                                }}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-slate-200">
                                                {country.name_ar}
                                            </div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                {country.name_en}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">
                                            +{country.phone_code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                                            {country.phone_limit}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            {formatDate(country.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => openEditModal(country)}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                            >
                                                {t('country.button.edit')}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(country.id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                            >
                                                {t('country.button.delete')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="text-6xl text-slate-400 dark:text-slate-500 mb-4">🌍</div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200 mb-2">{t('country.empty.title')}</h3>
                        <p className="text-slate-500 dark:text-slate-400">{t('country.empty.subtitle')}</p>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white">{t('country.modal.add.title')}</h2>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetFlagStates();
                                }}
                                className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4">
                            {/* New Flag Section */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t('country.label.flag')}
                                </label>
                                {flagPreviewUrl && (
                                    <div className="mb-3">
                                        <img
                                            src={flagPreviewUrl}
                                            alt="Flag preview"
                                            className="w-20 h-14 object-cover rounded-lg shadow-md border-2 border-slate-200 dark:border-slate-600 mx-auto"
                                        />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
                                            Preview - will be replaced with server URL
                                        </p>
                                    </div>
                                )}
                                <label
                                    htmlFor="flag-upload-add"
                                    className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 dark:hover:border-teal-400 dark:hover:bg-teal-950/50 transition-all w-full"
                                >
                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {t('country.upload.clickToUpload')}
                                    </span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        PNG, JPG up to 2MB
                                    </p>
                                </label>
                                <input
                                    id="flag-upload-add"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFlagChange}
                                    className="hidden"
                                />
                                {uploadingFlag && (
                                    <div className="mt-2 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading your flag...
                                    </div>
                                )}
                                <input type="hidden" name="flag" value={flagValue} />

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Name (Arabic)
                                </label>
                                <input type="text" name="name_ar" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Name (English)
                                </label>
                                <input type="text" name="name_en" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Phone Code (without +)
                                </label>
                                <input type="number" name="phone_code" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Phone Limit
                                </label>
                                <input type="number" name="phone_limit" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                            </div>
                            <div className="flex space-x-4">
                                <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all">
                                    Add Country
                                </button>
                                <button type="button" onClick={() => {
                                    setShowAddModal(false);
                                    resetFlagStates();
                                }} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 px-6 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingCountry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Edit Country</h2>
                            <button
                                onClick={() => {
                                    setEditingCountry(null);
                                    resetFlagStates();
                                }}
                                className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleEdit} className="space-y-4">
                            {/* New Flag Section for Edit */}
                            <div>

                                {(flagPreviewUrl || flagValue) && (
                                    <div className="mb-3">
                                        <img
                                            src={flagPreviewUrl || fixFlagUrl(flagValue)}
                                            alt="Flag preview"
                                            className="w-20 h-14 object-cover rounded-lg shadow-md border-2 border-slate-200 dark:border-slate-600 mx-auto"
                                        />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
                                            {flagPreviewUrl ? 'Preview - will be replaced with server URL' : 'Current flag'}
                                        </p>
                                    </div>
                                )}
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                    Select new image to replace, or keep current
                                </div>
                                <label
                                    htmlFor="flag-upload-edit"
                                    className="flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 dark:hover:border-teal-400 dark:hover:bg-teal-950/50 transition-all w-full"
                                >
                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Click to change flag
                                    </span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        PNG, JPG up to 2MB
                                    </p>
                                </label>
                                <input
                                    id="flag-upload-edit"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFlagChange}
                                    className="hidden"
                                />
                                {uploadingFlag && (
                                    <div className="mt-2 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading new flag...
                                    </div>
                                )}
                                <input type="hidden" name="flag" value={flagValue} />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Name (Arabic)
                                </label>
                                <input type="text" name="name_ar" defaultValue={editingCountry.name_ar} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Name (English)
                                </label>
                                <input type="text" name="name_en" defaultValue={editingCountry.name_en} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Phone Code
                                </label>
                                <input type="number" name="phone_code" defaultValue={editingCountry.phone_code} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Phone Limit
                                </label>
                                <input type="number" name="phone_limit" defaultValue={editingCountry.phone_limit} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
                            </div>

                            <div className="flex space-x-4">
                                <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all">
                                    Update Country
                                </button>
                                <button type="button" onClick={() => {
                                    setEditingCountry(null);
                                    resetFlagStates();
                                }} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 px-6 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Country;
