import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import Header from '../components/Header'
import store from '../store/store'
import { ToastContainer } from 'react-toastify';
import { Amplify } from 'aws-amplify';

const Layout = ({children}) => {

  useEffect(() => {
    Amplify.configure({
      Auth: {
         mandatorySignIn: false,
        identityPoolId: 'us-east-2:cb760161-bb1f-4dd4-9018-49c443a9cce5', //REQUIRED - Amazon Cognito Identity Pool ID
        region: 'us-east-2', // REQUIRED - Amazon Cognito Region
      },
      Storage: {
        AWSS3: {
          bucket: 'nft-vishal-0987', //REQUIRED -  Amazon S3 bucket name
          region: 'us-east-1',
        identityPoolId: 'us-east-2:cb760161-bb1f-4dd4-9018-49c443a9cce5', //REQUIRED - Amazon Cognito Identity Pool ID
        }
      }
    });
  }, [])


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
