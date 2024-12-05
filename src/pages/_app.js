import Layout from '@/containers/Layout'
import '@/styles/globals.css'
import { useEffect } from 'react'
import { themeChange } from 'theme-change'
import { store } from '../app/store'
import { Provider } from 'react-redux'
import { SessionProvider } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import stripe from '@stripe/stripe-js'
export default function App({ Component, pageProps }) {
  
  useEffect(() => {
    // 👆 daisy UI themes initialization
    themeChange(false)
  }, [])

  return (
    <SessionProvider>
    <Provider store={store}>
      <Layout>
          <ToastContainer />
          <Component {...pageProps} />
      </Layout>
      </Provider>
      </SessionProvider>
  )
}
