import React, { useState, useEffect } from 'react'
import { Col, Badge, Popover } from 'antd';
import { WrapperHeader, WrapperTextHeader, WrapperHeaderAccount, WrapperTextHeaderRight, WrapperContentPopUp } from './style';
import {
  UserOutlined,
  CaretDownOutlined,
  ShopOutlined,
  SettingOutlined,
  LogoutOutlined,
  HomeOutlined,
  ShoppingCartOutlined,

} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../service/UserService'
import { resetUser } from '../../redux/slides/userSlide';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slides/productSlice';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const order = useSelector((state) => state.order)
  const user = useSelector(state => state.user)
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  const handleNavigateMain = () => {
    navigate('/')
  }
  const handleLogout = async () => {
    setIsLoading(true)
    await UserService.logoutUser()
    localStorage.removeItem('access_token');
    dispatch(resetUser())
    setIsLoading(false)
    navigate('/')

  }
  useEffect(() => {
    setIsLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setIsLoading(false)

  }, [user?.name, user?.avatar])
  const handleClickNavigate = (type) => {
    switch (type) {
      case 'profile':
        navigate('/profile-user');
        break;
      case 'admin':
        navigate('/system/admin');
        break;
      case 'my-order':
        navigate('/my-order', {
          state: {
            id: user?.id,
            token: user?.access_token
          }

        });
        break;
      default:
        handleLogout();
        break;
    }
    setIsOpenPopup(false);
  };
  const content = (
    <div>
      <WrapperContentPopUp onClick={() => handleClickNavigate('profile')}><UserOutlined /> Thông tin người dùng</WrapperContentPopUp>
      <WrapperContentPopUp onClick={() => handleClickNavigate(`my-order`)}><ShoppingCartOutlined /> Đơn hàng của tôi </WrapperContentPopUp>
      {user.isAdmin && (
        <WrapperContentPopUp onClick={() => handleClickNavigate('admin')}><SettingOutlined /> Quản lý hệ thông</WrapperContentPopUp>
      )}

      <WrapperContentPopUp onClick={() => handleClickNavigate()} ><LogoutOutlined /> Đăng xuất</WrapperContentPopUp>
    </div>
  );

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }
  return (
    <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
      <Col span={5}>
        <WrapperTextHeader style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }} >
          <div style={{ cursor: "pointer" }} onClick={handleNavigateMain}>ATY Shop</div>
          <HomeOutlined style={{ cursor: "pointer" }} onClick={handleNavigateMain} />

        </WrapperTextHeader>
      </Col>
      {!isHiddenSearch && (
        <Col span={13}>

          <ButtonInputSearch
            size="large"
            placeholder="Input text search"
            textButton=""
            bodered={false}
            onChange={onSearch} />

        </Col>
      )}
      <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
        <Loading isPending={isLoading}>
          <WrapperHeaderAccount>
            {userAvatar ? (
              <img src={userAvatar} alt="avatar" style={{
                height: '50px',
                width: '50px',
                borderRadius: '50%',
                objectFit: 'cover'
              }} />
            ) : (
              <UserOutlined style={{ fontSize: '30px' }} />
            )}

            {user?.access_token ? (
              <>
                <Popover content={content} trigger="click" style={{ float: 'right' }} open={isOpenPopup}>
                  <div style={{ cursor: "pointer" }} onClick={() => setIsOpenPopup((prev) => !prev)} >{userName?.length ? userName : user?.email}</div>
                </Popover>
              </>
            ) : (
              <div onClick={handleNavigateLogin} style={{ cursor: "pointer" }}>
                <WrapperTextHeaderRight>Đăng kí/Đăng nhập</WrapperTextHeaderRight>
                <div>
                  <WrapperTextHeaderRight>Tài khoản</WrapperTextHeaderRight>
                  <CaretDownOutlined />
                </div>
              </div>
            )}

          </WrapperHeaderAccount>
        </Loading>
        {!isHiddenCart && (

          <div onClick={() => navigate('/order')} style={{ cursor: "pointer" }} >
            <Badge count={order?.orderItems?.length} size='small'><ShopOutlined style={{ fontSize: '36px', color: '#fff' }} /></Badge>
            <WrapperTextHeaderRight onClick={() => navigate('/order')} style={{ cursor: "pointer" }} >Giỏ hàng</WrapperTextHeaderRight>
          </div>
        )}

      </Col>
    </WrapperHeader>
  )
}

export default HeaderComponent
