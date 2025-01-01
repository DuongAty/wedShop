import React, { useEffect, useState } from 'react'
import InputForm from '../../components/InputForm/InputForm'
import {Button, Image } from 'antd'
import imageLogo from'../../access/image/bannersign.png'
import {EyeFilled, EyeInvisibleFilled} from '@ant-design/icons';
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../service/UserService'
import { useMutationHooks } from '../../hooks/useMutationHooks';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'

const SignUpPage = () => {
  const navigate = useNavigate()
  const [isShowPassWord, setisShowPassWord] = useState(false)
  const [isShowConfirmPassWord, setisShowConfirmPassWord] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  
  const handleOnchangeEmail =(value)=>{
    setEmail(value)
  }
  const handleOnchangePassword =(value)=>{
    setPassword(value)
  }
  const handleOnchangeConfirmPassword =(value)=>{
    setConfirmPassword(value)
  }
  const mutation = useMutationHooks(
    data => UserService.signupUser(data)
  )
  const {data,isPending, isSuccess,isError} = mutation
  useEffect(()=>{
    if(isSuccess && data?.status !== 'ERR'){
      message.success()
      handleNavigateSignIn()
    }else if(isError){
      message.error()
    }
  },[isSuccess,isError])
  const handleNavigateSignIn = ()=>{
    navigate('/sign-in')
  }
  const handleSignUp =()=>{
    
    mutation.mutate({email, password,confirmPassword})
  }
  const handleNavigateMain = ()=>{
    navigate('/')
  }
  
  
  
  
  
  return (
    <div style={{display:'flex',alignItems:'center', justifyContent:'center',height:"100vh"}}>
      <div style={{width:'800px',height:'445px', borderRadius:'5px', backgroundColor:'#FFFAF0',display:'flex'}}>
      <WrapperContainerLeft>
        <h1>Xin Chào</h1>
        <p>Đăng nhập và tạo tài khoản</p>
        <InputForm style={{ marginBottom:'10px' }}placeholder ="Nhập Email" value={email} onChange = {handleOnchangeEmail} />
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
          <InputForm style={{ marginBottom:'10px' }} placeholder ="Nhập Mật khẩu" type ={isShowPassWord ? "text" : "password"}
          value={password} onChange = {handleOnchangePassword} />
        </div>
        <div style={{ position:'relative'}}>
          <span
          onClick={()=>setisShowConfirmPassWord(!isShowConfirmPassWord)} 
          style={{
            zIndex:10,
            position:'absolute',
            top:'8px',
            right:'8px'
          }}>{
            isShowConfirmPassWord ? (
              <EyeFilled />
            ) : (
              <EyeInvisibleFilled />
            )
          }
          </span>
          <InputForm style={{ marginBottom:'10px' }} placeholder ="Nhập Lại Mật khẩu" type ={isShowConfirmPassWord ? "text" : "password"}
          value={confirmPassword} onChange = {handleOnchangeConfirmPassword} />
        </div>
        {data?.status === 'ERR' && <span style={{color:'red', marginTop:"5px"}}>{data?.message}</span>}
        <Loading isPending={mutation.isPending}>
        <Button 
        disabled={!email.length || !password.length ||!confirmPassword.length}
        
        onClick={handleSignUp}
        style={{
            backgroundColor:'red',
            height:'40px',
            width:'100%', 
            border:'none',
            color:'white',
            fontWeight:'700',
            margin:'30px 0 10px'
            }}>Đăng Ký</Button>
            </Loading>
          <p>Đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}>Đăng nhập </WrapperTextLight></p> 
      </WrapperContainerLeft>
      <WrapperContainerRight>
        <Image src={imageLogo} preview ={false} alt="image-logo" height='402px' width='300px' />
        <h4 onClick={handleNavigateMain} style={{fontSize:'15px', margin:'auto' , cursor:'pointer'}}>Mua sắm tại ATY Shop</h4>
      </WrapperContainerRight>
    </div>
    </div>
  )
}

export default SignUpPage
