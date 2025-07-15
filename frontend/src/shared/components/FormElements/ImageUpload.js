import React, {useEffect, useRef,useState} from "react";

import './ImageUpload.css';
import Button from "./Button";

const ImageUpload = props => {
    const filePickerRef = useRef();
    const [file,setFile] = useState();
    const [previewURL, setPreviewURL] = useState();
    const [isValid, setIsValid] = useState(false);

    const pickImageHandler = () => {
        filePickerRef.current.click();
    }

    useEffect(()=>{
        if(file) {
            const fileReader = new FileReader();
            fileReader.onload=()=>{
                setPreviewURL(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        }
    },[file])

    const pickedHandler = event => {
        let fileIsValid=false; let pickedFile;
        if(event.target.files && event.target.files.length===1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid=true;
        } else setIsValid(false);
        props.onInput(props.id,pickedFile,fileIsValid);
    }

    return(
        <div className="form-control">
            <input
                id={props.id}
                type="file" 
                style={{display: "none"}} 
                ref={filePickerRef}
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewURL && <img src={previewURL} alt="Preview Not Available" />}
                    {!previewURL && <p>Please upload an image</p>}
                </div>
                <Button type="Button" onClick={pickImageHandler}>UPLOAD IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;