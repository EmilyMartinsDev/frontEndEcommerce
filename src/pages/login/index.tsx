import Head from 'next/head'
import styles from './style.module.scss'
import Link from 'next/link'
import {AuthContext} from '../../context/AuthContext';
import {useContext, useState} from 'react'
import { FormEvent} from 'react'

export default function Login() {

  const {signIn} = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e: FormEvent){
   e.preventDefault();
   
    if(!email || !password){
      return;
    }

  let data = {
    email: email,
    password: password,
  }

  await  signIn(data)
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.container} >
            <h1>Faça seu login!</h1>
            <form onSubmit={handleLogin} className={styles.form}>
              <input type='text' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Digite seu email'/>

              <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Digite sua senha'/>

              <button  type='submit'>Entrar</button>
              <span>Não tem uma conta?<Link href='/register'>Cadastre-se</Link></span>
            </form>
        </div>

      </main>
    </>
  )
}