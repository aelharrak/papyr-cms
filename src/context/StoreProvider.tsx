import React, { useState, useContext } from 'react'
import axios from 'axios'
import StoreContext from './storeContext'
import UserContext from './userContext'

const StoreProvider = props => {

  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const { currentUser } = useContext(UserContext)

  const addToCart = async product => {
    const newCart = [...cart, product]
    if (!currentUser) {
      if (cart.filter(inCart => inCart._id === product._id).length < product.quantity) {
        localStorage.setItem('cart', JSON.stringify(newCart))
        setCart(newCart)
      }
    } else {
      try {
        await axios.put(`/api/store/cart/${product._id}`)
        setCart(newCart)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const removeFromCart = async product => {
    let removed = false
    const newCart = cart.filter(item => {
      if (item._id === product._id && !removed) {
        removed = true
        return false
      }
      return true
    })

    if (!currentUser) {
      if (cart.filter(inCart => inCart._id === product._id).length > 0) {
        localStorage.setItem('cart', JSON.stringify(newCart))
        setCart(newCart)
      }
    } else {
      try {
        await axios.delete(`/api/store/cart/${product._id}`)
        setCart(newCart)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const clearCart = () => {
    setCart([])
    if (!currentUser) {
      localStorage.setItem('cart', JSON.stringify([]))
    }
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        addToCart,
        removeFromCart,
        clearCart
      }}
    >
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreProvider
