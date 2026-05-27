import {authLogin} from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import  { type LoginPayload} from "@/types/auth-login";

export const useAuthLogin = () =>{
    return useMutation({
     mutationFn: ({request}:{request: LoginPayload})=>authLogin(request),

     onSuccess:()=>{},
     
     onError:(error:any)=>{      
     console.log("error",error)   
    }

    })
}