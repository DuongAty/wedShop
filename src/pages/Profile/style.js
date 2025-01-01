import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
    color: #000;
    font-size: 18px;
    margin: 4px 0;
`
export const WrapperContentProfile = styled.div`
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #ccc;
    width: 700px;
    margin: 0 auto;
    padding:20px;
    border-radius:20px;
    justify-content: center;
    `
export const WrapperLabel = styled.label`
    color: #000;
    font-size:12px;
    line-height:30px;
    font-weight:600;
    width:50px;
    text-align:left;
`
export const WrapperInput = styled.div`
    display: flex;
    align-items:center;
    gap:20px;

`
export const WrapperUpLoadFile = styled(Upload)`
    &.ant-upload.ant-upload-select.ant-upload-select-picture-card {
        height: 60px;
        width: 60px;
        border-radius: 50%;
    }
    
`;
