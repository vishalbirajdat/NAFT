import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import Header from '../components/Header'
import store from '../store/store'
import { ToastContainer } from 'react-toastify';


const Layout = ({children}) => {




  return (
          <Provider store={store}>
              <div>
            <Header />
          {children}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          newestOnTop
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
              </div>
          </Provider>
  )
}

export default Layout
