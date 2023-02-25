import { ReactNode, createContext, useState, useEffect} from 'react';
import {destroyCookie, setCookie, parseCookies} from 'nookies'
import Router from 'next/router';
import { setupApi } from '../services/api';


type AuthContextData ={
    user:UserProps;
    isAuthenticated: boolean;
    signIn: (credentiais: SignInProps)=> Promise<void>;
    signOut: ()=>void;
    signUp: (credentiais: SignUpProps)=> Promise<void>
}


type UserProps = {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    card: string | null;
}

type SignInProps = {
    password: string;
    email: string;
}


type AuthProviderProps = {
    children: ReactNode;
}


type SignUpProps = {
    name: string;
    email: string;
    password: string;
}




export const AuthContext = createContext({} as AuthContextData);


export function signOut(){
    try{
        destroyCookie(undefined, '@servoce.token')
        Router.push('/login')
    }catch(err){
        console.log('erro ao deslogar o usuario')
    }
}

export function AuthProvider({children}:AuthProviderProps ){
    const [user, setUser] = useState<UserProps>()

    const isAuthenticated = !!user;


    useEffect(()=>{
    const {'@servoce.token': token} = parseCookies();

    if(token){
        const api = setupApi();
        api.get('/me').then(res=>{
            const {id, email, name, isAdmin, card} = res.data;
            setUser({
                id, email, name, isAdmin, card
            })
        }).catch(ERR=>{
            signOut();
        })
    }



    },[])



  async  function signIn({email, password}: SignInProps){
        try{
            const api = setupApi();
            const response = await api.post('/session', {
                email: email,
                password: password
            });
            console.log(response.data)
            const { token , name, id, isAdmin, card} = response.data;

            setCookie(undefined, '@servoce.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            });

         

            setUser({
                id, name, email, isAdmin, card
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`
            Router.push('/')


        }catch(err){
           console.log(err.response)
        }
    }


    async function signUp({name, email, password}: SignUpProps){
        try{
            const api = setupApi();
           const response =  await api.post('/register', {
                name, email, password
            });

          

            Router.push('/')
        }catch(err){
            console.log(err.response)
        }

    }   



    return (
        <AuthContext.Provider value={{user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}