import Head from "next/head";
import { GetServerSideProps } from 'next'
import {setupApi} from '../../services/api'
import { Button } from "react-bootstrap";
import styles from './style.module.scss'
import {Header} from '../../components/Header'
import Link from "next/link";
interface ProductsProps{
    id: string;
    name: string;
    price: string;
    description: string;
    lancamento: string | null;
    destaque: string | null;
    promocao: string | null;
    banner: string;
    cor: string;
    tamanho: string;
    category_id: string;

}


interface ListByCategoryProps{
    products:ProductsProps[]
    categoryName: string
}



export default function ListByCategory ({products, categoryName}: ListByCategoryProps){
    return(
        <>
        <Head>
            <title>PRODUTOS - {categoryName} </title>
        </Head>
        <main>

        <Header/>

        <h1 className={styles.title}>Categoria: {categoryName}</h1>
        <div className={styles.container} >

           
        {products.map(item=>(
            <div key={item?.id} className={styles.content} >
             <img src={`http://localhost:3333/files/${item?.banner}`} alt="produto-img"  />
             <span className={styles.name}>{item?.name}</span>
             <span className={styles.price}>R$ {item?.price}</span>
             <Link href={`/detalhes/${item?.id}`}>Ver detalhes</Link>
           </div>
        ))}
        </div>

        </main>

        
        
        </>
    )
}

export const getServerSideProps:GetServerSideProps = async({params})=>{

    const {category_id} = params || {}
    try{
        const api = setupApi()
        const response = await api.get(`/category/product/${category_id}`);
        const categories = await api.get('/category')
        const category = categories?.data.find(item=> item?.id === category_id)
        const {name} = category

       
        
        return{
            props:{
                products: response?.data,
                categoryName: name
            }
        }



    }catch(err){
        console.log(err)
        return{
            redirect:{
                destination: '/',
                permanent: false
            }
        }
    }
}