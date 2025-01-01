import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  id: '',
  access_token: '',
  isAdmin: false,
  city: '',
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { name, email, access_token, address, phone, avatar, _id, isAdmin, city } = action.payload
      state.name = name ?? state.name;
      state.email = email ?? state.email;
      state.phone = phone ?? state.phone;
      state.address = address ?? state.address;
      state.avatar = avatar ?? state.avatar;
      state.id = _id ?? state.id;
      state.isAdmin = isAdmin ?? state.isAdmin;
      state.city = city ?? state.city;
      state.access_token = access_token ?? state.access_token;
    },
    resetUser: (state) => {
      state.name = '';
      state.email = '';
      state.phone = '';
      state.address = '';
      state.avatar = '';
      state.id = '';
      state.access_token = '';
      state.isAdmin = false;
      state.city = '';

    },
  },
})

export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer