import styled from "styled-components"
import { Card, } from 'antd';
export const WrapperCardStyle =styled(Card)`
width:200px;
& img{
    height:200px;
    width:200px
},
position: relative;
background-color: ${props => props.disable ? '#ccc': '#fff'};
cursor: ${props => props.disable ? 'not-allowed': 'pointer'}
`
export const StyleName = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height:16px;
    color: rgb(55, 55,60);
    font-weight: bold;
`
export const WrapperReportTest = styled.div`
    font-size:11px;
    color:rgb(132, 132,137);
    display:flex;
    align-items:center;
    margin: 6px 0 ;
`
export const WrapperPriceText = styled.div`
font-weight: 500;
font-size: 16px;
line-height:16px;
color: red;

`
export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 25px;
    color: rgb(120, 120, 120);
`