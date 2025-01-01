import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Select, Space } from 'antd'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import Loading from '../LoadingComponent/Loading'
import { WrapperUpLoadFile } from '../../pages/Profile/style'
import { getBase64 } from '../../untils'
import { useQuery } from '@tanstack/react-query'
import { useMutationHooks } from '../../hooks/useMutationHooks'
import * as message from '../../components/Message/Message'
import { useSelector } from 'react-redux'
import * as UserService from '../../service/UserService'


const AdminUser = () => {
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isPendingUpdated, setIsPendingUpdate] = useState(false)
  const user = useSelector((state) => state?.user)
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
  const [stateUser, setStateUser] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
    address: '',
  })
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
    address: '',
    avatar: ''
  })
  const [rowSelected, setRowSelected] = useState('')

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
  const mutationDelete = useMutationHooks(
    (data) => {
      const {
        id,
        token
      } = data
      const res = UserService.deleteUser(
        id,
        token
      )
      return res
    }

  )
  const mutationDeletemany = useMutationHooks(
    (data) => {
      const {
        token, ...ids
      } = data
      const res = UserService.deleteManyUser(
        ids,
        token
      )
      return res
    }
  )
  const handleDeleteManyUser = (ids) => {
    mutationDeletemany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })

  }
  const { data: dataUpdated, isPending: isPendingUpdate, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isPending: isPendingDelete, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
  const { data: dataDeletedMany, isPending: isPendingDeleteMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletemany



  const [form] = Form.useForm();
  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'OK') {
      message.success()
      handleDeleteCancel()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDeleted])
  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDeletedMany])
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setStateUserDetails({
        ...stateUserDetails,
        avatar: file.preview
      })

    }
  }

  const getAllUsers = async () => {
    const res = await UserService.getAllUser()
    console.log('res', res);
    return res
  };
  const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
  const { data: users, isPending: isLoadingUsers } = queryUser

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected)
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        address: res?.data?.address,
        isAdmin: res?.data?.isAdmin,
        avatar: res?.data?.avatar,
      })
    }
    setIsPendingUpdate(false)
  }
  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])
  useEffect(() => {
    if (rowSelected) {
      setIsPendingUpdate(true)

      fetchGetDetailsUser(rowSelected)
    }
  }, [rowSelected])
  const handleDetailsUser = () => {
    setIsModalEditOpen(true)

  }
  const renderAction = () => {

    return (
      <div>
        <DeleteOutlined style={{ marginRight: '10px', color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsModalDeleteOpen(true)} />
        <EditOutlined style={{ color: 'blue', fontSize: '20px', cursor: 'pointer' }} onClick={handleDetailsUser} />
      </div>
    )
  }
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',

          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,

            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button style={{ color: 'red' }}
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });
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
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      // sorter:(a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text) => <a>{text}</a>,
      // sorter:(a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('email')
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',

    },
    {
      title: 'Address',
      dataIndex: 'address',
      render: (text) => <a>{text}</a>,
      ...getColumnSearchProps('address')

    },
    {
      title: 'City',
      dataIndex: 'city',
      render: (text) => <a>{text}</a>,

    },

    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction,
    },
  ];
  const dataTable = users?.data?.length > 0
    && users?.data?.map((user) => {
      return { ...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE' };
    })

  const handleEditCancel = () => {
    setIsModalEditOpen(false);

  }
  const handleDeleteCancel = () => {
    setIsModalDeleteOpen(false)
  }
  const handleDeleteUser = () => {
    if (stateUserDetails.isAdmin) {
      message.error('Không xoá được người dùng này')
    } else {
      mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
        onSettled: () => {
          queryUser.refetch()
        }
      })
      setIsModalDeleteOpen(false)
    }
  }

  const handleOnchange = (e) => {
    setStateUser({
      ...stateUser,
      [e.target.name]: e.target.value
    })
  }
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  const onUpdateUser = (values) => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...values }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
    setIsModalEditOpen(false);
  }
  return (
    <div>
      <WrapperHeader>Quản Lý Người Dùng</WrapperHeader>
      <div style={{ marginTop: '10px' }}>
        <TableComponent handleDeleteMany={handleDeleteManyUser} columns={columns} isPending={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id)
            },
          };
        }} />
      </div>
      <ModalComponent forceRender title='Chi tiết người dùng' open={isModalEditOpen} onCancel={handleEditCancel} footer={null}>
        <Loading isPending={isPendingUpdate} >
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
            onFinish={onUpdateUser}
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
              <InputComponent name="name" value={stateUserDetails.name} onChange={handleOnchange} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <InputComponent name="email" value={stateUserDetails.email} onChange={handleOnchange} />
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
              <InputComponent name="phone" value={stateUserDetails.phone} onChange={handleOnchange} type="text" />
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
              <InputComponent name="address" value={stateUserDetails.address} onChange={handleOnchange} />
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
            <Form.Item
              label="Avatar"
              name="avatar"
            >
              <WrapperUpLoadFile showUploadList={false} onChange={handleOnchangeAvatarDetails} maxCount={1}>
                <Button>Upload</Button>
                {stateUserDetails?.avatar && (
                  <img src={stateUserDetails?.avatar} style={{
                    height: '60px',
                    width: '60px',
                    objectFit: 'cover',
                    marginLeft: '20px'
                  }} />
                )}
              </WrapperUpLoadFile >
            </Form.Item>
            <Form.Item

              label={null}>
              <Button type="primary" htmlType="submit" style={{
                float: 'right'
              }}>
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <ModalComponent title='Xoá người dùng' open={isModalDeleteOpen} onCancel={handleDeleteCancel} onOk={handleDeleteUser}>
        <Loading isPending={isPendingDelete} >
          <div><WarningOutlined style={{ color: 'red', fontSize: '30px' }} /> Bạn muốn xoá tài khoản này ?</div>
        </Loading>
      </ModalComponent>
    </div>

  )
}

export default AdminUser