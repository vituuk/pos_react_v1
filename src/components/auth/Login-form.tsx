import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import PosImage from "./../../../public/img/pos.jpg"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { useAuthLogin } from "@/hooks/use-auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { setAccessToken } from "@/utils/tokenStorage";

const loginSchema = z.object({
  email: z.string().min(1,"Email is required"),
  password: z.string().min(1, "Password is required"),
})

 function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [isLoading, setIsLoading] = useState(false);
  const {mutate:loginMutate} = useAuthLogin();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const form = useForm({
    defaultValues:{
      email: "",
      password: "",
    },
    validators:{
      onSubmit:loginSchema
    },

    onSubmit:async ({value})=>{
      setIsLoading(true);

      loginMutate(
        {request: value},{
         onSuccess: (res) => {

            console.log("res", res);
            if (res?.data) {
              setAccessToken(res?.data);
              navigate("/admin/products")
            } else {
              setError(res?.message);
            }
          },

                   onSettled: () => {
            setIsLoading(false);
          },
      });
    }
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={(e) =>{ e.preventDefault();form.handleSubmit()}}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to system
                </p>
              </div>
              
            <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Email <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter email"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              
             <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Password <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter password"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
         
              <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                Forgot your password?
              </a>

              <Field>
                <Button type="submit">Login</Button>
              </Field>
               
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="#">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img src={PosImage} alt="POS System" className="h-full w-full object-cover" />
          </div>
        </CardContent>
      </Card>
    
    </div>
  )
}

export default LoginForm