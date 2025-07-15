import React, { useState, useContext } from "react";

import './PlaceItem.css'
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from '../../shared/components/UIElements/Map';
import { authContext } from "../../shared/context/auth-context";
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";


const PlaceItem=props=>{
    const auth=useContext(authContext);
    const { isLoading, error, sendRequest, clearError} = useHttpClient();


    const [showMap, setShowMap]=useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const openMapHandler=()=>setShowMap(true);
    const closeMapHandler=()=>setShowMap(false);

    const showDeleteWarningHandler=()=>setShowConfirmModal(true);
    const closeDeleteWarningHandler=()=>setShowConfirmModal(false);
    const confirmDeleteHandler= async ()=>{
        setShowConfirmModal(false);
        try {
            await sendRequest(`http://localhost:5000/api/places/${props.id}`,"DELETE",);
            props.onDelete(props.id);
        } catch(err) {};
    };

    return(
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Modal show={showMap} onCancel={closeMapHandler} header={props.addr} contentClass="place-item__modal-content" footerClass="place-item__modal-actions" footer={<Button onClick={closeMapHandler}>CLOSE</Button>}>
                <div className="map-container">
                    <Map center={[props.coordinates.lng, props.coordinates.lat]} zoom={16}/>                        
                </div>
            </Modal>
            <Modal 
            show={showConfirmModal}
            header="Are you sure?" 
            footerClass="place-item__modal-actions" 
            footer={<>
                <Button inverse onClick={closeDeleteWarningHandler}>CANCEL</Button>
                <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
            </>}>
                <p>Are you sure to delete this place?</p>
                <p>(Please note that this will be a permanent action.)</p>
            </Modal>
            <li className="place-item">
                <Card className="place-item__content">
                    {isLoading && <LoadingSpinner asOverlay/>}
                    <div className="place-item__image">
                        <img src={`http://localhost:5000/${props.image}`} alt={props.title}/>
                    </div>
                    <div className="place-item__info">
                        <h2>{props.title}</h2>
                        <h3>{props.addr}</h3>
                        <p>{props.desc}</p>
                    </div>
                    <div className="place-item__actions">
                        <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                        {auth.userID ===props.creatorID &&
                            <Button to={`/places/${props.id}`}>EDIT</Button>
                        }
                        {auth.userID ===props.creatorID &&
                            <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
                        }
                    </div>
                </Card>
            </li>
        </>
    );
};

export default PlaceItem;