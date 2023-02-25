import styles from './style.module.scss'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import {setupApi} from '../../services/api'
import {Header} from '../../components/Header'
import { Button } from 'react-bootstrap'
import { useState, useContext} from 'react'
import {AuthContext} from '../../context/AuthContext'
import Router from 'next/router'
import Link from 'next/link'

interface productItem{
    id: string;
    name: string;
    price: string;
    description:string;
    category_id: string;
    banner: string;
    lancamento: boolean;
    destaque: boolean;
    promocao: boolean;
    tamanho: string;
    cor: string;

}


interface DetalhesProps{
    product: productItem
    product_id: string;
}

interface ItemProps{
    amount: string;
    product_id: string;
}


export default function Detalhes({product, product_id}: DetalhesProps){

    let tamanhosProduct = product?.tamanho.split(',');
    let corProduct = product?.cor.split(',')

    let [tamanho, setTamanho] = useState(tamanhosProduct);
    let [cor, setCor] = useState(corProduct);
    const [color, setColor] = useState(cor[0])
    const [size, setSize] = useState(tamanho[0])
    const [inputQtde, setInputQtde] = useState('')

    const {user, isAuthenticated} = useContext(AuthContext)
    


    function handleSelectTamanho(product: string){
        setSize(tamanho.find(item=> item === product )) 
    
    }

    function handleSelectCor(product: string){
        setColor(cor.find(item=> item === product ))

    }   

    async function handleCard(){
        if(!isAuthenticated){
         return   Router.push('/login')
        }

        const api = setupApi();

        if(!user.card){
       let  response =  await api.post('/card')
       console.log(response.data)
        }
        

        try{
            console.log(color, size)
         const response =   await api.post(`/card/item/${product_id}`, {
               amount: Number(inputQtde),
               color: color,
               size: size,
                card_id: user.card

            });
            console.log(response.data)
    
            Router.push('/cart')

        }catch(err){
            console.log(err.data)
            Router.push('/')
        }
    }


    async function handleDelete(){
        try{
           const api = setupApi();
            await api.delete(`/product/delete/${product?.id}`);
            Router.push('/')


        }catch(err){
            console.log(err)
        }
    }
 
    return(
        <>
        <Head>
            <title>Detalhes do produto</title>
        </Head>
        
        <main className={styles.main}>
        <Header/>
        <section className={styles.section1}>
        <img src={`http://localhost:3333/files/${product?.banner}`}/>
        <div className={styles.description}>
        <h1>{product?.name}</h1>
        <p>{product?.description}</p>
      
        <p className={styles.price}>R${product?.price}</p>
        
        <select onChange={(e)=>handleSelectTamanho(e.target.value)}>
            {tamanho.map(item=>(
                <option key={item} value={item}>{item}</option>
            ))}
        </select>
        <p>Selecione o tamanho</p>
        <select onChange={(e)=>handleSelectCor(e.target.value)}>
            {cor.map(item=>(
                <option key={item} value={item}>{item}</option>
            ))}
        </select>
        <p>Selecione a cor</p>   
        <input className={styles.amount} value={inputQtde} onChange={(e)=>setInputQtde(e.target.value)} type='text' placeholder='Coloque a quantidade'/>

        <button className={styles.cart} onClick={handleCard} >Adicionar no carrinho</button>
                <div className={styles.btnAdmin}>
        {user?.isAdmin && (
            <button className={styles.edit}><Link href={`/edit/${product_id}`}>Editar Produto</Link></button>
        )}
          {user?.isAdmin && (
            <button className={styles.delete} onClick={handleDelete}>Deletar Produto</button>
        )}
                </div>
        </div>
      
        </section>
            
        </main>    
        
        
        </>
    )
}

 export const getServerSideProps: GetServerSideProps = async({ params})=>{
    const {product_id} = params || {};
    
    try{
        const api = setupApi();
        const product = await api.get(`/category/product/datail/${product_id}`)
    

        return {
            props:{
                product: product?.data,
                product_id
            }
        }


    }catch(err){
        console.log(err.data)
        return{
            redirect:{
                destination: '/',
                permanent: false

            }
        }
    }

}