import React, { useEffect } from 'react';
import { Card, Row, Col, Table, Typography } from 'antd';
import * as OrderService from '../../service/OrderService'

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { convertPrice } from '../../untils';
import { orderContant } from '../../contant';

const { Title, Text } = Typography;

const DetailOrderPage = () => {
    const location = useLocation()
    const params = useParams()
    const { id } = params
    const { state } = location
    console.log('state', id, state);
    const navigate = useNavigate()
    const fetchDetailsOrder = async () => {
        const res = await OrderService.getOrderDetail(id, state?.token)
        return res.data
    }

    const queryOder = useQuery({
        queryKey: ['orders-details'],
        queryFn: fetchDetailsOrder,
        enabled: !!id
    }
    )
    const { data: orderDetails, isLoading } = queryOder
    console.log('object', orderDetails);
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


    ];
    return (
        <div style={{ padding: '20px' }}>
            <Title level={3}>Chi tiết đơn hàng</Title>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Địa chỉ người nhận">
                        <p>Tên: {orderDetails?.shippingAddress?.fullName}</p>
                        <p>Địa chỉ: {orderDetails?.shippingAddress?.address} - {orderDetails?.shippingAddress?.city}</p>
                        <p>Điện thoại: {orderDetails?.shippingAddress?.phone}</p>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Hình thức giao hàng">
                        <p>
                            {orderDetails?.shippingPrice === 20000
                                ? <span style={{color:'green'}}>GO_JEK - Giao hàng tiết kiệm</span>
                                : orderDetails?.shippingPrice === 30000
                                    ? <span style={{color:'orange'}}>FAST - Giao hàng nhanh</span>
                                    : <span style={{color:'red'}}>Phương thức giao hàng không xác định</span>}
                        </p>
                        <p>Phí giao hàng: {orderDetails?.shippingPrice?.toLocaleString()} VND</p>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Hình thức thanh toán">
                        <p>{orderContant.paymentMethod[orderDetails?.paymentMethod]}</p>
                        <p style={{ color: orderDetails?.isPaid ? 'green' : 'red' }}>
                            {orderDetails?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </p>
                    </Card>
                </Col>
            </Row>

            <Table
                style={{ marginTop: '20px' }}
                dataSource={orderDetails?.orderItems}
                columns={columns}
                pagination={false}

            />

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <Text>Tạm tính: {convertPrice(orderDetails?.itemsPrice)} </Text><br />
                <Text>Phí vận chuyển: {convertPrice(orderDetails?.shippingPrice)}</Text><br />
                <Text>Giảm giá: </Text><br />
                <Title style={{ color: 'red' }} level={4}>Tổng cộng: {convertPrice(orderDetails?.totalPrice)}</Title>
            </div>
        </div>
    );
};

export default DetailOrderPage;
