import { useState } from 'react';
import { getPublicDatasets, getMyDatasets} from '../services/datasetServices';

const useDatasets = () => {
    const [myDatasets, setMyDatasets] = useState([]);
    const [publicDatasets, setPublicDatasets] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMyDatasets = async () => {
        setLoading(true);
        console.log(document.cookie)
        try {
            const res = await getMyDatasets();
            // const res_second = await fetch("https://127.0.0.1:8000/api/datasets/getdatasets/", {
            //     method: "GET",
            //     credentials: "include", // 🔐 важный параметр для отправки куки
            // });
            console.log(res.data);
            setMyDatasets(res.data);
        } catch (err) {
            console.error('Failed to fetch my datasets:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPublicDatasets = async () => {
        setLoading(true);
        try {
            const res = await getPublicDatasets();
            setPublicDatasets(res.data);
        } catch (err) {
            console.error('Failed to fetch public datasets:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        myDatasets,
        publicDatasets,
        loading,
        fetchMyDatasets,
        fetchPublicDatasets,
    };
};

export default useDatasets;