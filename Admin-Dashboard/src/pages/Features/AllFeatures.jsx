import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BaseTable from '../../components/Reuseble/BaseTable/BaseTable';
import useFetch from '../../Hooks/useFetch';
import Dialogs from '../../components/Dialogs/Dialogs';

const AllFeatures = () => {
  const { data: features = [], error, loading } = useFetch('/api/admin/features');
  const [showAddModal, setShowAddModal] = useState(false);
  const { t } = useTranslation();

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
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      );
    }
    
    return (
      <img
        src={value}
        alt="Media"
        className="w-16 h-12 object-cover rounded-lg shadow-md"
        onError={(e) => { e.target.src = '/placeholder.png'; }}
      />
    );
  };

  const renderTitle = (row) => {
    return <Dialogs title={row.title || row.label_ar || row.label_en} />;
  };

  const renderStatus = (row) => {
    const isActive = row.is_active;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isActive 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
          : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
      }`}>
        {t(`features.status.${isActive ? 'active' : 'inactive'}`)}
      </span>
    );
  };

  const renderDate = (row, value) => {
    return formatDate(value);
  };

  const navigate = useNavigate();
  const actions = (row) => (
    <div className="space-x-2">
      <button
        onClick={() => navigate(`/app/features/edit/${row.id}`)}
        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        {t('features.buttons.edit')}
      </button>
      <button
        onClick={() => {
          if (confirm(`${t('Delete')} ${t('features.title')} ${row.id}?`)) {
            alert('Delete placeholder'); // Placeholder
          }
        }}
        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      >
        {t('features.buttons.delete')}
      </button>
    </div>
  );

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white">{t('features.title')}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {t('features.description', { count: Array.isArray(features) ? features.length : 0 })}
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">{t('features.errorTitle')}</h3>
          <p className="text-red-700 dark:text-red-300">{error.message || error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">{t('features.title')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t('features.description', { count: Array.isArray(features) ? features.length : 0 })}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
        >
          {t('features.addButton')}
        </button>
      </div>

      <BaseTable
        columns={[
          { key: 'id', label: t('features.table.id') },
          { key: 'type', label: t('features.table.type') },
          { 
            key: 'media', 
            label: t('features.table.media'),
            render: renderMedia 
          },
          { 
            key: 'title', 
            label: t('features.table.title'),
            render: renderTitle 
          },
          { 
            key: 'is_active', 
            label: t('features.table.status'),
            render: renderStatus 
          },
          { 
            key: 'created_at', 
            label: t('features.table.created'),
            render: renderDate 
          }
        ]}
        data={features}
        actions={actions}
        loading={loading}
        emptyMessage={t('features.empty.title')}
      />

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">
              {t('features.addButton')} ({t('New')})
            </h2>
            <p>{t('features.title')} add form coming soon...</p>
            <button 
              onClick={() => setShowAddModal(false)}
              className="mt-4 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-2 px-4 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              {t('editFeature.cancelButton')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllFeatures;