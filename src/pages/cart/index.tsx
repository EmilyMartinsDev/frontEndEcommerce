
import Head from "next/head"
import styles from './style.module.scss'
import { canSSRAuth } from "../../utils/canSSRAuth"
import { setupApi } from "@/src/services/api"
import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
interface CardItensItem{
    id: string;
    amount: number;
    color: string;
    size: string;
    product_id: string;
    card_id: string;
    product: ProductProps
}

interface ProductProps{
    
        id: string;
        name: string;
        price: string;
        description: string;
        banner: string;
        cor: string;
        lancamento: string;
        destaque: string;
        promocao: string;
        tamanho: string;
        category_id: string;
    
}


interface CartProps{
    cardItens: CardItensItem[]

}


export default function Cart({cardItens }: CartProps){

    const [listProduct, setListProduct] = useState<CardItensItem[]>(cardItens)
    const [ preco, setPreco] = useState([])
    const[totalProduct, setTotalProduct] = useState(0)
    const [amountProduct, setAmountProduct] = useState()
    useEffect(()=>{
        
        let amountList = listProduct.map(item=>{
            let { amount} = item

            return amount
        });

        let priceList = listProduct.map(item=>{
         let {price} = item?.product
         return price
        });

        setPreco(priceList)
       
       let priceList2 = listProduct.map(item=>{
          
            let  total =  Number(item?.product?.price) * item?.amount
            return total
        })


        setPreco(priceList2)
        let total = priceList2.reduce((acc, price)=>{
           return acc + price
        }, 0);


        setTotalProduct(total)
        
    

    },[])


    async function handleDelete(id: string){
        try{
            const api = setupApi();
            await api.delete(`/card/item/${id}`);

            const deleteProduct = listProduct.filter(item=> item.id !== id);
            let priceDeleted =listProduct.find(item=> item.id == id)
           let price =  Number(priceDeleted.product.price)
           let amount = priceDeleted.amount
            setListProduct(deleteProduct)
            setTotalProduct(totalProduct - price * amount)


            console.log()
        }catch(err){
            console.log(err);
            
        }



      
    }


    return (
        <>
        <Head>
            <title>Meu Carrinho</title>
        </Head>
        <section className={styles.container}>
        <div className={styles.content}>
        <h1>Carrinho</h1>
       {listProduct.map((item)=>(
         <article key={item?.id} className={styles.listProduct}>
           <img src={`http://localhost:3333/files/${item?.product?.banner}`} alt="produto-img"   />
         <span>Nome: {item?.product?.name}</span>
         <span>tamanho:{item?.size}</span>
         <span>cor: {item?.color} </span>
         <span>quantidade:{
                item?.amount
            } </span>
         <span  className={styles.price} >Preço:<span className={styles.item} >R$ {Number(item?.product?.price) * item?.amount}</span> </span>
         <Button onClick={()=>handleDelete(item?.id)} variant="warning">Remover</Button>
         </article>
       ))}
       <div className={styles.total}><h3>TOTAL: {totalProduct} </h3></div>
       <Button className={styles.comprar} variant="success">Comprar</Button>
        </div>
        </section>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async(ctx)=>{
    const apiClient = setupApi(ctx);


    


    try{
        const response = await apiClient.get('/card');


        return {
            props:{
                cardItens : response?.data,
        
            }
        }
    }catch(err){
        console.log(err.response)
        return{
            redirect:{
                destination:'/',
                permanent: false
            }
        }
    }

})
