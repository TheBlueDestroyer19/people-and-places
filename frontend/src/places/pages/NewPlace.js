import React, {useContext} from "react";
import { useHistory } from "react-router-dom";

import './NewPlace.css'
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button"
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { authContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace=props=>{
    const {sendRequest,clearError,isLoading,error} = useHttpClient();
    const auth = useContext(authContext);
    const hist = useHistory();


    const [formState, InputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false)

    

    const placeSubmitHandler= async event=>{
        event.preventDefault();
        try{
            const formData=new FormData();
            formData.append('title',formState.inputs.title.value);
            formData.append('description',formState.inputs.description.value);   
            formData.append('address',formState.inputs.address.value);   
            formData.append('image',formState.inputs.image.value);   
            formData.append('creator',auth.userID);   

            await sendRequest("http://localhost:5000/api/places", "POST",formData,{
                Authorization: "Bearer "+auth.token
            }); 

            hist.push('/');
        } catch(err) {}
    }


    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay/>}
                <Input element="input" 
                id='title'
                type="text" 
                label="Title" 
                validators={[VALIDATOR_REQUIRE()]} 
                errorText="Please enter a valid Title"
                onInput={InputHandler}
                />
                <Input element="textarea" 
                id="description"
                label="Description" 
                validators={[VALIDATOR_MINLENGTH(10)]} 
                errorText="Please enter atleast 10 characters"
                onInput={InputHandler}
                />
                <Input element="input" 
                id="address"
                label="Address" 
                validators={[VALIDATOR_REQUIRE()]} 
                errorText="Please enter a valid address"
                onInput={InputHandler}
                />
                <ImageUpload id="image" onInput={InputHandler} errorText="Please upload an image"/>
                <Button type="submit" disabled={!formState.isValid} >Add Place</Button>
            </form>;
        </>
    );
};

export default NewPlace;