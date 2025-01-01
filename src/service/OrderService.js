import axios from "axios"
export const axiosJWT =axios.create()

// export const createProduct = async (data) => {
//     const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`,data)
//     return res.data
// }
export const createOrder = async (data,access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`,data, {
        headers:{
            token:`Bearer ${access_token}`,
        }
    })
    return res.data
}
export const getOrderByUserId = async (id,access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-order/${id}`, {
        headers:{
            token:`Bearer ${access_token}`,
        }
    })
    return res.data
}
export const getOrderDetail = async (id,access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-order-details/${id}`, {
        headers:{
            token:`Bearer ${access_token}`,
        }
    })
    return res.data
}
export const cancelOrderDetails = async (id,access_token, orderItems) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${id}`, {data: orderItems}, {
        headers:{
            token:`Bearer ${access_token}`,
        }
    })
    return res.data
}