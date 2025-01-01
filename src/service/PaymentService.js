import axios from "axios"

// export const createProduct = async (data) => {
//     const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`,data)
//     return res.data
// }
export const getConfig = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment/config`)
    return res.data
}
