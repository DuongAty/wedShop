import React, { useEffect, useState } from 'react';
import { Table, Button, Typography, Row, Col, Form, message, Select, Radio, Card, Result } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../untils';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderContant } from '../../contant';

const { Title, Text } = Typography;

const OrderSuccess = () => {
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [deliveryPrice, setDeliveryPrice] = useState(0);
const navigate = useNavigate()
  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [form] = Form.useForm();
  const location = useLocation()
  const { state } = location
  console.log('location', location);

  useEffect(() => {
    if (state?.deliveryMethod === 'GO_JEK') {
      setDeliveryPrice(20000);
    } else if (state?.deliveryMethod === 'FAST') {
      setDeliveryPrice(30000);
    }
  }, [state?.deliveryMethod]);
  const totalPrice = state.order?.reduce((sum, item) => sum + item.price * item.amount, 0) + deliveryPrice;
  return (
    <div style={{ padding: 15, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Result
        status="success"
        title="Đơn hàng đã đặt thành công"
        extra={[
          <Button onClick={()=>navigate('/')} key="buy">Về trang chủ</Button>
        ]}
      />
      <Table
        dataSource={state.order || []}
        rowKey={(record) => record.id}
        columns={[
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
          },
          {
            title: 'Số lượng',
            dataIndex: 'amount',
            key: 'amount',
          },
          {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => convertPrice(price),
          },
          {
            title: 'Tổng',
            key: 'total',
            render: (_, record) => convertPrice(record.price * record.amount),
          },
        ]}
        pagination={false}
        bordered
      />
      <Row gutter={16}>
        <Col span={16}>
          <div style={{ padding: '15px' }}>
            {/* Chọn phương thức giao hàng */}
            <Card style={{ marginBottom: 24 }}>
              <Title style={{ marginTop: '0px' }} level={4}>Phương thức giao hàng</Title>
              <span>{orderContant.deliveryMethod[state.deliveryMethod]}</span>
            </Card>

            <Card>
              <Title style={{ marginTop: '0px' }} level={4}>Phương thức thanh toán</Title>
              <span>{orderContant.paymentMethod[state.paymentMethod]}</span>
            </Card>
          </div>
        </Col>
        <Col style={{ paddingTop: '15px' }} span={8}>
          <div
            style={{
              backgroundColor: '#fff',
              padding: 16,
              borderRadius: 4,
              border: '1px solid #f0f0f0',
              paddingTop: '5px',
            }}
          >
            <Row justify="space-between">
            <Col span={24} style={{ marginBottom: 8 }}>
                <Text>Tên:</Text>
                <Text style={{ fontWeight: 'bold', display: 'block' }}>{`${user?.name}`}</Text>
              </Col>
              <Col span={24} style={{ marginBottom: 8 }}>
                <Text>Số điện thoại:</Text>
                <Text style={{ fontWeight: 'bold', display: 'block' }}>{`${user?.phone}`}</Text>
              </Col>
              <Col span={24} style={{ marginBottom: 8 }}>
                <Text>Địa chỉ:</Text>
                <Text style={{ fontWeight: 'bold', display: 'block' }}>{`${user?.address}, ${user?.city}`}</Text>
              </Col>

            </Row>
            <Row justify="space-between">
              <Title level={5}>Tổng tiền</Title>
              <Title level={5} type="danger">
                {convertPrice(totalPrice)}
              </Title>
            </Row>
          </div>
        </Col>
      </Row>

    </div>
  );
};

export default OrderSuccess;
