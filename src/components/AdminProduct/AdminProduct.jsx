import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Input, Modal, Select, Space, Tooltip } from 'antd'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { WrapperUpLoadFile } from '../../pages/Profile/style'
import { getBase64, renderOption } from '../../untils'
import * as ProductService from '../../service/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHooks'
import Loading from '../LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import { isPending } from '@reduxjs/toolkit'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isPendingUpdated, setIsPendingUpdate] = useState(false)
  const user = useSelector((state) => state?.user)
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
  const [typeSelect, setTypeSelelct] = useState('')

  const [stateProduct, setStateProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    type: '',
    countInStock: ''
  })
  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    type: '',
    countInStock: ''
  })
  const [rowSelected, setRowSelected] = useState('')
  const mutation = useMutationHooks(
    (data) => {
      const {
        name,
        price,
        description,
        image,
        type,
        countInStock } = data
      const res = ProductService.createProduct({
        name,
        price,
        description,
        image,
        type,
        countInStock
      })
      return res
    }
  )
  const mutationUpdate = useMutationHooks(
    (data) => {
      const {
        id,
        token,
        ...rests
      } = data
      const res = ProductService.updateProduct(
        id,
        token,
        { ...rests },
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
      const res = ProductService.deleteProduct(
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
      const res = ProductService.deleteManyProduct(
        ids,
        token
      )
      return res
    }
  )
  const handleDeleteManyProduct = (ids) => {
    mutationDeletemany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })

  }
  const { data, isPending, isSuccess, isError } = mutation
  const { data: dataUpdated, isPending: isPendingUpdate, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isPending: isPendingDelete, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
  const { data: dataDeletedMany, isPending: isPendingDeleteMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletemany



  const [form] = Form.useForm();

  useEffect(() => {
    if (isSuccessDeletedMany && data?.status === 'Ok') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDeletedMany])
  useEffect(() => {
    if (isSuccess && data?.status === 'Ok') {
      message.success()
      handleCancel()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess])
  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === 'OK') {
      message.success()
      handleDeleteCancel()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDeleted])
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCancel()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])
  const handleOnchangeAvatar = async ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setStateProduct({
        ...stateProduct,
        image: file.preview
      })

    }
  }
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }
  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setStateProductDetails({
        ...stateProductDetails,
        image: file.preview
      })

    }
  }

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct('',100);
    return res
  };
  const { data: products, isPending: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts
  })
  const queryProduct = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts
  })
  const typeProduct = useQuery({
    queryKey: ['type-products'],
    queryFn: fetchAllTypeProduct
  })

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected)
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock
      })
    }
    setIsPendingUpdate(false)
  }

  useEffect(() => {
    form.setFieldsValue(stateProductDetails)
  }, [form, stateProductDetails])
  useEffect(() => {
    if (rowSelected) {
      setIsPendingUpdate(true)

      fetchGetDetailsProduct(rowSelected)
    }
  }, [rowSelected])
  const handleDetailsProduct = () => {
    setIsModalEditOpen(true)
    console.log("RowSelect", rowSelected);
  }
  const renderAction = () => {
    return (
      <div>
        <Tooltip title={'Xoá'} color='gray'>
          <DeleteOutlined
            style={{ marginRight: '10px', color: 'red', fontSize: '20px', cursor: 'pointer' }}
            onClick={() => setIsModalDeleteOpen(true)}
          />
        </Tooltip>
        <Tooltip title={'Chỉnh sửa'} color='gray'>
          <EditOutlined style={{ color: 'blue', fontSize: '20px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
        </Tooltip>
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
  const types = [...new Set(products?.data.map(product => product.type))];
  const typeFilters = types.map(type => ({
    text: type,  // Display name for the filter
    value: type,  // Value to filter by
  }));
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
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%',
      render: (text) => <a>{text}</a>,
      // sorter:(a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,

      width: '15%',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '8%',
      filters: typeFilters,
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Count In Stock',
      dataIndex: 'countInStock',
      width: '10%'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction,
    },
  ];
  const dataTable = products?.data?.length > 0
    && products?.data?.map((product) => {
      return { ...product, key: product._id };
    })
  const handleCancel = () => {
    setIsModalOpen(false);
  }
  const handleEditCancel = () => {
    setIsModalEditOpen(false);

  }
  const handleDeleteCancel = () => {
    setIsModalDeleteOpen(false)
  }
  const handleDeleteProduct = () => {
    mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
    setIsModalDeleteOpen(false);
  }
  const onFinish = () => {
    mutation.mutate(stateProduct, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
    setIsModalEditOpen(false);
  }
  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }
  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }
  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
    setIsModalEditOpen(false)
  }
  const handleChangeSelect = (value) => {

    if (value !== 'add_type') {
      setStateProduct({
        ...stateProduct,
        type: value
      })
    } else {
      setTypeSelelct(value)
    }

  }
  return (
    <div>
      <WrapperHeader>Quản Lý Sản Phẩm</WrapperHeader>
      <div>
        <Button style={{ height: '50px', width: '150px', marginTop: '10px' }} onClick={() => setIsModalOpen(true)}><PlusCircleOutlined style={{ fontSize: '20px' }} /> Thêm Sản Phẩm</Button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <TableComponent handleDeleteMany={handleDeleteManyProduct} columns={columns} isPending={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setRowSelected(record._id)
            },
          };
        }} />
      </div>

      <ModalComponent forceRender title="Thêm mới sản phẩm" open={isModalOpen} onCancel={handleCancel} onOk={onFinish} footer={null}>
        <Loading isPending={mutation.isPending} >
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
            onFinish={onFinish}
            autoComplete="on"
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
              <InputComponent name="name" value={stateProduct.name} onChange={handleOnchange} />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: 'Please input your type!',
                },
              ]}
            >
              <Select
                name="type"
                // defaultValue="lucy"
                // style={{
                //   width: 120,
                // }}
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOption(typeProduct?.data?.data)}
              />
              {typeSelect === 'add_type' && (
                <InputComponent name="type" value={stateProduct.type} onChange={handleOnchange} />
              )}
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Please input your price!',
                },
              ]}
            >
              <InputComponent name="price" value={stateProduct.price} onChange={handleOnchange} />
            </Form.Item>
            <Form.Item
              label="Count In Stock"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: 'Please input your count in stock!',
                },
              ]}
            >
              <InputComponent name="countInStock" value={stateProduct.countInStock} onChange={handleOnchange} />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Please input your description!',
                },
              ]}
            >
              <Input.TextArea
                name="description"
                value={stateProduct.description}
                onChange={handleOnchange}
                autoSize={{ minRows: 4, maxRows: 4 }}
                style={{
                  resize: 'none', // Vô hiệu hóa khả năng thay đổi kích thước thủ công
                  overflowY: 'auto', // Hiển thị thanh cuộn nếu nội dung vượt quá chiều cao
                }}
              />

            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  required: true,
                  message: 'Please upload your image!',
                },
              ]}
            >
              <WrapperUpLoadFile showUploadList={false} onChange={handleOnchangeAvatar} maxCount={1}>
                <Button>Upload</Button>
                {stateProduct?.image && (
                  <img src={stateProduct?.image} style={{
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
      <ModalComponent forceRender title='Chi tiết sản phẩm' open={isModalEditOpen} onCancel={handleEditCancel} onOk={onUpdateProduct}>
        <Loading isPending={isPendingUpdated} >
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
            autoComplete="off"
            form={form}
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
              <InputComponent name="name" value={stateProductDetails.name} onChange={handleOnchangeDetails} />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: 'Please input your type!',
                },
              ]}
            >
              <InputComponent name="type" value={stateProductDetails.type} onChange={handleOnchangeDetails} />
            </Form.Item>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Please input your price!',
                },
              ]}
            >
              <InputComponent name="price" value={stateProductDetails.price} onChange={handleOnchangeDetails} />
            </Form.Item>
            <Form.Item
              label="Count In Stock"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: 'Please input your count in stock!',
                },
              ]}
            >
              <InputComponent name="countInStock" value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Please input your description!',
                },
              ]}
            >
              <Input.TextArea
                name="description"
                value={stateProductDetails.description}
                onChange={handleOnchangeDetails}
                autoSize={{ minRows: 4, maxRows: 4 }}
                style={{
                  resize: 'none', // Vô hiệu hóa khả năng thay đổi kích thước thủ công
                  overflowY: 'auto', // Hiển thị thanh cuộn nếu nội dung vượt quá chiều cao
                }}
              />

            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  required: true,
                  message: 'Please upload your image!',
                },
              ]}
            >
              <WrapperUpLoadFile showUploadList={false} onChange={handleOnchangeAvatarDetails} maxCount={1}>
                <Button>Upload</Button>
                {stateProductDetails?.image && (
                  <img src={stateProductDetails?.image} style={{
                    height: '60px',
                    width: '60px',
                    objectFit: 'cover',
                    marginLeft: '20px'
                  }} />
                )}
              </WrapperUpLoadFile >
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <ModalComponent title='Xoá sản phẩm' open={isModalDeleteOpen} onCancel={handleDeleteCancel} onOk={handleDeleteProduct}>
        <Loading isPending={isPendingDelete} >
          <div><WarningOutlined style={{ color: 'red', fontSize: '30px' }} /> Bạn muốn xoá sản phẩm này ?</div>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminProduct     