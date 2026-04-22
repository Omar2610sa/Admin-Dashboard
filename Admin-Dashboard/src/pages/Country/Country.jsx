import React from 'react';
import CountryComponent from '../../components/Country/Country';

import useFetch from '../../Hooks/useFetch';
const CountryPage = () => {
    const { data: country } = useFetch("/api/admin/countries/");


    console.log(country)
    return (
        <div className="space-y-6">

            <CountryComponent countries={country} />
        </div>
    );
};

export default CountryPage;

