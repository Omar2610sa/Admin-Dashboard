import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../language/i18n';
import { useNavigate } from 'react-router-dom';
import BaseTable from '../../components/Reuseble/BaseTable/BaseTable';
import Dialogs from '../../components/Dialogs/Dialogs';
import ToggleSwitch from '../../components/Reuseble/ToggleSwitch';
import api from '../../APIs/api';

// Material UI
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

// Delete functionality
import { CheckDelete } from '../../components/Alerts/CheckDelete';
import { SuccessAlert } from '../../components/Alerts/SuccessAlert';

// Material Ui icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AllFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10
  });

  console.log(paginationMeta.total)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // Create modal states
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState('');
  const [loadingSections, setLoadingSections] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaValue, setMediaValue] = useState('');
  const [mediaError, setMediaError] = useState('');
  const [mediaLoadError, setMediaLoadError] = useState(false);
  const [mediaPreview, setMediaPreview] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [sectionError, setSectionError] = useState('');

  // Delete loading state
  const [deleteLoading, setDeleteLoading] = useState(new Set());

  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchFeatures = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/api/admin/features?page=${currentPage}&limit=10`
      );

      const resData = response.data;

      setFeatures(Array.isArray(resData.data) ? resData.data : []);

      const meta = resData.meta || {};

      setPaginationMeta({
        current_page: meta.current_page ?? 1,
        last_page: meta.last_page ?? 1,
        total: meta.total ?? 0,
        per_page: meta.per_page ?? 10
      });

    } catch (err) {
      setError(err.message || err);
      setFeatures([]);

      setPaginationMeta({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [currentPage]);

  // Fetch sections for select
  useEffect(() => {
    const fetchSections = async () => {
      setLoadingSections(true);
      try {
        const response = await api.get('/api/general/sections');
        const data = response.data.data || response.data || [];
        setSections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch sections:', err);
      } finally {
        setLoadingSections(false);
      }
    };
    fetchSections();
  }, []);

  const isRTL = i18n.language === 'ar';

  // Create modal helpers (copied from EditFeature)
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
      setMediaError(t('createFeature.mediaFormat'));
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
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const uploadedMedia = response.data?.data || response.data;
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
      setMediaPreview(URL.createObjectURL(file));
      uploadMedia(file);
    }
  };

  // ================= UI FUNCTIONS (UNCHANGED) =================

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderMedia = (row, value) => {
    if (!value) return <span className="text-slate-400">-</span>;

    const ext = value.slice((Math.max(0, value.lastIndexOf(".")) || Infinity) + 1).toLowerCase();
    const isVideo = ['mp4', 'webm', 'ogg'].includes(ext);

    if (isVideo) {
      return (
        <video
          src={value}
          className="w-16 h-12 object-cover rounded-lg shadow-md"
          muted
          controls={false}
        />
      );
    }

    return (
      <img
        src={value}
        alt="Media"
        className="w-16 h-12 object-cover rounded-lg shadow-md"
      />
    );
  };

  const renderTitle = (row) => {
    return <Dialogs title={row.title_ar || row.title} />;
  };

  const renderStatus = (row) => {
    const isActive = row.is_active;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isActive
        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
        : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
        }`}>
        {t(`features.status.${isActive ? 'active' : 'inactive'}`, isActive ? 'Active' : 'Inactive')}
      </span>
    );
  };

  const renderDate = (row, value) => formatDate(value);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!sections.length) return;
    setSubmitting(true);
    setSectionError('');
    const formDataObj = Object.fromEntries(new FormData(e.target));
    const { section: _, ...payload } = formDataObj;
    if (!sectionId) {
      setSectionError(t('createFeature.sectionError'));
      setSubmitting(false);
      return;
    }
    payload.section_id = parseInt(sectionId);
    if (mediaValue) {
    }
    payload.is_active = isActive ? 1 : 0;
    try {
      await api.post('/api/admin/features', payload);
      SuccessAlert(t('createFeature.createButton') + t('createFeature.successfully'));
      setShowAddModal(false);
      fetchFeatures();
      // Reset form
      setMediaValue('');
      setMediaPreview('');
      setMediaError('');
      setIsActive(false);
      setSectionError('');
      e.target.reset();
    } catch (err) {
      console.error(err);
      setMediaError('Create failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    // Reset
    setSectionId('');
    setMediaValue('');
    setMediaPreview('');
    setMediaError('');
    setIsActive(false);
    setSectionError('');
  };

  const handleDelete = async (id) => {
    setDeleteLoading(prev => new Set(prev).add(id));
    try {
      await api.delete(`/api/admin/features/${id}`);
      setFeatures(prev => prev.filter(item => item.id !== id));
      SuccessAlert(`Feature deleted successfully`);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const actions = (row) => (
    <div className="space-x-1">
      <button
        onClick={() => navigate(`/app/features/edit/${row.id}`)}
        className="text-blue-400 hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        <EditIcon />
      </button>

      <button
        onClick={() =>
          CheckDelete({ title: `This Feature ${row.title_ar || row.title}` }).then((result) => {
            if (result.isConfirmed) {
              handleDelete(row.id);
            }
          })
        }
        disabled={deleteLoading.has(row.id)}
        className="text-red-400 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        title={deleteLoading.has(row.id) ? 'Deleting...' : 'Delete'}
      >
        <DeleteIcon />
        {deleteLoading.has(row.id) ? (
          <span className="text-xs">Deleting...</span>
        ) : null}
      </button>
    </div>
  );

  // ================= ERROR =================
  if (error) {
    return (
      <div className="space-y-6">
        <h1>Error loading features</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header (UNCHANGED) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">
            {t('features.title', 'All Features')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t('features.description')} <span>{paginationMeta.total}</span>
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
        >
          {t('features.addButton', 'Add Feature')}
        </button>
      </div>

      {/* Table (UNCHANGED except data source) */}
      <BaseTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'section', label: 'Section' },
          { key: 'media', label: 'Media', render: renderMedia },
          { key: 'title', label: 'Title', render: renderTitle },
          { key: 'is_active', label: 'Status', render: renderStatus },
          { key: 'created_at', label: 'Created', render: renderDate }
        ]}
        data={features}
        actions={actions}
        loading={loading}
        emptyMessage="No features found"
      />

      {/* Pagination (UNCHANGED UI, logic fixed) */}
      {paginationMeta.last_page > 1 && (
        <div className='flex justify-center items-center'>
          <Stack dir={"ltr"} spacing={2}>
            <Pagination
              count={paginationMeta.last_page}
              page={currentPage}
              color="primary"
              size="large"
              onChange={(event, page) => setCurrentPage(page)}
            />
          </Stack>
        </div>
      )}

      {/* Modal (UNCHANGED) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 ${isRTL ? 'rtl' : 'ltr'}`} style={{maxHeight: '95vh', overflowY: 'auto'}}>
            <div className={`flex items-center justify-between p-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white">{t('createFeature.title')}</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {t('createFeature.description')}
                </p>
              </div>
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-6 py-3 rounded-2xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                >
                  {t('createFeature.cancelButton')}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-b-2xl p-8 shadow-xl border-t border-slate-100 dark:border-slate-700">
              <form onSubmit={handleCreateSubmit} className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
                {/* Section Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('createFeature.section')} <span className="text-red-500">*</span>
                  </label>
                <select
                  name="section"
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  required
                >
                  <option value="">{t('createFeature.placeholders.section')}</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                  {sectionError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{sectionError}</p>
                  )}
                </div>

                {/* Media Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                    {t('createFeature.media')}
                  </label>

                  {/* Preview */}
                  {mediaPreview && (
                    <div className="mb-4">
                      <div className="w-48 h-40 rounded-lg shadow-md border-2 border-slate-200 dark:border-slate-600 mx-auto bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
                        {(() => {
                          try {
                            const isVideo = isVideoFile(mediaPreview);
                            const mediaStr = typeof mediaPreview === 'string' ? mediaPreview : mediaPreview;
                            const url = fixMediaUrl(mediaStr);
                            if (mediaLoadError) {
                              return (
                                <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
                                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0-10V5m0 4V3m0 8v2m0 4v2" />
                                  </svg>
                                  <p className="text-xs text-red-500 text-center px-2">{t('createFeature.mediaFailed')}</p>
                                </div>
                              );
                            }
                            return isVideo ? (
                              <video src={url} className="w-full h-full object-cover" controls muted />
                            ) : (
                              <img
                                src={url}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={() => setMediaLoadError(true)}
                                onLoad={() => setMediaLoadError(false)}
                              />
                            );
                          } catch (err) {
                            return <p className="text-xs text-red-500">{t('createFeature.mediaFailed')}</p>;
                          }
                        })()}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                        {t('createFeature.currentMedia')}
                      </p>
                    </div>
                  )}

                  {/* Upload Area */}
                  <label
                    htmlFor="media-upload-create"
                    className={`flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:bg-blue-950/50 transition-all w-full ${uploadingMedia ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {uploadingMedia ? t('createFeature.uploading') : t('createFeature.uploadMedia')}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t('createFeature.mediaFormat')}
                    </p>
                  </label>
                  <input
                    id="media-upload-create"
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
                      {t('createFeature.uploadingMedia')}
                    </div>
                  )}
                  {mediaError && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                      {mediaError}
                    </div>
                  )}
                  <input type="hidden" name="media" value={mediaValue} />
                </div>

                {/* Fields Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? 'rtl' : 'ltr'}`}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('createFeature.labelAr')}
                    </label>
                    <input
                      type="text"
                      name="label_ar"
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('createFeature.labelEn')}
                    </label>
                    <input
                      type="text"
                      name="label_en"
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('createFeature.titleAr')}
                    </label>
                    <input
                      type="text"
                      name="title_ar"
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('createFeature.titleEn')}
                    </label>
                    <input
                      type="text"
                      name="title_en"
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? 'rtl' : 'ltr'}`}>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('createFeature.descriptionAr')}
                    </label>
                    <textarea
                      name="description_ar"
                      rows="4"
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                      placeholder={t('createFeature.placeholders.descriptionAr')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('createFeature.descriptionEn')}
                    </label>
                    <textarea
                      name="description_en"
                      rows="4"
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                      placeholder={t('createFeature.placeholders.descriptionEn')}
                    />
                  </div>
                </div>

                {/* Status Toggle */}
                <div>
                  <label className={`flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{t('createFeature.status')}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {isActive ? t('active') : t('inactive')}
                    </span>
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
                    {submitting ? t('createFeature.uploading') : t('createFeature.createButton')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={submitting}
                    className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-4 px-6 rounded-2xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
                  >
                    {t('createFeature.cancelButton')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllFeatures;