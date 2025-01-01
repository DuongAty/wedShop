import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import * as OrderService from '../../service/OrderService'
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Typography, Button, Table, message } from 'antd';
import { convertPrice } from '../../untils';
import { useLocation, useNavigate, } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHooks';
const { Title, Text } = Typography;

const MyOrderPage = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token)
    return res.data
  }
  const queryOder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    enabled: !!state?.id && !!state?.token
  }
  )
  const { data: orders, isLoading } = queryOder

  const handleDetailsOrder = (id)=>{
    navigate(`/detail-order/${id}`,{
      state:{
        id: state?.id,
        token: state?.token
      }
    })
  }
  const mutation = useMutationHooks(
    (data)=>{
      const {id, token, orderItems} = data
      const res = OrderService.cancelOrderDetails(id, token, orderItems)
      return res
    }
  )
  const handleCancelOrder =(order)=>{
    mutation.mutate({id: order._id, token:state?.token, orderItems: order?.orderItems},{
      onSuccess:()=>{
        queryOder.refetch()
      }
    })
  }
  const {isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel}= mutation
  useEffect(()=>{
    if(isSuccessCancel && dataCancel?.status ==='Ok'){
      message.success('Thành công')
    }else if(isErrorCancel){
      message.error('Thất bại')
    }
  }, [isErrorCancel,isSuccessCancel])
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={record.image} alt={name} style={{ width: 50, height: 50, marginRight: 8 }} />
          <span>{name} </span>
        </div>
      ),
      align: "center"
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      key: "amount",
      align: "center"
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => convertPrice(price),
    },

  ];

  return (
    <Loading isPending={isLoading}>
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <Title level={3}>Đơn hàng của tôi</Title>

        {/* Kiểm tra nếu `orders` không tồn tại */}
        {orders && Object.keys(orders).length > 0 ? (
          Object.values(orders).map((order) => (
            <Card
              key={order.id}
              style={{
                marginBottom: '20px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Row gutter={[16, 16]}>
                {/* Thông tin trạng thái đơn hàng */}
                <Col span={24}>
                  <Text strong style={{ color: 'red' }}>
                    Giao hàng:
                  </Text>{' '}
                  <Text>{order.isDelivered === false ? "Chưa giao hàng" : "Đã giao hàng"}</Text>
                  <br />
                  <Text strong style={{ color: 'red' }}>
                    Thanh toán:
                  </Text>{' '}
                  <Text>{order?.isPaid === false ? "Chưa thanh toán": "Đã thanh toán"}</Text>
                </Col>

                {/* Thông tin sản phẩm */}
                <Table
                dataSource={order.orderItems}
                columns={columns}
                pagination={false}
                style={{ marginTop: 16,width:'80%' }}
              />
                {/* Tổng tiền và nút hành động */}
                <Col span={20}></Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Text strong style={{ color: 'red', fontSize: '16px' }}>
                    Tổng tiền: {convertPrice(order.totalPrice)}
                  </Text>
                </Col>
                <Col span={24} style={{ textAlign: 'right', marginTop: '10px' }}>
                  <Button onClick={()=> handleCancelOrder(order)} danger style={{ marginRight: '10px' }}>
                    Hủy đơn hàng
                  </Button>
                  <Button onClick={()=> handleDetailsOrder(order?._id)} >Xem chi tiết</Button>
                </Col>
              </Row>
            </Card>
          ))
        ) : (
          <Text>Không có đơn hàng nào.</Text>
        )}
      </div>
    </Loading>

  );
};

export default MyOrderPage;
