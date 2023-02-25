
import Head from "next/head";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupApi } from "../../services/api";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import styles from '../edit/style.module.scss'
import { Header } from "../../components/Header";
import {FiUpload} from 'react-icons/fi'
import FormData from 'form-data'



interface CategoryItem{
    id: string;
    name: string;
}



interface EditProps{
    category: CategoryItem[]
}




export default function Edit({ category}: EditProps){
   
    const {user} = useContext(AuthContext)

    useEffect(()=>{



        if(!user?.isAdmin){
            return;
        }
    }, [])

const [name, setName] = useState('')
const [price, setPrice] = useState('')
const [cores, setCores] = useState('')
const [tamanho, setTamanho] = useState('')
const [lancamento, setLancamento] = useState('')
const [destaque, setDestaque] = useState('')
const [promocao, setPromocao] = useState('')
const [descricao, setDescricao]  = useState('')
const [imageAvatar, setImageAvatar] = useState<any | null>()
const [imageURL, setImageURL] =useState('')
const [isChecked, setIsChecked] = useState(false || true)

const [categoryList, setCategoryList] = useState<CategoryItem[]>(category)
const [selected, setSelected] = useState(0)

function handleSelected(e: any){
    setSelected(e.target.value)
}


function handleFile(e: ChangeEvent<HTMLInputElement>){
  if  (!e.target.files){
    return;
  }
  const images = e.target.files[0];

  if(!images){
    return;
  }

  if(images.type === 'image/png' || images.type === 'image/jpeg'){
    setImageAvatar(images)
    setImageURL(URL.createObjectURL(e.target.files[0]))
  }






}





async function handleCastre(e: FormEvent){
    e.preventDefault()

    const data = new FormData();


    if(!name || !price || !imageAvatar || !descricao || !tamanho || !cores){
        return;
    }
    console.log(lancamento)
    try{
        data.append('name', name)
        data.append('price', price)
        data.append('description', descricao)
        data.append('tamanho', tamanho)
        data.append('cor', cores)
        data.append('lancamento', lancamento)
        data.append('destaque', destaque)
        data.append('promocao', promocao)
        data.append('category_id', categoryList[selected]?.id)
        data.append('file', imageAvatar)


        const api = setupApi();
       const response = await api.post('/product', data)
        console.log(response?.data)
    }catch(err){
        console.log(err.data)
    }
}



    return (
        <>
        <Head>
            <title>Cadastrar Produto</title>
        </Head>
        <main>
            <Header/>
            <div className={styles.content}>
            <form className={styles.form} onSubmit={handleCastre}>
                <input type='text' value={name}  onChange={(e)=>setName(e.target.value)} placeholder="digite o nome do produto"/>
                <input type='text'  value={price}  onChange={(e)=>setPrice(e.target.value)} placeholder="digite o preco"/>
                <input type='text'  value={cores}  onChange={(e)=>setCores(e.target.value)} placeholder="digite as cores disponíveis"/>
                <input type='text'  value={tamanho}  onChange={(e)=>setTamanho(e.target.value)} placeholder="digite os tamanhos disponíveis"/>
                <label className={styles.select}><span className={styles.category}>Selecione a categoria</span>
                <select  value={selected} onChange={handleSelected} >
                    {categoryList.map((item)=>(
                        <option key={item?.id} value={item?.id}>{item?.name}</option>
                    ))}
                </select>
                </label>
                <div className={styles.checkbox}>
                <label> <input value={lancamento } onChange={(e)=>setLancamento(e.target.checked ? 'active' : '' )} checked={lancamento !== '' }  type="checkbox" name='flag'  />  Lançamento?</label>
                <label> <input  value={destaque ? 'true' : '' } onChange={(e)=>setDestaque(e.target.checked ? 'active' : '' )} checked={destaque  !== ''}  type="checkbox" name='flag'     />   Destaque?</label>
                <label> <input  value={promocao ? 'true' : ''} onChange={(e)=>setPromocao(e.target.checked ? 'active' : '' )} checked={promocao  !== ''} type="checkbox" name='flag'      />    Promocao?</label>
                </div>
                <textarea className={styles.textArea} placeholder="digite uma descricao ao produto" value={descricao} onChange={(e)=> setDescricao(e.target.value)}></textarea>
                <label className={styles.labelAvatar}>
                   
                <span>
                <FiUpload size={25} color="#000"/>

                </span>
                <input type='file' accept="image/png image/jpeg" onChange={handleFile}/> 
                {imageURL &&(
                    <img src={imageURL} width={250} height={250}/>
                )}
                 </label> 

                 <button >Editar</button>
            </form>

            </div>
        </main>
        </>
    )
}


export const getServerSideProps = canSSRAuth(async(ctx)=>{
    try{
        const api = setupApi();
        const response = await api.get('/category')
        return{
            props:{
                category: response?.data
            }
        }
    }catch{
        return{
            redirect:{
                destination: '/',
                permanent: false
            }
        }

    }

 
})