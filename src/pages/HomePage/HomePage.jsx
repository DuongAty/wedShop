import React, { useEffect, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../access/image/slider1.webp'
import slider2 from '../../access/image/slider2.png'
import slider3 from '../../access/image/slider3.png'
import slider4 from '../../access/image/slider4.png'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../service/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'
import { Pagination } from 'antd'
const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 100)
  const [typeProduct, setTypeProduct] = useState([])
  const [limit, setLimit] = useState(6)
  const fetchProductAll = async (context) => {
    const search = context?.queryKey && context?.queryKey[1]
    const limit = context?.queryKey && context?.queryKey[2]
    
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'Ok') {
      setTypeProduct(res?.data)
    }
  }
  const { isLoading, data: products, isPreviousData } = useQuery({
    queryKey: ['products', searchDebounce, limit],
    queryFn: fetchProductAll,
    keepPreviousData: true,
  })
  
  useEffect(() => {
    fetchAllTypeProduct()
  }, [])
  return (
    <>
      <div style={{ padding: '0 120px' }}>
        <WrapperTypeProduct>
          {typeProduct.map((item) => {
            return (
              <TypeProduct name={item} key={item} />
            )
          })}
        </WrapperTypeProduct>
      </div>
      <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
        <div id="container" style={{ padding: '0 120px', height: '1000px' }}>
          <SliderComponent arrImages={[slider1, slider2, slider3, slider4]} />
          <WrapperProducts>
            {products?.data?.map((product) => {
              return (
                <CardComponent
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  key={product._id}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              )
            })}

          </WrapperProducts>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <WrapperButtonMore
              textButton="Xem thêm"
              type="outline"
              style={{
                border: '1px solid #fc6868', color: '#fc6868',
                width: '250px', height: '50px', borderRadius: '5px'
              }}

              onClick={() => setLimit((prev) => prev + 6)} />
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage

