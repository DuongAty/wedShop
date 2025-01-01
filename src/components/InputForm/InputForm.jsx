import React from 'react'
import { WrapperInputStyle } from './style';
const InputForm = (props) => {
    const {placeholder='Email', ...rests} = props
    const handleOnchangeInput = (e)=>{
      props.onChange(e.target.value)
    }
  return (
    <div>
      <WrapperInputStyle placeholder={placeholder} value={props.value} {...rests} onChange={handleOnchangeInput}>
      </WrapperInputStyle>
    </div>
  )
}

export default InputForm
