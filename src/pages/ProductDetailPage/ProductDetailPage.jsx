import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailPage = () => {
  const {id} = useParams()
    const navigate = useNavigate()
  
  return (
    <div style={{padding:'0 120px', background:'#efefef', height:'1000px'}}>
      <h5 style={{fontSize: '10px', paddingTop:'10px'}}><span style={{cursor:'pointer'}} onClick={()=>{navigate('/')}}>Trang Chủ</span> - Chi tiết sản phẩm</h5>
      <div>
      <ProductDetailComponent idProduct={id} />
      </div>

    </div>
  )
}

export default ProductDetailPage
