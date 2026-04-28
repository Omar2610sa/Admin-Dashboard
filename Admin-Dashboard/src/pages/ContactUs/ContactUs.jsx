import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useFetch from '../../Hooks/useFetch';
import BaseTable from '../../components/Reuseble/BaseTable/BaseTable';
import Dialogs from '../../components/Dialogs/Dialogs';

const ContactUs = () => {
  const { data: contacts = [], error, loading } = useFetch('/api/admin/contacts');
  const { t } = useTranslation();
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderName = (row) => {
    return <p >{row.name || row.full_name || row.user_name || '-'}</p>;
  };

  const renderPhoneCode = (row) => {
    const phone = row.phone_code ||'-';
    return (
      <p
        href={phone !== '-' ? `mailto:${phone}` : undefined}
      >
        +{phone}
      </p>
    );
  };




const renderPhone = (row) => {
  const phone = row.phone || row.contact_phone || '-';
  return (
    <p
    >
      {phone}
    </p>
  );
}

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

const handleView = (row) => {
  setSelectedContact(row);
  setShowViewModal(true);
};

const actions = (row) => (
  <div className="space-x-2">
    <button
      onClick={() => handleView(row)}
      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
    >
      {t('contactUs.buttons.view', 'View')}
    </button>
    <button
      onClick={() => {
        if (confirm(`${t('contactUs.buttons.delete', 'Delete')} ${t('contactUs.table.contact', 'contact')} #${row.id}?`)) {
          alert('Delete placeholder');
        }
      }}
      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
    >
      {t('contactUs.buttons.delete', 'Delete')}
    </button>
  </div>
);

if (error) {
  return (
    <div className="space-y-6">
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
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
          {t('contactUs.errorTitle', 'Error loading contacts')}
        </h3>
        <p className="text-red-700 dark:text-red-300">{error.message || error}</p>
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
          {t('contactUs.description', { count: Array.isArray(contacts) ? contacts.length : 0 })}
        </p>
      </div>
    </div>

    {/* Table */}
    <BaseTable
      columns={[
        { key: 'id', label: t('contactUs.table.id', 'ID') },
        { key: 'name', label: t('contactUs.table.name', 'Name'), render: renderName },
        { key: 'phoneCode', label: t('contactUs.table.phoneCode', 'Phone Code'), render: renderPhoneCode },
        { key: 'renderPhone', label: t('contactUs.table.phone', 'Phone'), render: renderPhone },
        { key: 'status', label: t('contactUs.table.status', 'Status'), render: renderStatus },
        { key: 'created_at', label: t('contactUs.table.created', 'Created'), render: renderDate }
      ]}
      data={contacts}
      actions={actions}
      loading={loading}
      emptyMessage={t('contactUs.empty.title', 'No contacts found')}
    />

    {/* View Modal */}
    {showViewModal && selectedContact && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-lg w-full space-y-6">
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                {t('contactUs.table.name', 'Name')}
              </label>
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {selectedContact.name || selectedContact.full_name || selectedContact.user_name || '-'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                {t('contactUs.table.email', 'Email')}
              </label>
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {selectedContact.email || selectedContact.user_email || selectedContact.contact_email || '-'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                {t('contactUs.table.message', 'Message')}
              </label>
              <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                {selectedContact.message || selectedContact.body || selectedContact.content || selectedContact.note || '-'}
              </p>
            </div>

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

