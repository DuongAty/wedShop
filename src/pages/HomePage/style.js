import styled from "styled-components"
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"
export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap:15px;
    justify-contest: flex-start;
    border-bottom:1px solid black;
    height:44px;
    font-size: 15px;
`
export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover{
        color: #fff;
        background: #fc6868;
        span{
            color: #fff;
        }
    }
    cursor: ${(props)=> props.disabled ? 'not-allowed': 'pointers'}
`
export const WrapperProducts = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
    flex-wrap: wrap;
`