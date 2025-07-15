import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from '../components/PlaceList';
import {useHttpClient} from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces=()=>{    
    const userID=useParams().userId;
    const [loadedPlaces,setLoadedPlaces] = useState();
    const {sendRequest, isLoading, error, clearError} = useHttpClient();

    useEffect(()=>{
        const fetchPlaces = async() => {
            try{
                const resData = await sendRequest(`http://localhost:5000/api/places/user/${userID}`);
                setLoadedPlaces(resData.places);
            } catch(err) {};
        }
        fetchPlaces();
    },[sendRequest, userID]);

    const placeDeleteHandler = deletedPlaceID => {
        setLoadedPlaces(prevPlaces=>prevPlaces.filter(place=>place.id!==deletedPlaceID))
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <div className="center"><LoadingSpinner /></div>}
            {loadedPlaces && !isLoading && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler}/>}
        </>
    );
}

export default UserPlaces;