import React, { useState,useContext } from "react";

import { VALIDATOR_MINLENGTH, VALIDATOR_EMAIL, VALIDATOR_MAXLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from '../../shared/components/UIElements/Card';
import "./AuthPage.css";
import { authContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const AuthPage = props => {
    const auth=useContext(authContext);
    const [isLogin, setIsLogin] = useState(true);
    const {isLoading,error,sendRequest,clearError} = useHttpClient();


    const [formState, InputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const placeSubmitHandler = async event => {
        event.preventDefault();

        console.log(formState.inputs);

        if(!isLogin) {
            try {
                const formData = new FormData();
                formData.append("name",formState.inputs.name.value);
                formData.append("email",formState.inputs.email.value);
                formData.append("password",formState.inputs.password.value);
                formData.append("image",formState.inputs.image.value);

                const resData = await sendRequest(
                    'http://localhost:5000/api/users/signup', 
                    'POST', 
                    formData                    
                );                
                auth.login(resData.userID, resData.token);
                
            } catch(err) {}
        } else {
            try{
                const resData = await sendRequest('http://localhost:5000/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type':'application/json'
                    }
                );
                auth.login(resData.userID, resData.token);
            } catch(err) {}
        }
    };

    const switchModeHandler = () => {
        if (!isLogin) {
            // Switching to login - remove extra fields
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            // Switching to signup - add fields
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false);
        }
        setIsLogin(prevMode => !prevMode);
    };


    return (
        <>
            <ErrorModal error={error} onClear={clearError}/>        
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay/>}
                <h1>{isLogin ? 'Login Required' : 'Create Account'}</h1>
                <hr />
                <form className="place-form" onSubmit={placeSubmitHandler}>
                    {!isLogin &&
                        <Input
                            element="input"
                            validators={[VALIDATOR_REQUIRE()]}
                            id="name"
                            label="Your Name"
                            errorText="Please enter a valid name"
                            onInput={InputHandler}
                        />
                    }

                    <Input
                        element="input"
                        validators={[VALIDATOR_EMAIL()]}
                        id="email"
                        label="Email"
                        errorText="Please enter a valid email"
                        onInput={InputHandler}
                    />

                    <Input
                        element="input"
                        validators={[VALIDATOR_MINLENGTH(8), VALIDATOR_MAXLENGTH(20)]}
                        type="password"
                        id="password"
                        label="Password"
                        errorText="Please enter between 8 to 20 characters"
                        onInput={InputHandler}
                    />

                    {!isLogin && <ImageUpload center id="image" onInput={InputHandler}/>}

                    <Button type="submit" disabled={!formState.isValid}>
                        {isLogin ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>

                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLogin ? 'SIGNUP' : 'LOGIN'}
                </Button>
            </Card>
        </>
    );
};

export default AuthPage;
