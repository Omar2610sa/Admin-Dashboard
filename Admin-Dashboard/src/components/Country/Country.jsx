import React from 'react';
import useFetch from '../../Hooks/useFetch';

const Country = () => {
    const { data, error } = useFetch('/api/admin/countries/');

    console.log(data)

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white">Country Details</h1>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Failed to load country</h3>
                    <p className="text-red-700 dark:text-red-300 mb-4">{error.message || 'Unknown error'}</p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {error.message?.includes('401') || error.message?.includes('Unauthorized')
                            ? 'Authentication failed - check console for token details'
                            : 'Network or server error - try refreshing'
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {data.map((country) => (
                <div className="space-y-6" >
                    <div className="flex items-center justify-between">

                        <div>
                            <h1 className="text-3xl font-black text-slate-800 dark:text-white">Country Details</h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                ID: {country?.id} - {country?.name_ar}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-4">Basic Info</h3>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Name</dt>
                                    <dd className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{country?.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Code</dt>
                                    <dd className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{data?.code}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Status</dt>
                                    <dd className="mt-1">
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${data?.status === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                                            }`}>
                                            {data?.status || 'unknown'}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div >
            ))}
        </>

    );
};

export default Country;
