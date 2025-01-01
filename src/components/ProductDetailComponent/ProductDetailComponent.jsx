import React, { useState } from 'react'
import { Row, Image, Col, Button } from 'antd'
import ImageProduct from '../../access/image/iphone-15-pro-max.jpg'
import ImageProductSmaill from '../../access/image/iphone-15-pro-max-mini.jpg'
import {
  WrapperStyleImageSmall, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct
  , WrapperPriceTextProduct, WrapperAddressPriceProduct, WrapperQualityProduct, WrapperInputNumber, WrapperBtnQualityProduct
} from './style'
import { StarFilled } from '@ant-design/icons'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import * as ProductService from '../../service/ProductService'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slides/orderSlice'
import { convertPrice } from '../../untils'
const ProductDetailComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1)
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const onChange = (value) => {
    setNumProduct(Number(value))
  }
  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if (id) {
      const res = await ProductService.getDetailsProduct(id)
      return res.data
    }
  }
  const { isLoading, data: productDetails } = useQuery({
    queryKey: ['product-details', idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct
  })
  console.log('product-details', productDetails);

  const handleChangeCount = (type) => {
    if (type === 'increase') {
      setNumProduct(numProduct + 1)
    } else {
      setNumProduct(numProduct - 1)
    }
  }
  //   {
  //     name:{type:String, required:true},
  //     amount:{type:Number, required:true},
  //     image:{type:String, required:true},
  //     price:{type:Number, required:true},
  //     product:{
  //         type: mongoose.Schema.Types.ObjectId, //jion bang
  //         ref:'Product',
  //         required: true,
  //     },
  // },
  const handleAddOrder = () => {
    if (!user?.id) {
      navigate('/sign-in', { state: location?.pathname })
    } else {
      dispatch(addOrderProduct({
        orderItems: {
          name: productDetails?.name,
          amount: numProduct,
          countInStock: productDetails?.countInStock,
          image: productDetails?.image,
          price: productDetails?.price,
          product: productDetails?._id
        }
      }))
    }
  }
  return (
    
    <Row style={{ padding: '16px', background: '#fff' }} >
      <Col span={10} style={{ paddingRight: '8px' }}>
        <Image src={productDetails?.image} alt="image product" preview={false} />
        <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
          {/* <WrapperStyleColImage span={4}><WrapperStyleImageSmall src={ImageProductSmaill} alt="image small" preview={false} /></WrapperStyleColImage>
          <WrapperStyleColImage span={4}><WrapperStyleImageSmall src={ImageProductSmaill} alt="image small" preview={false} /></WrapperStyleColImage>
          <WrapperStyleColImage span={4}><WrapperStyleImageSmall src={ImageProductSmaill} alt="image small" preview={false} /></WrapperStyleColImage>
          <WrapperStyleColImage span={4}><WrapperStyleImageSmall src={ImageProductSmaill} alt="image small" preview={false} /></WrapperStyleColImage>
          <WrapperStyleColImage span={4}><WrapperStyleImageSmall src={ImageProductSmaill} alt="image small" preview={false} /></WrapperStyleColImage>
          <WrapperStyleColImage span={4}><WrapperStyleImageSmall src={ImageProductSmaill} alt="image small" preview={false} /></WrapperStyleColImage> */}
        </Row>
      </Col>
      <Col span={14} style={{ paddingLeft: '10px', borderLeft: '1px solid #e5e5e5' }}>
        <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
        <div>
          <StarFilled style={{ fontSize: '12px', color: 'rgb(255, 215,55)' }} />
          <StarFilled style={{ fontSize: '12px', color: 'rgb(255, 215,55)' }} />
          <StarFilled style={{ fontSize: '12px', color: 'rgb(255, 215,55)' }} />
          <StarFilled style={{ fontSize: '12px', color: 'rgb(255, 215,55)' }} />
          <StarFilled style={{ fontSize: '12px', color: 'rgb(255, 215,55)' }} />
          <WrapperStyleTextSell> | Đã bán {productDetails?.selled || 100} </WrapperStyleTextSell>
        </div>
        <WrapperPriceProduct>

          <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
        </WrapperPriceProduct>
        <div style={{
          whiteSpace: 'pre-line',
          fontFamily: 'Arial',
          lineHeight: '1.5'
        }}
        > {productDetails?.description}</div>
        <WrapperAddressPriceProduct>
          <span>Giao đến: </span>
          <span className='address'>{user?.address} - {user?.city}</span>
          <span style={{ cursor: 'pointer' }} onClick={() => { navigate('/profile-user') }} className='changeAddress'> - Đổi địa chỉ </span>
        </WrapperAddressPriceProduct>
        <div style={{ margin: '10px 0 15px', padding: '10px 0', borderBottom: '1px solid #ccc', borderTop: '1px solid #ccc' }}>
          <div>Số lượng còn lại: {productDetails?.countInStock}</div>
          <div style={{ marginBottom: '10px' }}>Số Lượng: </div>
          <WrapperQualityProduct>
            <WrapperBtnQualityProduct style={{
              cursor: numProduct === 1 ? 'not-allowed' : 'pointer',
              opacity: numProduct === 1 ? 0.5 : 1
            }} onClick={() => numProduct > 1 && handleChangeCount('decrease')} >
              <MinusOutlined />
            </WrapperBtnQualityProduct>
            <WrapperInputNumber readOnly defaultValue={Number(1)} onChange={onChange} size="small" value={numProduct} />
            <WrapperBtnQualityProduct style={{ 
              cursor: numProduct === productDetails?.countInStock ? 'not-allowed' : 'pointer', 
              opacity: numProduct === productDetails?.countInStock ? 0.5 : 1 
              }} onClick={() => numProduct < productDetails?.countInStock && handleChangeCount('increase')}>
              <PlusOutlined />
            </WrapperBtnQualityProduct>
          </WrapperQualityProduct>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button onClick={handleAddOrder} style={{
            backgroundColor: 'red',
            height: '45px',
            width: '220px',
            border: 'none',
            color: 'white',
            fontWeight: '700'
          }}>Chọn Mua</Button>
          {/* <Button style={{
            height: '45px',
            width: '220px',
            border: '1px solid',
            color: 'blue',
            fontWeight: '700'
          }}>Mua trả sau</Button> */}
        </div>
      </Col>
    </Row >
    
  )
}

export default ProductDetailComponent
