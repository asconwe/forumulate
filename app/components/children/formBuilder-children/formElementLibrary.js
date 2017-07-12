import React from 'react'

// Components
import TextareaElement from './formElement-children/TextareaElement'
import InputTextElement from './formElement-children/InputTextElement'

const formElementLibrary = {
    textarea: {
        getter: (props) => {
            return <TextareaElement props={props} />
        },
        name: 'textarea',
        nickName: "Big Text"
    },
    text: {
        getter: (props) => {
            return <InputTextElement props={props} />
        },
        name: 'text',
        nickName: "Small Text"
    }    
}

export default formElementLibrary