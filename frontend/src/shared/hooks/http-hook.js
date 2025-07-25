import { useState,useCallback,useRef,useEffect } from "react"

export const useHttpClient = () => {
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    // const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method='GET', body=null, headers={}) => {
        setIsLoading(true);
        // const httpAbortCtrl = new AbortController();
        // activeHttpRequests.current.push(httpAbortCtrl);
        try {
            const response = await fetch(url,{
                method,
                body,
                headers
                // signal: httpAbortCtrl.signal
            });

            const resData = await response.json();
            // activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl=> reqCtrl!==httpAbortCtrl);
            if(!response.ok)
                throw new Error(resData.message);
            setIsLoading(false);
            return resData;
        } catch(err) {
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
    },[]);

    const clearError = () => {
        setError(null);
    }

    // useEffect(()=>{
    //     return () => {
    //         activeHttpRequests.current.forEach(abortC => abortC.abort())
    //     };
    // },[]);
    return {isLoading,error,sendRequest,clearError};
}