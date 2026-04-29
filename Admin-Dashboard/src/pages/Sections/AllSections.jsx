import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BaseTable from '../../components/Reuseble/BaseTable/BaseTable';
import useFetch from '../../Hooks/useFetch';
import Dialogs from '../../components/Dialogs/Dialogs';
import api from '../../APIs/api';
import { CheckDelete } from '../../components/Alerts/CheckDelete';
import { SuccessAlert } from '../../components/Alerts/SuccessAlert';

// Material Ui icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';




const AllSections = () => {
  const { data: sections = [], error, loading } = useFetch('/api/admin/sections');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(new Set());
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
    return <Dialogs title={row.title} />;
  };

  const renderStatus = (row) => {
    const isActive = row.is_active;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isActive 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
          : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
      }`}>
        {t(`sections.status.${isActive ? 'active' : 'inactive'}`)}
      </span>
    );
  };

  const renderDate = (row, value) => {
    return formatDate(value);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(prev => new Set(prev).add(id));
    try {
      await api.delete(`/api/admin/sections/${id}`);
      // Local filter since useFetch, no pagination
      // Note: full refresh would require useFetch key change or window.reload
      SuccessAlert(`Section deleted successfully`);
      // Trigger refetch or filter local - but useFetch data immutable, so reload or custom state needed
      window.location.reload(); // Simple for non-paginated
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

  const navigate = useNavigate();
  const actions = (row) => (
    <div className="space-x-1">
      <button
        onClick={() => navigate(`/app/sections/edit/${row.id}`)}
        className="text-blue-400 hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        <EditIcon />
      </button>
      <button
        onClick={() =>
          CheckDelete({ title: `This Section ${row.title}` }).then((result) => {
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white">{t('sections.title')}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {t('sections.description', { count: Array.isArray(sections) ? sections.length : 0 })}
            </p>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">{t('sections.errorTitle')}</h3>
          <p className="text-red-700 dark:text-red-300">{error.message || error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">{t('sections.title')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t('sections.description')} <span>{ Array.isArray(sections) ? sections.length : 0 }</span>
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
        >
          {t('sections.addButton')}
        </button>
      </div>

      <BaseTable
        columns={[
          { key: 'id', label: t('sections.table.id') },
          { key: 'type', label: t('sections.table.type') },
          { 
            key: 'media', 
            label: t('sections.table.media'),
            render: renderMedia 
          },
          { 
            key: 'title', 
            label: t('sections.table.title'),
            render: renderTitle 
          },
          { 
            key: 'is_active', 
            label: t('sections.table.status'),
            render: renderStatus 
          },
          { 
            key: 'created_at', 
            label: t('sections.table.created'),
            render: renderDate 
          }
        ]}
        data={sections}
        actions={actions}
        loading={loading}
        emptyMessage={t('sections.empty.title')}
        
      />

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">
              {t('sections.addButton')} ({t('New')})
            </h2>
            <p>{t('sections.title')} add form coming soon...</p>
            <button 
              onClick={() => setShowAddModal(false)}
              className="mt-4 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-2 px-4 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              {t('editSection.cancelButton')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSections;