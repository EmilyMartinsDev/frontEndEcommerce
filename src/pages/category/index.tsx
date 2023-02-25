import Head from "next/head";
import {useState, useEffect, useContext, FormEvent} from 'react'
import {AuthContext} from '../../context/AuthContext'
import {canSSRAuth} from '../../utils/canSSRAuth'
import {setupApi} from '../../services/api'
import styles from './style.module.scss'
import {Header} from '../../components/Header'



export default function DashBoard(){
    const [name, setName] = useState('')
    const {user, isAuthenticated} = useContext(AuthContext)


    useEffect(()=>{
        if(!user?.isAdmin){
                return;
        }

    }, [])





    async function handleCategory(e: FormEvent){
        e.preventDefault()

        if(!name){
            return;
        }

        try{
            const api = setupApi()
            await api.post('/category', {
                name: name
            })
            console.log('categoria cadastrada')
            setName('')
        }catch(err){
            console.log(err)
        }

    }

    return (
    <>
        <Head>
            <title>Criar Categoria</title>
        </Head>
        <Header/>
       
            <div className={styles.categoryContainer}>
               
            <h1>Criar Categoria</h1>
                <div className={styles.categoryContent}>
                    <form  className={styles.form} onSubmit={handleCategory}>
                        <input className={styles.input} type='text' value={name} onChange={(e)=>setName(e.target.value)}/>
                    
                        <button>Cadastrar categoria</button>
                    </form>
                </div>
            </div>
       
        </>
    )
}


export const getServerSideProps = canSSRAuth(async(ctx)=>{
    return{
        props:{

        }
    }
})