import React from 'react'
import {Button} from 'antd'
const ButtonComponent = ({size,styleTextButton,styleButton,textButton,...rests}) => {
  return (
    <div>
      <Button 
        size={size} 
        style={{styleButton}}
        {...rests}
      ><span style={{styleTextButton}}>{textButton}</span></Button>
    </div>
  )
}

export default ButtonComponent
