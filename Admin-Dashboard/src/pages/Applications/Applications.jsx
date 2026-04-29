import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../APIs/api';
import BaseTable from '../../components/Reuseble/BaseTable/BaseTable';
import PreviewIcon from '@mui/icons-material/Preview';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const { t } = useTranslation();

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/api/admin/applications?page=${currentPage}&limit=10`
      );

      const resData = response.data;

      setApplications(Array.isArray(resData.data) ? resData.data : []);

      const meta = resData.meta || {};

      setPaginationMeta({
        current_page: meta.current_page ?? 1,
        last_page: meta.last_page ?? 1,
        total: meta.total ?? 0,
        per_page: meta.per_page ?? 10
      });

    } catch (err) {
      setError(err.message || err);
      setApplications([]);

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
    fetchApplications();
  }, [currentPage]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderName = (row) => {
    return <p>{row.name || '-'}</p>;
  };

  const renderPhone = (row) => {
    const code = row.phone_code || '';
    const phone = row.phone || '';
    const fullPhone = `+${code}${phone}`;
    return <a href={`tel:${fullPhone}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
      +{code} {phone}
    </a>;
  };

  const renderJobType = (row) => {
    return <p>{row.job_type || '-'}</p>;
  };

  const renderCv = (row) => {
    if (!row.cv) return <p>-</p>;
    return (
      <a href={row.cv} download target="_blank" rel="noreferrer" className="block">
        <PictureAsPdfIcon className="w-5 h-5 text-red-500 hover:text-red-600 mx-auto" />
      </a>
    );
  };

  const renderDate = (row, value) => formatDate(value);

  const handleView = (row) => {
    setSelectedApplication(row);
    setShowViewModal(true);
  };

  const actions = (row) => (
    <div className="space-x-1">
      <button
        onClick={() => handleView(row)}
        className="text-blue-400 hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200 px-3 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        <PreviewIcon />
      </button>
    </div>
  );

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white">
              {t('applications.title', 'Applications')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {t('applications.description', 'Manage job applications')}
            </p>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            {t('applications.errorTitle', 'Error loading applications')}
          </h3>
          <p className="text-red-700 dark:text-red-300">
            {error.message || String(error)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">
            {t('applications.title', 'Applications')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t('applications.description', 'Manage job applications')} <span>{paginationMeta.total}</span>
          </p>
        </div>
      </div>

      <BaseTable
        columns={[
          { key: 'name', label: t('applications.table.name', 'Name'), render: renderName },
          { key: 'phone', label: t('applications.table.phone', 'Phone'), render: renderPhone },
          { key: 'job_type', label: t('applications.table.jobType', 'Job Type'), render: renderJobType },
          { key: 'cv', label: t('applications.table.cv', 'CV'), render: renderCv },
          { key: 'created_at', label: t('applications.table.created', 'Created'), render: renderDate }
        ]}
        data={applications}
        actions={actions}
        loading={loading}
        emptyMessage={t('applications.empty.title', 'No applications found')}
      />

      {paginationMeta.last_page > 1 && (
        <div className="flex justify-center items-center">
          <Stack dir="rtl" spacing={2}>
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

      {showViewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-lg w-full space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                {t('applications.view.title', 'Application Details')}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t('applications.table.name', 'Name')}
                </label>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedApplication.name || '-'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t('applications.table.phone', 'Phone')}
                </label>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  +{selectedApplication.phone_code || ''} {selectedApplication.phone || ''}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t('applications.table.jobType', 'Job Type')}
                </label>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedApplication.job_type || '-'}
                </p>
              </div>

              <div className="text-right">
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t('applications.table.created', 'Created')}
                </label>
                <p className="text-slate-800 dark:text-slate-200">
                  {formatDate(selectedApplication.created_at)}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              >
                {t('applications.buttons.close', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
