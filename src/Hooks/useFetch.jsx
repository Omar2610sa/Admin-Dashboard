import { useEffect, useState } from "react";
import api from "../APIs/api";

const useFetch = (endpoint) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!endpoint) return;

        setLoading(true);
        api.get(endpoint)
            .then((res) => {
            setData(res.data.data)
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || err);
                setLoading(false);
            });

    }, [endpoint]);

    return { data, error, loading };
};

export default useFetch;

