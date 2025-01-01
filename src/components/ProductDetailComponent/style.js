import styled from "styled-components"
import {Image,Col,Input} from "antd"
export const WrapperStyleImageSmall = styled(Image)`
    height: 62px;
    width: 62px;
`
export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;
`
export const WrapperStyleNameProduct = styled.h1`
    color: rgb(35,25,25);
    font-size: 24px;
    font-weight:300;
    line-height:32px;
    word-break: break-word;
`
export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 25px;
    color: rgb(120, 120, 120);
`
export const WrapperPriceProduct = styled.div`
    background: rgb(250, 250, 250);
    border-radius:4px;

`
export const WrapperPriceTextProduct = styled.h1`
font-weight: 500;
font-size: 25px;
line-height:16px;
color: red; 
padding: 10px;
margin-top:10px;
`
export const WrapperAddressPriceProduct = styled.div`
span.address {
    text-decoration: underline;
    font-size: 15px;
    line-height: 24px;
    font-weight:500;
    white-space: nowrap;
    over-flow: hidden;
    text-overflow: ellipsisl;
};
span.changeAddress {
    color: blue;
    font- size:16px;
    line-height: 24px;
    font-weight:500;
}
`
export const WrapperQualityProduct = styled.div`
    display:flex;
    gap: 4px;
    border-radius: 4px;
    align-items: center;
    width: 120px;
    border: 1px solid #ccc
`
export const WrapperBtnQualityProduct = styled.button`
    border: none;
    background: transparent;
`
export const WrapperInputNumber = styled(Input)`
&.ant-input-number.ant-input-number-sm{
    width: 70px;
    border-top: none;
    border-bottom: none;

}   
`
