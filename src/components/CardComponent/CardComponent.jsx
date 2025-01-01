import React from 'react'

import { StyleName, WrapperPriceText, WrapperReportTest, WrapperCardStyle, WrapperStyleTextSell } from './style';
import { StarFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import { convertPrice } from '../../untils';
const CardComponent = (props) => {
  const { countInStock, description, image, name, price, rating, type, discount, selled, id } = props
  const navigate = useNavigate()
  const handleDetailProduct = (id) => {
    navigate(`/product-detail/${id}`)
  }
  return (
    <WrapperCardStyle
      hoverable
      style={{ width: 200 }}
      bodyStyle={{ padding: '10px' }}
      cover={<img alt="example" src={image} />}
      onClick={() => countInStock !== 0 && handleDetailProduct(id)}
      disable={countInStock == 0}
    >
      <StyleName>{name}</StyleName>
      <WrapperReportTest>
        <span style={{ marginRight: '4px' }}>
          <span>Còn lại: {countInStock}</span>
        </span>
        <WrapperStyleTextSell> | Đã bán {selled || 100}</WrapperStyleTextSell>
      </WrapperReportTest>
      <WrapperPriceText>{convertPrice(price)}</WrapperPriceText>
    </WrapperCardStyle>
  )
}

export default CardComponent
