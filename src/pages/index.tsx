import { GetServerSideProps } from 'next'
import Head from 'next/head'
import {Button, Container} from 'react-bootstrap'
import styles from '../../styles/home.module.scss'
import {Header} from '../components/Header'
import {setupApi} from '../services/api'
import images from '../../public/financasApp.png'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link  from 'next/link'

interface DestaqueProps{
  id: string;
  name:string;
  price: string;
  description:string;
  Destaque:string;
  category_id: string;
  banner: string;
  }

interface CategoryProps{
  id: string;
  name: string;
}



interface LancamentoProps{
id: string;
name:string;
price: string;
description:string;
lancamento:string;
category_id: string;
banner: string;
}

interface PromocaoProps{
  id: string;
  name:string;
  price: string;
  description:string;
  lancamento:string;
  category_id: string;
  banner: string;
  }

interface HomeProps{
lancamento:LancamentoProps[];
destaque: DestaqueProps[];
promocao: PromocaoProps[];
categories: CategoryProps[];
}



export default function Home({ lancamento, destaque, promocao, categories}: HomeProps) {
 console.log(categories)

  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main>
        <Header/>
      
      <section className={styles.container}>
      <h1>Produtos em lançamento</h1>
      <div className={styles.lancamento}>
        {lancamento.map(item=>(
            <div key={item?.id} className={styles.produto}>
             <img src={`http://localhost:3333/files/${item?.banner}`} alt="produto-img"  />
             <span> {item?.name}</span>
             <span>R$ {item?.price}</span>
             <Button variant='warning' href={`detalhes/${item?.id}`}>Ver detalhes</Button>
           </div>
        ))}
        </div>
        <h1 className={styles.h1Promocao}>Produtos em Promoção</h1>
        <div className={styles.promocao}>
       
        {promocao.map(item=>(
            <div key={item?.id} className={styles.produto}>
             <img src={`http://localhost:3333/files/${item?.banner}`} alt="produto-img"  />
             <span> {item?.name}</span>
             <span>R$ {item?.price}</span>
             <Button variant='warning' href={`detalhes/${item?.id}`}>Ver detalhes</Button>
           </div>
        ))}
        </div>

        <h1>Produtos em Destaque</h1>
      <div className={styles.destaque}>
        {destaque.map(item=>(
            <div key={item?.id} className={styles.produto}>
             <img src={`http://localhost:3333/files/${item?.banner}`} alt="produto-img"  />
             <span> {item?.name}</span>
             <span>R$ {item?.price}</span>
             <Button variant='warning' href={`detalhes/${item?.id}`}>Ver detalhes</Button>
           </div>
        ))}
        </div>
        <h3 className={styles.categoryTitle}>CATEGORIAS: </h3>
          <div className={styles.categorySession}>
         
           {categories.map(category=>(
          
             <span className={styles.categoryContent} key={category?.id}>

              
          
             <Link href={`/listCategory/${category?.id}`} className={styles.Redirect}>
             <span>{category?.name}</span>
               </Link>
           
            
            
             </span>

           ))}
             
          </div>
        
      </section>
      
      </main>
    </>
  )
}



export const getServerSideProps: GetServerSideProps = async ()=>{
  try{
    
      const api = setupApi();
      const response = await api.get('/category');
      const produtoLancamento = await api.get('/product/lancamento')
      const destaque = await api.get('/product/destaque')
      const promocao = await api.get('/product/promocao')
    

      return {
          props:{
              categories: response?.data,
              lancamento: produtoLancamento?.data,
              destaque: destaque?.data,
              promocao: promocao?.data
          }
      }
  }catch(err){
      return{
          redirect:{
              destination: '/',
              permanent: false
          }
      }
  }


}


