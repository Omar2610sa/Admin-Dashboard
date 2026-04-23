import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../language/i18n';

const BaseTable = ({
    columns = [],
    data = [],
    actions,
    loading = false,
    emptyMessage = 'No data found'
}) => {
    const { t } = useTranslation();
    const isArabic = i18n.language === 'ar';

    if (loading) {
        return (
            <div className=" bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className=" w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                {columns.map(({ key }, index) => (
                                    <th key={key || index} className={`px-6 py-4 text-${isArabic ? 'right' : 'left'} text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}></th>
                                ))}
                                {actions && <th className={`px-6 py-4 text-${isArabic ? 'right' : 'left'} text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {[...Array(5)].map((_, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-600 rounded animate-pulse"></div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (!data?.length) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="p-12 text-center">
                    <div className="text-6xl text-slate-400 dark:text-slate-500 mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200 mb-2">{emptyMessage}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{t('table.emptySubtitle', 'No records available')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className=" bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className=" w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            {columns.map(({ key, label }) => (
                                <th
                                    key={key}
                                    className={`px-6 py-4 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}
                                >
                                    {label}
                                </th>
                            ))}
                            {actions && (
                                <th className={`px-6 py-4 text-${isArabic ? 'right' : 'left'} text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider`}>
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-center">
                        {data.map((row, index) => (
                            <tr key={row.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                {columns.map(({ key, render }) => {
                                    const value = row[key];
                                    const cellContent = render ? render(row, value) : (value || '-');
                                    return (
                                        <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">
                                            {cellContent}
                                        </td>
                                    );
                                })}
                                {actions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {actions(row)}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BaseTable;

