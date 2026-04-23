import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../language/i18n';
import api from '../../APIs/api';
import ToggleSwitch from '../../components/Reuseble/ToggleSwitch';
import { SuccessAlert } from '../../components/Alerts/SuccessAlert';

const EditFeature = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isRTL = i18n.language === 'ar';

    // Form states
    const [feature, setFeature] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [mediaValue, setMediaValue] = useState('');
    const [mediaError, setMediaError] = useState('');
    const [mediaLoadError, setMediaLoadError] = useState(false);
    const [isBlogsFeature, setIsBlogsFeature] = useState(false);

    // Fetch feature data
    useEffect(() => {
        const fetchFeature = async () => {
            try {
                const response = await api.get(`/api/admin/features/${id}`);
                let data = response.data.data || response.data;
                // Handle if API returns list, find single feature by id
                if (Array.isArray(data)) {
                    data = data.find(f => f.id == id) || data[0];
                } else if (data && data.features) {
                    data = data.features.find(f => f.id == id) || data.features[0];
                }
                setFeature(data);
                const active = data.is_active === 1 || data.is_active === '1' || data.is_active === true;
                setIsActive(active);
                if (data.media) {
                    setMediaValue(data.media);
                }
                // Check if blogs feature
                const isBlogs = data.type === 'blogs' || data.section === 'blogs';
                setIsBlogsFeature(isBlogs);
                console.log('Feature blogs check:', { type: data.type, section: data.section, isBlogs });
            } catch (err) {
                navigate('/app/features');
            } finally {
                setLoading(false);
            }
        };
        fetchFeature();
    }, [id, navigate]);

    const fixMediaUrl = (url) => {
        if (!url || typeof url !== "string") return "";
        return url;
    };

    const getFileExtension = (filename) => {
        if (!filename) return '';
        const fileStr = typeof filename === 'string' ? filename : (filename?.name || filename?.path || filename?.url || '');
        if (!fileStr) return '';
        return fileStr.split('?')[0].split('.').pop().toLowerCase();
    };

    const isVideoFile = (filename) => {
        if (!filename) return false;
        const ext = getFileExtension(filename);
        return ['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv', 'flv'].includes(ext);
    };

    const uploadMedia = async (file) => {
        if (!file) return;

        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setMediaError('File size must be less than 10MB');
            return;
        }

        setUploadingMedia(true);
        setMediaError('');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', 'features');
        formData.append('attachment_type', isVideoFile(file.name) ? 'video' : 'image');

        try {
            const response = await api.post('/api/general/attachments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });



            const uploadedMedia = response.data?.data || response.data;

            // الـ API بترجع object أو string
            if (uploadedMedia) {
                setMediaValue(uploadedMedia);
            }
        } catch (err) {
            setMediaError('Media upload failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setUploadingMedia(false);
        }
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadMedia(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formDataObj = Object.fromEntries(new FormData(e.target));
        const { media, ...payload } = formDataObj;

        if (mediaValue) {
            payload.media = mediaValue;
        } else if (feature?.media) {
            payload.media = feature.media;
        }

        payload.is_active = isActive ? 1 : 0;

        try {
            await api.put(`/api/admin/features/${id}`, payload);
            SuccessAlert("Feature updated successfully");
            navigate('/app/features');
        } catch (err) {
            setMediaError('Update failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin w-12 h-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                    </svg>
                    <p className="text-slate-600 dark:text-slate-400">Loading feature...</p>
                </div>
            </div>
        );
    }

    if (!feature) {
        return (
            <div className="space-y-6 p-8">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white">Edit Feature</h1>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                    Feature not found
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 p-8 max-w-4xl ${isRTL ? 'rtl' : 'ltr'}`} >
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">Edit Feature</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Update feature #{feature.id}</p>
                </div>
                <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                        onClick={() => navigate('/app/features')}
                        className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-2xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Media Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                            Media (Image/Video)
                        </label>

                        {/* Preview Container */}
                        {mediaValue && (
                            <div className="mb-4">
                                <div className="w-48 h-40 rounded-lg shadow-md border-2 border-slate-200 dark:border-slate-600 mx-auto bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
                                    {(() => {
                                        try {
                                            const isVideo = isVideoFile(mediaValue);
                                            const mediaStr = typeof mediaValue === 'string' ? mediaValue : (mediaValue?.media_url || mediaValue?.url || mediaValue?.path || mediaValue?.name || '');
                                            const url = fixMediaUrl(mediaStr);

                                            if (mediaLoadError) {
                                                return (
                                                    <div className="flex flex-col items-center justify-center h-full gap-2">
                                                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0-10V5m0 4V3m0 8v2m0 4v2" />
                                                        </svg>
                                                        <p className="text-xs text-red-500 text-center px-2">Failed to load media</p>
                                                    </div>
                                                );
                                            }

                                            return isVideo ? (
                                                <video src={url} controls className="w-full h-full object-cover" muted>
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img
                                                    src={url}
                                                    alt="Current media"
                                                    className="w-full h-full object-cover"
                                                    onError={() => {
                                                        setMediaLoadError(true);
                                                    }}
                                                    onLoad={() => {
                                                        setMediaLoadError(false);
                                                    }}
                                                />
                                            );
                                        } catch (err) {
                                            return <p className="text-xs text-red-500">Error loading media</p>;
                                        }
                                    })()}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                                    Current media
                                </p>
                            </div>
                        )}

                        {/* Upload Area */}
                        <label
                            htmlFor="media-upload"
                            className={`flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-950/50 transition-all w-full ${uploadingMedia ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {uploadingMedia ? 'Uploading...' : 'Click to upload or change media'}
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Image or Video (max 10MB)
                            </p>
                        </label>

                        <input
                            id="media-upload"
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleMediaChange}
                            className="hidden"
                            disabled={uploadingMedia}
                        />

                        {uploadingMedia && (
                            <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Uploading media...
                            </div>
                        )}

                        {mediaError && (
                            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                                {mediaError}
                            </div>
                        )}

                        <input type="hidden" name="media" value={mediaValue} />
                    </div>

                    {/* Title Fields */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? 'rtl' : 'ltr'}`}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Label Arabic 
                            </label>
                            <input
                                type="text"
                                name="label_ar"
                                defaultValue={feature.label_ar || feature.title || ''}
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Title English 
                            </label>
                            <input
                                type="text"
                                name="title_en"
                                defaultValue={feature.label_en || feature.title_en || ''}
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Title Arabic 
                            </label>
                            <input
                                type="text"
                                name="title_ar"
                                defaultValue={feature.title_ar || feature.title_ar || ''}
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Title English 
                            </label>
                            <input
                                type="text"
                                name="title_en"
                                defaultValue={feature.title_en || ''}
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Blogs Description Fields - Conditional */}
                    {isBlogsFeature && (
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? 'rtl' : 'ltr'}`}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description Arabic 
                                </label>
                                <textarea
                                    name="description_ar"
                                    defaultValue={feature.description_ar || ''}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                                    placeholder="Arabic description for blogs..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description English 
                                </label>
                                <textarea
                                    name="description_en"
                                    defaultValue={feature.description_en || ''}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                                    placeholder="English description for blogs..."
                                />
                            </div>
                        </div>
                    )}
 



                    {/* Status Toggle */}
                    <div>
                        <label className={`flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span>{t('feature.status', 'Status')}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{isActive ? t('active', 'Active') : t('inactive', 'Inactive')}</span>
                        </label>
                        <ToggleSwitch
                            checked={isActive}
                            onChange={setIsActive}
                        />
                        <input type="hidden" name="is_active" value={isActive ? 1 : 0} />
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <button
                            type="submit"
                            disabled={submitting || uploadingMedia}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {submitting ? 'Updating...' : 'Update Feature'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/app/features')}
                            disabled={submitting}
                            className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-4 px-6 rounded-2xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFeature;

