import React from 'react'
import {Input,Button} from 'antd'
import{SearchOutlined}from '@ant-design/icons';
const ButtonInputSearch = (props) => {
    const {
        size, placeholder, textButton,bordered,
        backgroundColorInput='#fff',backgroundColorButton="#e01010",borderRadius="0px"} = props
  return (
    <div style={{display:'flex'}}>
      <Input size={size} placeholder={placeholder} style={{backgroundColor:backgroundColorInput,borderRadius:borderRadius,border: 'none'}} {...props} />
      <Button size={size} bordered={bordered} style={{backgroundColor:backgroundColorButton,borderRadius:borderRadius, border:'1px white' }} icon= {<SearchOutlined style={{color: "white"}} />}>{textButton}</Button>
    </div>
  )
}

export default ButtonInputSearch
