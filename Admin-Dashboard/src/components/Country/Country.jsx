import React, { useState } from 'react';
import useFetch from '../../Hooks/useFetch';
import api from '../../APIs/api';

const Country = () => {
    const { data: countries, error } = useFetch('/api/admin/countries');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCountry, setEditingCountry] = useState(null);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this country?')) return;
        
        try {
            await api.delete(`/api/admin/countries/${id}`);
            // Trigger refetch or optimistic update
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
            window.location.reload();
        } catch (err) {
            alert('Edit failed: ' + (err.response?.data?.message || err.message));
        }
    };


    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white">Countries</h1>
                    </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Error loading countries</h3>
                    <p className="text-red-700 dark:text-red-300">{error.message || error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">Countries</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Manage countries ({countries?.length || 0} total)
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
                >
                    Add Country
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                {countries && countries.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Flag</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Phone Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Phone Limit</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {countries.map((country) => (
                                    <tr key={country.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img 
                                                src={country.flag} 
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
                                                onClick={() => setEditingCountry(country)}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(country.id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                            >
                                                Delete
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
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200 mb-2">No countries found</h3>
                        <p className="text-slate-500 dark:text-slate-400">Countries will appear here once added.</p>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Add New Country</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Flag Image URL
                                </label>
                                <input type="url" name="flag" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
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
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 px-6 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">
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
                                onClick={() => setEditingCountry(null)}
                                className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <input type="hidden" name="id" value={editingCountry.id} />
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Flag Image URL
                                </label>
                                <input type="url" name="flag" defaultValue={editingCountry.flag} className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" required />
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
                                <button type="button" onClick={() => setEditingCountry(null)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 px-6 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">
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
