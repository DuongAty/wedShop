import React, { useEffect } from 'react'
import InputForm from '../../components/InputForm/InputForm'
import {Button, Image } from 'antd'
import imageLogo from'../../access/image/bannersign.png'
import {EyeFilled, EyeInvisibleFilled} from '@ant-design/icons';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import * as UserService from '../../service/UserService'
import { useMutationHooks } from '../../hooks/useMutationHooks';
import Loading from '../../components/LoadingComponent/Loading';
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slides/userSlide';
import * as message from '../../components/Message/Message'

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isShowPassWord, setisShowPassWord] = useState(false)
  
  
  const handleNavigateSignUp = ()=>{
    navigate('/sign-up')
  }
  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
  const handleNavigateMain = ()=>{
    navigate('/')
  }
  
  const {data, isPending, isSuccess,isError} = mutation
  useEffect(()=>{
    if(isSuccess && data?.status !== 'ERR'){
      if(location?.state){
        navigate(location?.state)
      }else{

        navigate('/')
      }
      localStorage.setItem('access_token',JSON.stringify(data?.access_token))
      
      if(data?.access_token){
        const decoded = jwtDecode(data?.access_token)
        if(decoded?.id){
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }

    }else if(isError){
      message.error()
    }
    
  },[isSuccess,isError])
  
  const handleOnchangeEmail =(value)=>{
    setEmail(value)
  }
  const handleOnchangePassword =(value)=>{
    setPassword(value)
  }
  const handleSignIn =()=>{
    mutation.mutate({email,password})
    console.log('signin', email, password)
  }
  const handleGetDetailsUser = async (id,token)=>{
    const res = await UserService.getDetailsUser(id,token)
    dispatch(updateUser({...res?.data, access_token: token }))
  }
  return (
    <div style={{display:'flex',alignItems:'center', justifyContent:'center',height:"100vh"}}>
      <div style={{width:'800px',height:'445px', borderRadius:'5px', backgroundColor:'#FFFAF0',display:'flex'}}>
      <WrapperContainerLeft>
        <h1>Xin Chào</h1>
        <p>Đăng nhập và tạo tài khoản</p>
        <InputForm style={{ marginBottom:'10px' }}placeholder ="Nhập Email" value={email} onChange = {handleOnchangeEmail}/>
        <div style={{ position:'relative'}}>
          <span 
          onClick={()=>setisShowPassWord(!isShowPassWord)}
          style={{
            zIndex:10,
            position:'absolute',
            top:'8px',
            right:'8px'
          }}>{
            isShowPassWord ? (
              <EyeFilled />
            ) : (
              <EyeInvisibleFilled />
            )
          }
          </span>
          <InputForm placeholder ="Nhập Mật khẩu" type ={isShowPassWord ? "text" : "password"}
          value={password} onChange = {handleOnchangePassword} />
        </div>
        {data?.status==='ERR' && <span style={{color:'red', marginTop:"5px"}}>{data?.message}</span>}
        <Loading isPending={mutation.isPending}>
        <Button
        disabled={!email.length || !password.length}
        onClick={handleSignIn}
         style={{
            backgroundColor:'red',
            height:'40px',
            width:'100%', 
            border:'none',
            color:'white',
            fontWeight:'700',
            margin:'30px 0 10px'
            }}>Đăng Nhập</Button>
            </Loading>
          <p><WrapperTextLight>Quên mật khẩu </WrapperTextLight></p> 
          <p>Bạn chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản </WrapperTextLight></p> 
      </WrapperContainerLeft>
      <WrapperContainerRight>
        <Image src={imageLogo} preview ={false} alt="image-logo" height='402px' width='300px' />
        <h4 onClick={handleNavigateMain} style={{fontSize:'15px', margin:'auto' , cursor:'pointer'}}>Mua sắm tại ATY Shop</h4>
      </WrapperContainerRight>
    </div>
    </div>
  )
}
export default SignInPage
