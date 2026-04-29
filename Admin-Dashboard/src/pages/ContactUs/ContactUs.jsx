import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../APIs/api';
import BaseTable from '../../components/Reuseble/BaseTable/BaseTable';
import Dialogs from '../../components/Dialogs/Dialogs';

// Delete functionality
import { CheckDelete } from '../../components/Alerts/CheckDelete';
import { SuccessAlert } from '../../components/Alerts/SuccessAlert';



// Material Ui icons
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from '@mui/icons-material/Delete';

// Alerts


// Material UI component
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const ContactUs = () => {
  const [contacts, setContacts] = useState([]);
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
  const [selectedContact, setSelectedContact] = useState(null);

  // Delete loading state
  const [deleteLoading, setDeleteLoading] = useState(new Set());


  const { t } = useTranslation();

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/api/admin/contacts?page=${currentPage}&limit=10`
      );

      const resData = response.data;

      setContacts(Array.isArray(resData.data) ? resData.data : []);

      const meta = resData.meta || {};

      setPaginationMeta({
        current_page: meta.current_page ?? 1,
        last_page: meta.last_page ?? 1,
        total: meta.total ?? 0,
        per_page: meta.per_page ?? 10
      });

    } catch (err) {
      setError(err.message || err);
      setContacts([]);

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
    fetchContacts();
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
    return <p>{row.name || row.full_name || row.user_name || '-'}</p>;
  };

  const renderPhoneCode = (row) => {
    const phone = row.phone_code || '-';
    return <p>+{phone}</p>;
  };

  const renderPhone = (row) => {
    const phone = row.phone || row.contact_phone || '-';
    return <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
      {phone}
    </a>;
  };

  const renderStatus = (row) => {
    const status = row.status || row.read_status || 'new';
    const isNew = status === 'new' || status === 'unread';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isNew
          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
          : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
        }`}>
        {t(`contactUs.status.${isNew ? 'new' : 'read'}`, isNew ? 'New' : 'Read')}
      </span>
    );
  };

  const renderDate = (row, value) => formatDate(value);

  const handleDelete = async (id) => {
    setDeleteLoading(prev => new Set(prev).add(id));
    try {
      await api.delete(`/api/admin/contacts/${id}`);
      setContacts(prev => prev.filter(item => item.id !== id));
      SuccessAlert(`Contact deleted successfully`);
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

  const handleView = (row) => {
    setSelectedContact(row);
    setShowViewModal(true);
  };

  const actions = (row) => (
    <div className="space-x-1">
      <button
        onClick={() => handleView(row)}
        className="text-blue-400 hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        <PreviewIcon />
      </button>
      <button
        onClick={() =>
          CheckDelete({ title: `This Contact ${row.name}` }).then((result) => {
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white">
              {t('contactUs.title', 'Contact Applications')}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {t('contactUs.description', 'Manage contact applications')}
            </p>
          </div>
        </div>

        {/* Error Box */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            {t('contactUs.errorTitle', 'Error loading contacts')}
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">
            {t('contactUs.title', 'Contact Applications')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t(`contactUs.description`)} <span>{paginationMeta.total}</span>
          </p>
        </div>
      </div>

      {/* Table */}
      <BaseTable
        columns={[
          { key: 'name', label: t('contactUs.table.name', 'Name'), render: renderName },
          { key: 'phoneCode', label: t('contactUs.table.phoneCode', 'Phone Code'), render: renderPhoneCode },
          { key: 'phone', label: t('contactUs.table.phone', 'Phone'), render: renderPhone },
          { key: 'status', label: t('contactUs.table.status', 'Status'), render: renderStatus },
          { key: 'created_at', label: t('contactUs.table.created', 'Created'), render: renderDate }
        ]}
        data={contacts}
        actions={actions}
        loading={loading}
        emptyMessage={t('contactUs.empty.title', 'No contacts found')}
      />

      {/* Pagination */}
      {paginationMeta.last_page > 1 && (
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center">
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
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-lg w-full space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                {t('contactUs.view.title', 'Contact Details')}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t('contactUs.table.name', 'Name')}
                </label>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedContact.name || selectedContact.full_name || selectedContact.user_name || '-'}
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t('contactUs.table.phone', 'phone')}
                </label>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedContact.phone || selectedContact.phone || selectedContact.phone || '-'}
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t('contactUs.table.message', 'Message')}
                </label>
                <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                  {selectedContact.message || selectedContact.body || selectedContact.content || selectedContact.note || '-'}
                </p>
              </div>

              {/* Status & Date */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {t('contactUs.table.status', 'Status')}
                  </label>
                  {renderStatus(selectedContact)}
                </div>
                <div className="text-right">
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {t('contactUs.table.created', 'Created')}
                  </label>
                  <p className="text-slate-800 dark:text-slate-200">
                    {formatDate(selectedContact.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              >
                {t('contactUs.buttons.close', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;