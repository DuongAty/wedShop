import React, { useEffect, useState } from 'react'
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Row, Pagination, Col } from 'antd'
import * as ProductService from '../../service/ProductService'
import { WrapperProducts, WrapperNavbar } from './style'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 100)
  const { state } = useLocation()
  const [products, setProducts] = useState([])
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 10,
    toltal: 1,
  })
  const onChange = () => { }
  const fetchProductType = async (type, page, limit) => {
    const res = await ProductService.getProductType(type, page, limit)
    if (res?.status === 'Ok') {
      setProducts(res?.data)
      setPanigate({ ...panigate, total: res?.toltalPage })
    } else {

    }
  }
  useEffect(() => {
    if (state) {
      fetchProductType(state, panigate.page, panigate.limit)
    }

  }, [state,panigate.page, panigate.limit])
  const onChangePage = (current, pageSize) => {
    console.log(current, pageSize);
    setPanigate({...panigate, page: current -1, limit: pageSize})
  }


  return (
    <div style={{ padding: '0 120px', background: '#efefef' }}>
      <Row style={{ flexWrap: 'nowrap', paddingTop: '10px' }}>
        <WrapperNavbar span={4}>
          <NavbarComponent />
        </WrapperNavbar>
        <Col span={20}>
          <WrapperProducts >
            {products?.filter((pro)=>{
              if(searchDebounce === ''){
                return pro
              }else if(pro?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())){
                return pro
              }
            })?.map((data) => {
              return (
                <CardComponent
                  countInStock={data.countInStock}
                  description={data.description}
                  image={data.image}
                  name={data.name}
                  price={data.price}
                  rating={data.rating}
                  type={data.type}
                  key={data._id}
                  selled={data.selled}
                  discount={data.discount}
                  id={data._id}
                />
              )
            })}
          </WrapperProducts>
          <Pagination defaultCurrent={panigate.page + 1} total={panigate?.toltal} onChange={onChangePage} style={{ textAlign: 'center', marginTop: '10px' }} />
        </Col>
      </Row>

    </div>
  )
}

export default TypeProductPage
