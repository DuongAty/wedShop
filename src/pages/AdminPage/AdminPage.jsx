import { Menu } from "antd";
import React, { useState } from "react";
import { AppstoreOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import HeaderComponent from "../../components/HeaderComponents/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import TestComponent from "../../components/TestComponent/TestComponent";
const AdminPage = ()=>{
    const items = [
        {
          key: 'user',
          icon: <UserOutlined />,
          label: 'Người dùng',
         
        },
        {
          key: 'product',
          icon: <AppstoreOutlined />,
          label: 'Sản phẩm',
        
        },
        {
          key: 'other',
          icon: <SettingOutlined />,
          label: 'Navigation Three',
          
        },
      ];
      const getLevelKeys = (items1) => {
        const key = {};
        const func = (items2, level = 1) => {
          items2.forEach((item) => {
            if (item.key) {
              key[item.key] = level;
            }
            if (item.children) {
              func(item.children, level + 1);
            }
          });
        };
        func(items1);
        return key;
      };
    const levelKeys = getLevelKeys(items);
    const [KeySelected, setKeySelected] = useState('')

    const renderPage =(key)=>{
      switch (key) {
        case 'user':
          return(<AdminUser/>)
        case 'product':
          return(<AdminProduct/>)
          case 'product':
            return(<TestComponent/>)
        default:
          return<></>
      }
    }
    const handleOnclick = ({item, key, keyPath, domEvent})=>{
        setKeySelected(key)
    }
    console.log("key",KeySelected);
    return(
        <>
    <HeaderComponent isHiddenSearch isHiddenCart />
    <div style={{display: "flex"}} > 
    <Menu
      mode="inline"
      defaultSelectedKeys={['231']}
      style={{
        width: 256,
        height: '100vh',
      }}
      items={items}
      onClick={handleOnclick}
    />
        <div style={{padding:'15px'}}>
        {renderPage(KeySelected)}
        </div>
    </div>
    </>
    )
}
export default AdminPage