import React, { useEffect, useMemo, useState } from 'react';
import { Table, Checkbox, Button, Typography, Row, Col, Input, Tooltip, Form, message, Select, Radio, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { removeAllOrderProduct, selectedOrder } from '../../redux/slides/orderSlice';
import { convertPrice } from '../../untils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import * as UserService from '../../service/UserService'
import * as OrderService from '../../service/OrderService'
import { PayPalButton } from "react-paypal-button-v2";
import { useMutationHooks } from '../../hooks/useMutationHooks';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import * as PaymentService from '../../service/PaymentService'
const { Title, Text } = Typography;

const PaymentPage = () => {
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [sdtReady, setSdkReady] = useState(false)
  const navigate = useNavigate()
  const handleDeliveryChange = (e) => {
    const selectedDeliveryMethod = e.target.value;  // Lấy giá trị phương thức giao hàng được chọn
    setDeliveryMethod(selectedDeliveryMethod)
    if (selectedDeliveryMethod === 'FAST') {
      setDeliveryPrice(30000);  // Chọn FAST, gán giá trị 30000
    } else if (selectedDeliveryMethod === 'GO_JEK') {
      setDeliveryPrice(20000);  // Chọn GO_JEK, gán giá trị 20000
    }
  };

  const handlePaymentChange = (e) => {
    const selectedPaymentMethod = e.target.value; // Lấy giá trị từ sự kiện
    setPaymentMethod(selectedPaymentMethod); // Cập nhật state
  };
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [form] = Form.useForm();
  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const dispatch = useDispatch()
  const provinces = [
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Dương', 'Bình Định', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Cần Thơ', 'Cao Bằng',
    'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai',
    'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội',
    'Hà Tĩnh', 'Hải Dương', 'Hải Phòng', 'Hòa Bình', 'Hậu Giang',
    'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
    'Lâm Đồng', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình',
    'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam',
    'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La',
    'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên-Huế',
    'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc',
    'Yên Bái'
  ];

  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  })
  const mutationAddOrder = useMutationHooks(
    (data) => {
      const {

        token,
        ...rests
      } = data
      const res = OrderService.createOrder(

        { ...rests },
        token,
      )
      return res
    }
  )
  const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder
  const mutationUpdate = useMutationHooks(
    (data) => {
      const {
        id,
        token,
        ...rests
      } = data
      const res = UserService.updateUser(
        id,
        { ...rests },
        token,
      )
      return res
    }
  )
  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'Ok') {
      const arrayOrdered = []
      order?.orderItemsSelected?.forEach(element => {
        arrayOrdered.push(element.product)
      })
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
      message.success('Đặt hàng thành công')
      navigate('/ordersuccess', {
        state: {
          deliveryMethod,
          paymentMethod,
          order: order?.orderItemsSelected,
        }
      })
    } else if (isError) {
      message.error('Thất bại')
    }
  }, [isSuccess, isError])
  const handleAddOrder = () => {
    if (!deliveryMethod) {
      message.error('Vui lòng chọn phương thức giao hàng.');
      return; // Ngăn việc tiếp tục nếu phương thức giao hàng chưa được chọn
    }
    if (user?.access_token && order?.orderItemsSelected && user?.name &&
      user?.address && user?.phone && user?.city && pendingPrice && user?.id) {
      mutationAddOrder.mutate(
        {
          token: user?.access_token,
          orderItems: order?.orderItemsSelected,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: paymentMethod,
          itemsPrice: pendingPrice,
          shippingPrice: deliveryPrice,
          totalPrice: totalPrice,
          user: user?.id
        },

      )
    }
  }
  const calculateTotal = () => {
    const subTotal = order?.orderItems?.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return {
      subTotal,
      discount: 0, // Chưa xử lý giảm giá
      tax: 0, // Chưa xử lý thuế
      shipping: 0, // Phí vận chuyển giả định là 0
      total: subTotal,
    };
  };
  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])
  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        phone: user?.phone,
        address: user?.address
      })
    }
  }, [isOpenModalUpdateInfo])



  const totals = calculateTotal();

  const pendingPrice = order?.orderItemsSelected?.reduce((sum, item) => sum + item.price * item.amount, 0);

  const totalPrice = order?.orderItemsSelected?.reduce((sum, item) => sum + item.price * item.amount, 0) + deliveryPrice;
  console.log('order', order);
  const handleCancelUpdate = () => {
    setIsOpenModalUpdateInfo(false)
  }

  const { isLoading, data } = mutationUpdate
  const handleUpdateInfoUser = () => {
    const { name, address, phone, city } = stateUserDetails
    if (name && address && phone && city) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ ...stateUserDetails, name, address, phone, city }));
            setIsOpenModalUpdateInfo(false);
          },
          onError: (error) => {
            if (error.response?.status === 401) {
              message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            } else {
              message.error("Đã xảy ra lỗi. Vui lòng thử lại.");
            }
          },
        }
      );
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }
  const addPayPalScript = async () => {
    try {
      const { data } = await PaymentService.getConfig(); // Kiểm tra trả về client-id
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://sandbox.paypal.com/sdk/js?client-id=${data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Error loading PayPal SDK:", error);
      alert("Failed to load PayPal SDK. Please try again.");
    }
  };
  useEffect(() => {
    if (!window.paypal) {
      addPayPalScript()
    } else {
      setSdkReady(true)
    }
  })
  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate(
      {
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: paymentMethod,
        itemsPrice: pendingPrice,
        shippingPrice: deliveryPrice,
        totalPrice: totalPrice,
        user: user?.id,
        isPaid: true,
        paidAt: details.update_time
      },

    )
    console.log('paypal', details, data);
  }
  return (
    <div style={{ padding: 15, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Title level={4}>Phương thức thanh toán</Title>
      <Table
        dataSource={order?.orderItemsSelected || []}
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
              <Title style={{ marginTop: '0px' }} level={4}>Chọn phương thức giao hàng</Title>

              <Radio.Group onChange={handleDeliveryChange} value={deliveryMethod}>
                <div style={{ marginBottom: 8 }}>
                  <Radio value="FAST">FAST - Giao hàng nhanh</Radio>
                </div>
                <div>
                  <Radio value="GO_JEK">GO_JEK - Giao hàng tiết kiệm</Radio>
                </div>
              </Radio.Group>
            </Card>

            {/* Chọn phương thức thanh toán */}
            <Card>
              <Title style={{ marginTop: '0px' }} level={4}>Chọn phương thức thanh toán</Title>
              <Radio.Group onChange={handlePaymentChange} value={paymentMethod}>
                <Radio value="COD">Thanh toán khi nhận hàng</Radio>
                <Radio value="paypal">Thanh toán bằng PayPal</Radio>
              </Radio.Group>
            </Card>
          </div>
        </Col>
        <Col style={{ paddingTop: '15px' }} span={8}>
          <div
            style={{
              backgroundColor: '#fff',
              padding: 16,
              borderRadius: 4,
              border: '2px solid #f0f0f0',
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
              <Col span={24}>
                <Text onClick={handleChangeAddress} style={{ color: 'blue', cursor: 'pointer', display: 'block' }}>
                  Thay đổi
                </Text>
              </Col>

            </Row>
            <Title level={5}>Tóm tắt đơn hàng</Title>

            <div style={{ marginBottom: 12 }}>
              <Row justify="space-between">
                <Text>Tạm tính</Text>
                <Text>{convertPrice(pendingPrice)}</Text>
              </Row>
              <Row justify="space-between">
                <Text>Giảm giá</Text>
                <Text>{totals.discount} %</Text>
              </Row>
              <Row justify="space-between">
                <Text>Thuế</Text>
                <Text>{totals.tax} %</Text>
              </Row>
              <Row justify="space-between">
                <Text>Phí giao hàng</Text>
                <Text>{convertPrice(deliveryPrice)}</Text>
              </Row>
            </div>
            <Row justify="space-between">
              <Title level={5}>Tổng tiền</Title>
              <Title level={5} type="danger">
                {convertPrice(totalPrice)}
              </Title>
            </Row>
            {paymentMethod === 'paypal' && sdtReady && (
              <div>
                <PayPalButton
                  amount={parseFloat((totalPrice / 23000).toFixed(2))}
                  onSuccess={onSuccessPaypal}
                  onError={() => {
                    alert('Error')
                  }}
                >
                </PayPalButton>
              </div>
            )}



            {paymentMethod === 'COD' && (
              <Button
                onClick={() => handleAddOrder()}
                type="primary"
                block
                style={{ marginTop: 16, height: 48, backgroundColor: 'red' }}
              >
                Đặt hàng
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <ModalComponent title='Cập nhật thông tin giao hàng' open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser}>

        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          //onFinish={onUpdateUser}
          autoComplete="on"
          form={form}
          initialValues={stateUserDetails}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <InputComponent name="name" value={stateUserDetails.name} onChange={handleOnchangeDetails} />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Please input your phone!',
              },
            ]}
          >
            <InputComponent name="phone" value={stateUserDetails.phone} onChange={handleOnchangeDetails} type="text" />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: 'Please input your address!',
              },
            ]}
          >
            <InputComponent name="address" value={stateUserDetails.address} onChange={handleOnchangeDetails} />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please select your city!' }]}
          >
            <Select
              name="city"
              value={stateUserDetails.city}
              onChange={(value) => setStateUserDetails({ ...stateUserDetails, city: value })}
            >
              {provinces.map((province, index) => (
                <Select.Option key={index} value={province}>
                  {province}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </ModalComponent>
    </div>
  );
};

export default PaymentPage;
