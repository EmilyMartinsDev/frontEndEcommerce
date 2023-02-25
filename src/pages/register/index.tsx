import Head from 'next/head'
import styles from '../login/style.module.scss'
import Link from 'next/link'
import {useState, useContext, FormEvent} from 'react'
import{ AuthContext} from '../../context/AuthContext'


export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName]    = useState('');

    const {signUp} = useContext(AuthContext)

    async function handleRegister(e: FormEvent){
        e.preventDefault()
    

        if(!email || !name || !password){
            return;
        }

        let data = {
            email: email,
            password: password,
            name: name,
        }


        await signUp(data);
       
       

    }

  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.container} >
            <h1>Cadastre-se</h1>
            <form onSubmit={ handleRegister} className={styles.form}>
            <input type='text' value={name}  onChange={(e)=>setName(e.target.value)} placeholder='Digite seu nome'/>

              <input type='text' value={email}  onChange={(e)=>setEmail(e.target.value)} placeholder='Digite seu email'/>

              <input type='password' value={password}  onChange={(e)=>setPassword(e.target.value)} placeholder='Digite sua senha'/>

              <button type='submit' >Cadastrar</button>
              <span>Já tem uma conta?<Link href='/login'>Faça login</Link></span>
            </form>
        </div>

      </main>
    </>
  )
}