import React, { useEffect, useMemo, useState } from 'react';
import { Table, Checkbox, Button, Typography, Row, Col, Input, Tooltip, Form, message, Select } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, WarningOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlice';
import { convertPrice } from '../../untils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import * as UserService from '../../service/UserService'
import { useMutationHooks } from '../../hooks/useMutationHooks';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;

const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [form] = Form.useForm();
  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
  const [stateUser, setStateUser] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  })
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  })

  const handleChangeCount = (type, idProduct) => {
    if (type === 'increase') {
      dispatch(increaseAmount({ idProduct }))
    } else {
      dispatch(decreaseAmount({ idProduct }))
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

  const onDeleteItem = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }))
  };
  const onChange = (e) => {
    const value = e.target.value;
    let updatedListChecked;

    if (listChecked.includes(value)) {
      updatedListChecked = listChecked.filter((item) => item !== value);
    } else {
      updatedListChecked = [...listChecked, value];
    }

    setListChecked(updatedListChecked);
  };
  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked])
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
  const handleCheckAll = (e) => {
    let newListChecked = []
    if (e.target.checked) {
      newListChecked = order?.orderItems?.map((item) => item?.product) || []
      setListChecked(newListChecked)
    } else {
      setListChecked([])
    }
  }
  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }))
    }

  }

  const totals = calculateTotal();
  const columns = [
    {
      title: <Checkbox onChange={handleCheckAll} checked={listChecked?.length === order?.orderItems.length} />,
      dataIndex: 'product',
      align: 'center',
      render: (product, record) => (
        <Checkbox
          value={record.product}
          onChange={onChange}
          checked={listChecked.includes(record.product)}
        />
      ),
    },
    {
      title: `Sản phẩm (${order?.orderItems.length})`,
      dataIndex: 'name',
      align: 'center',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={record.image} alt={name} style={{ width: 50, height: 50, marginRight: 8 }} />
          <span>{name} </span>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      align: 'center',
      render: (price, record) => (
        <>
          <Text strong>{convertPrice(price)}</Text> <br />
          <Text delete>{record.originalPrice}</Text>
        </>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      align: 'center',
      render: (quantity, record) => (
        <>
          <MinusOutlined style={{
            paddingRight: '10px',
            cursor: quantity > 1 ? 'pointer' : 'not-allowed',
            opacity: quantity > 1 ? 1 : 0.5
          }} onClick={() => quantity > 1 && handleChangeCount('decrease', record.product)} />
          <Input
            style={{ width: '50px' }}
            min={1}
            value={quantity}
            readOnly
          />
          <PlusOutlined style={{
            paddingLeft: '10px',
            cursor: quantity < record.countInStock ? 'pointer' : 'not-allowed',
            opacity: quantity < record.countInStock ? 1 : 0.5
          }} onClick={() => quantity < record.countInStock && handleChangeCount('increase', record.product)} />
        </>
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      align: 'center',
      render: (_, record) => (
        <Text type="danger" strong>
          {convertPrice(record.price * record.amount)}
        </Text>
      ),
    },
    {
      title: <Tooltip title={'Xoá mục được chọn'} color='gray'>
        <DeleteOutlined
          style={{ color: 'red', fontSize: '20px' }}
          onClick={handleRemoveAllOrder}
        />
      </Tooltip>,
      dataIndex: 'product',
      align: 'center',
      render: (product, record) => (
        <Tooltip title={'Xoá'} color='gray'>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDeleteItem(record.product)}
          />
        </Tooltip>

      ),
    },
  ];
  const pendingPrice = order?.orderItemsSelected?.reduce((sum, item) => sum + item.price * item.amount, 0);

  const totalPrice = order?.orderItemsSelected?.reduce((sum, item) => sum + item.price * item.amount, 0);
  const handleAddCard = () => {
    if (!order?.orderItemsSelected?.length) {
      message.error('Vui lòng chọn sản phẩm')
    } else if (!user?.phone || !user?.address || !user?.name || !user.city) {
      setIsOpenModalUpdateInfo(true)
    }else{
      navigate('/payment');
    }
  }
  const handleCancelUpdate = () => {
    setIsOpenModalUpdateInfo(false)
  }
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
  const handleChangeAddress =()=>{
    setIsOpenModalUpdateInfo(true)
  }
  console.log('stateUserDetails', stateUserDetails);
  return (
    <div style={{ padding: 24, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Title level={4}>Giỏ hàng</Title>
      <Row gutter={16}>
        <Col span={16}>
          <Table
            columns={columns}
            dataSource={order?.orderItems}
            rowKey="product"
            pagination={false}
            bordered
          />
        </Col>
        <Col span={8}>
          <div
            style={{
              backgroundColor: '#fff',
              padding: 16,
              borderRadius: 4,
              border: '1px solid #f0f0f0',
            }}
          >
            <Row justify="space-between">
              <Text>Địa chỉ</Text>
              <Text style={{fontWeight:'bold'}}>{`${user?.address}, ${user?.city}`}</Text>
              <Text onClick={handleChangeAddress} style={{color: 'blue', cursor:'pointer'}}>Thay đổi</Text>
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
            </div>
            <Row justify="space-between">
              <Title level={5}>Tổng tiền</Title>
              <Title level={5} type="danger">
                {convertPrice(totalPrice)}
              </Title>
            </Row>
            <Button
              onClick={() => handleAddCard()}
              type="primary"
              block
              style={{ marginTop: 16, height: 48, backgroundColor: 'red' }}
            >
              Mua hàng
            </Button>
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
            <InputComponent name="phone" value={stateUserDetails.phone} onChange={handleOnchangeDetails} />
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

export default OrderPage;
