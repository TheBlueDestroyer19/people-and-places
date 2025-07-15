import { useCallback, useReducer } from 'react';

const FormReducer = (state, action) => {
  switch (action.type) {
    case 'INP_CHANGE': {
      const updatedInputs = {
        ...state.inputs,
        [action.inputID]: { value: action.value, isValid: action.isValid }
      };

      let formIsValid = true;
      for (const inputId in updatedInputs) {
        if (updatedInputs[inputId]) {
          formIsValid = formIsValid && updatedInputs[inputId].isValid;
        }
      }

      return {
        ...state,
        inputs: updatedInputs,
        isValid: formIsValid
      };
    }

    case 'SET_STATE': {
      return {
        inputs: action.inputs,
        isValid: action.isValid
      };
    }

    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(FormReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({ type: 'INP_CHANGE', inputID: id, value, isValid });
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({ type: 'SET_STATE', inputs: inputData, isValid: formValidity });
  }, []);

  return [formState, inputHandler, setFormData];
};
