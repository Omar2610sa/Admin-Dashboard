import React from 'react';
import CountryComponent from '../../components/Country/Country';

import useFetch from '../../Hooks/useFetch';
const CountryPage = () => {
    const { data: country } = useFetch("/api/admin/countries/2");


    console.log(country)
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white">Country</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Country management.</p>
                </div>
            </div>
            <CountryComponent />
        </div>
    );
};

export default CountryPage;

