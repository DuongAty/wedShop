import {Row} from "antd"
import styled from "styled-components"
export const WrapperHeader = styled(Row)`
    padding: 10px 120px;
    background-color: #fc6868;
    align-items: center;
    gap:16px;
    flex-wrap:nowrap;
`
export const WrapperTextHeader = styled.span`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    text-align:left;
    font-size:25px;
`
export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap:10px;
    font-size:15px;
    margin-left:20px;
    &:hover{
    text-decoration: underline;
    font-weight: bold;
    }
`
export const WrapperTextHeaderRight = styled.span`
    font-size:12px;
    color:#fff;
    font-weight: bold;
    white-space:nowrap;
    &:hover{
    text-decoration: underline;
    }

`
export const WrapperContentPopUp = styled.p`
    cursor: pointer;
    padding: 7px;
    &:hover {
        background: #fc6868;
        color: #fff;
        border-radius: 8px;
    }
`