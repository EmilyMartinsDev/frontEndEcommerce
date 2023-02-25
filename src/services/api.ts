import axios, { AxiosError} from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";
import { signOut } from "../context/AuthContext";

export function setupApi(ctx = undefined){
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers:{
            Authorization: `Bearer ${cookies['@servoce.token']}`
        }
    });

    api.interceptors.response.use(response=>{
        return response
    }, (error: AxiosError)=>{
        if(error.response.status === 401){
            // deslogar
            if(typeof window !== undefined){
                signOut()
            }else{
                return Promise.reject(new AuthTokenError())
            }

        }
        return Promise.reject(error)
    });

    return api;
}
