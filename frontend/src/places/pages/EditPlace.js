import React, {useEffect,useState, useContext} from "react";
import { useParams, useHistory } from "react-router-dom";

import './NewPlace.css'
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { authContext } from "../../shared/context/auth-context";

const EditPlace=props=> {
    const placeID=useParams().placeID;
    const history=useHistory();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPlace,setLoadedPlace]=useState();

    const auth = useContext(authContext);

    const [formState, InputHandler, setFormData] = useForm({
        title:{
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);

    useEffect(()=>{
        const fetchPlace=async()=>{
            try{
                const resData = await sendRequest(`http://localhost:5000/api/places/${placeID}`);
                setLoadedPlace(resData.place);
                setFormData({
                title: {
                    value: resData.place.title,
                    isValid: true
                },
                description: {
                    value: resData.place.description,
                    isValid: true
                }
            },true);
            } catch(err) {}
        };
        fetchPlace();
    },[sendRequest, placeID,setFormData]);

    const placeUpdateSubmitHandler= async event => {
        event.preventDefault();
        try {
            await sendRequest(`http://localhost:5000/api/places/${placeID}`,"PATCH", JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value
            }), {'Content-Type':'application/json', Authorization: "Bearer "+ auth.token});

            history.push(`/${auth.userID}/places`);

        } catch(err) {}
    }

    if(isLoading) {
        return<div className="center">
            <LoadingSpinner/>
        </div>;
    }

    if(!loadedPlace && !error)
        return<div className="center">
            <Card>
                <h1>Couldn't Find the Place</h1>
            </Card>
        </div>;

    
    return <>
        <ErrorModal error={error} onClear={clearError}/>
        { !isLoading && loadedPlace && <form className="place-form" onSubmit={placeUpdateSubmitHandler} >
            <Input 
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid input"
                onInput={InputHandler}
                value={formState.inputs.title.value}
                valid={formState.inputs.title.isValid}
            />
            <Input 
                id="description"
                element="textarea"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(10)]}
                errorText="Please enter atleast 10 characters"
                onInput={InputHandler}
                value={formState.inputs.description.value}
                valid={formState.inputs.description.isValid}            
            />
            <Button type="submit" disabled={!formState.isValid}>SAVE CHANGES</Button>
        </form>}
    </>;
};

export default EditPlace;