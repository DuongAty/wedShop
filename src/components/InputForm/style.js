import styled from "styled-components"
import { Input } from 'antd';

export const WrapperInputStyle = styled(Input)`
    border-top:none;
    border-right:none;
    border-left:none;
    outline: none;
    &:focus {
        background-color: rgb(230 240 255);
    }
`