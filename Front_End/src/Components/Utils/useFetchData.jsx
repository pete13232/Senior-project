import { useEffect, useState } from "react";
import axios from "axios";

const useFetchData = ({ url }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    console.log(url);
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(url);
        setData(response.data);
        setSuccess(true);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return {
    data,
    loading,
    success,
  };
};

export default useFetchData;
