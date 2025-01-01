import React, { useEffect, useState } from 'react'
import { WrapperContent, WrapperLableText, WrapperTextPrice, WrapperTextValue } from './style'
import { Checkbox } from 'antd';
import TypeProduct from '../TypeProduct/TypeProduct';
import * as ProductService from '../../service/ProductService'

const NavbarComponent = () => {
  const [typeProduct, setTypeProduct] = useState([])
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'Ok') {
      setTypeProduct(res?.data)
    }
  }
  const onChange = () => {
  }
  useEffect(() => {
    fetchAllTypeProduct()
  }, [])
  const renderContent = (type, options) => {
    switch (type) {
      case 'text':
        return options.map((option) => {
          return (
            <WrapperTextValue>{option}</WrapperTextValue>
          )
        })
      case 'checkbox':
        return (<Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
          {options.map((option) => {
            return (
              <Checkbox value={option.value}>{option.label}</Checkbox>

            )
          })}
        </Checkbox.Group>
        )
      case 'price':
        return options.map((option) => {
          return (
            <WrapperTextPrice>{option}</WrapperTextPrice>
          )
        })
      default:
        return []
    }
  }
  return (
    <div>
      <WrapperLableText>Loại sản phẩm</WrapperLableText>
      <WrapperContent>
        {typeProduct.map((item) => {
          return (
            <TypeProduct name={item} key={item} />
          )
        })}
      </WrapperContent>

    </div>
  )
}

export default NavbarComponent
