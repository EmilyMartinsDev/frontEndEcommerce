import { GetServerSidePropsContext, GetServerSideProps, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import {AuthTokenError} from '../services/errors/AuthTokenError'

export function canSSRAuth<P>(fn: GetServerSideProps<P>){
    return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> =>{
        let cookie = parseCookies(ctx)
        const token = cookie['@servoce.token']
       console.log(token)
        if(!token){
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }

        try{
            return await fn(ctx)
        }catch(err){
            if(err instanceof AuthTokenError){
                destroyCookie(ctx, '@servoce.token', {path: '/'})

                return {
                    redirect:{
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }
    }
}