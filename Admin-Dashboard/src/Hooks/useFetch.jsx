import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import api from "../../API/Axios/Axios";

const useFetch = (endpoint) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { lang } = useLanguage();

    useEffect(() => {
        if (!endpoint) return;

        setLoading(true);
        api.get(endpoint)
            .then((res) => {
                setData(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || err);
                setLoading(false);
            });

    }, [endpoint, lang]);

    return { data, error, loading };
};

export default useFetch;

