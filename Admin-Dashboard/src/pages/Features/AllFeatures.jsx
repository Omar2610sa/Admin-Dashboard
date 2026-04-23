import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BaseTable from '../../components/Reuseble/BaseTable/BaseTable';
import Dialogs from '../../components/Dialogs/Dialogs';
import api from '../../APIs/api';
import { SuccessAlert } from '../../components/Alerts/SuccessAlert';
import { CheckDelete } from '../../components/Alerts/CheckDelete';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const AllFeatures = () => {
    const [features, setFeatures] = useState([]);
    const [paginationMeta, setPaginationMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    // const [deleteId, setDeleteId] = useState(null); // unused
    const { t } = useTranslation();


    const fetchFeatures = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(
                `/api/admin/features?page=${currentPage}&limit=10`
            );

            const resData = response.data;

            // FIX: ensure correct structure handling
            setFeatures(Array.isArray(resData.data) ? resData.data : []);

            const meta = resData.meta || {};

            setPaginationMeta({
                current_page: meta.current_page ?? 1,
                last_page: meta.last_page ?? 1,
                total: meta.total ?? 0,
                per_page: meta.per_page ?? 10
            });

        } catch (err) {
            console.error(err);
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

    const renderDate = (row, value) => {
        return formatDate(value);
    };

    const navigate = useNavigate();
    const [deleteError, setDeleteError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(new Set());

    const handleDeleteClick = async (rowId) => {
        const result = await CheckDelete({ title: `Feature ${rowId}` });

        if (result.isConfirmed) {
            performDelete(rowId);
        }
    };

    const performDelete = async (rowId) => {
        setDeleteLoading(prev => new Set([...prev, rowId]));
        setDeleteError(null);

        try {
            await api.delete(`/api/admin/features/${rowId}`);

            // Optimistic update: remove from current page
            setFeatures(prev => prev.filter(f => f.id !== rowId));

            // If last item on page deleted, go to previous page if exists
            if (features.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            }

            SuccessAlert('Feature deleted successfully');
        } catch (err) {
            console.error(err);
            setDeleteError(`Delete failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setDeleteLoading(prev => {
                const newSet = new Set(prev);
                newSet.delete(rowId);
                return newSet;
            });
        }
    };

    const actions = (row) => (
        <div className="space-x-2">
            <button
                onClick={() => navigate(`/app/features/edit/${row.id}`)}
                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
                {t('features.buttons.edit', 'Edit')}
            </button>
            <button
                onClick={() => handleDeleteClick(row.id)}
                disabled={deleteLoading.has(row.id)}
                className={`px-3 py-1 rounded-lg transition-colors ${deleteLoading.has(row.id)
                    ? 'text-slate-400 cursor-not-allowed bg-slate-100 dark:bg-slate-800'
                    : 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                    }`}
            >
                {deleteLoading.has(row.id) ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    );

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white">All Features</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">
                            Manage all features ({paginationMeta.total})
                        </p>
                    </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">{t('features.errorTitle', 'Error loading features')}</h3>
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
            </div>
        );
    }


    // Auto-clear delete error
    useEffect(() => {
        if (deleteError) {
            const timer = setTimeout(() => setDeleteError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [deleteError]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">{t('features.title', 'All Features')}</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Page {currentPage} of {paginationMeta.last_page} - Manage all features ({paginationMeta.total})
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
                >
                    {t('features.addButton', 'Add Feature')}
                </button>
            </div>

            {deleteError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-6">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">Delete Error</h4>
                            <p className="text-red-700 dark:text-red-300 text-sm">{deleteError}</p>
                        </div>
                    </div>
                </div>
            )}

            <BaseTable
                columns={[
                    { key: 'id', label: 'ID' },
                    { key: 'section', label: 'Section' },
                    {
                        key: 'media',
                        label: 'Media',
                        render: renderMedia
                    },
                    {
                        key: 'title',
                        label: 'Title',
                        render: renderTitle
                    },
                    {
                        key: 'is_active',
                        label: 'Status',
                        render: renderStatus
                    },
                    {
                        key: 'created_at',
                        label: 'Created',
                        render: renderDate
                    }
                ]}
                data={features}
                actions={actions}
                loading={loading}
                emptyMessage="No features found"
            />

            {/* Pagination */}
            {paginationMeta.last_page > 1 && (
                <div className='flex justify-center items-center'>
                    <Stack spacing={2}>
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


            {/* Add Feature Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-md w-full">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Add Feature (Placeholder)</h2>
                        <p>Feature add form coming soon...</p>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="mt-4 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-2 px-4 rounded-xl"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllFeatures;

