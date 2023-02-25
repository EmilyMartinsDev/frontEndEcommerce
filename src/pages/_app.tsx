
import type { AppProps } from 'next/app'
import {AuthProvider} from '../context/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css'
import  '../../styles/globals.scss'


export default function App({ Component, pageProps }: AppProps) {     
  return (
  
    <AuthProvider>
    <Component {...pageProps} />
    </AuthProvider>
    
  
  )
}
