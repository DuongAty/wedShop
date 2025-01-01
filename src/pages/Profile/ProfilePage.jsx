import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUpLoadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import { Button, Upload } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../service/UserService'
import { useMutationHooks } from '../../hooks/useMutationHooks'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import {UploadOutlined } from '@ant-design/icons';
import  {getBase64} from '../../untils'

const ProfilePage = () => {
    const user = useSelector(state => state.user)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const dispatch = useDispatch()
    const mutation = useMutationHooks(
        (data) => {
            const {id,access_token,...rests} = data
            UserService.updateUser(id, rests, access_token)
        }
      )
      const {data, isSuccess, isError} = mutation
      console.log('data',data)
    useEffect(()=>{
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    },[user])
    useEffect(()=>{
        if(isSuccess){
            message.success()
            handleGetDetailsUser(user?.id, user?.access_token)
            
        }else if(isError){
            message.error()
        }
    },isSuccess,isError)
    const handleOnchangeEmail = (value)=>{
        setEmail(value)
    }
    const handleOnchangeName = (value)=>{
        setName(value)
    }
    const handleOnchangePhone = (value)=>{
        setPhone(value)
    }
    const handleOnchangeAddress = (value)=>{
        setAddress(value)
    }
    
    const handleOnchangeAvatar = async ({fileList}) => {
        if (fileList.length > 0) {
            const file = fileList[0];
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            setAvatar(file.preview);
            
        } 
    }
    
    
    
    const handleUpdate=()=>{
        mutation.mutate({id: user?.id, email,name,phone,address,avatar,access_token: user?.access_token})
        window.location.reload();
    }
    const handleGetDetailsUser = async (id,token)=>{
        const res = await UserService.getDetailsUser(id,token)
        dispatch(updateUser({...res?.data, access_token: token }))
      }
  return (
    <div style={{width:'1440px', margin:'0 auto'}}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <WrapperContentProfile>
        <WrapperInput>
            <WrapperLabel htmlFor= "name" >Họ Tên</WrapperLabel>
            <InputForm style={{width:'300px', marginBottom:'30px' }} placeholder ="Nhập Tên" id="name" value={name} onChange = {handleOnchangeName}/>

        </WrapperInput>
        <WrapperInput>
            <WrapperLabel  htmlFor= "email" >Email</WrapperLabel>
            <InputForm style={{width:'300px', marginBottom:'30px'}} placeholder ="Nhập Email" id="email" value={email} onChange = {handleOnchangeEmail}/>

        </WrapperInput>
        <WrapperInput>
            <WrapperLabel htmlFor= "phone" >SDT</WrapperLabel>
            <InputForm style={{width:'300px', marginBottom:'30px'}} placeholder ="Nhập SDT" id="phone" value={phone} onChange = {handleOnchangePhone}/>

        </WrapperInput>
        <WrapperInput>
            <WrapperLabel htmlFor= "address" >Địa Chỉ</WrapperLabel>
            <InputForm style={{width:'300px', marginBottom:'30px'}} placeholder ="Nhập địa chỉ" id="address" value={address} onChange = {handleOnchangeAddress}/>
            
        </WrapperInput>
        <WrapperInput>
            <WrapperLabel htmlFor= "avatar" >Avatar</WrapperLabel>
            <WrapperUpLoadFile showUploadList={false} onChange = {handleOnchangeAvatar} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload</Button>
            </WrapperUpLoadFile >
            {avatar && (
                <img src = {avatar} style={{
                    height:'60px',
                    width:'60px',
                    borderRadius:'50%',
                    objectFit:'cover'
                }}/>
            )}
            {/* <InputForm style={{width:'300px'}} placeholder ="" id="avatar" value={avatar} onChange = {handleOnchangeAvatar}/> */}
            <Button
                    onClick={handleUpdate}
                    style={{
                    backgroundColor:'red',
                    height:'32px',
                    width:'100px', 
                    border:'none',
                    color:'white',
                    fontWeight:'700',
                    margin:'29px 0 25px'
                    }}> Cập Nhật
            </Button>
        </WrapperInput>
        
      </WrapperContentProfile>
    </div>
  )
}

export default ProfilePage
