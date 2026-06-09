import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
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
  email: z
    .string()
    .min(1, "Email is required")
    .refine((val) => {
      if (!val) return true;
      return z.string().email().safeParse(val).success;
    }, { message: "Invalid email" }),
  password: z
    .string()
    .min(1, "Password is required")
    .refine((val) => {
      if (!val) return true;
      return val.length >= 5;
    }, { message: "Password must be at least 5 characters" }),
})

 function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [isLoading, setIsLoading] = useState(false);
  const {mutate:loginMutate} = useAuthLogin();
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues:{
      email: "",
      password: "",
    },
    validators:{
      onSubmit:loginSchema,
      onChange:loginSchema,
    },

    onSubmit:async ({value})=>{
      setIsLoading(true);
      setError("");

      loginMutate(
        {request: value},{
          onSuccess: (res) => {
            console.log("res", res);
            if (res?.data) {
              setAccessToken(res?.data);
              navigate("/admin/products")
            } else {
              setError(res?.message || "Login failed");
            }
          },
          onError: (err: any) => {
            console.log("err", err);
            const serverMessage = err?.response?.data?.message;
            let message = "Incorrect email or password";
            if (serverMessage === "User email not found") {
              message = "Incorrect email";
            } else if (serverMessage === "Invalid password") {
              message = "Incorrect password";
            } else if (serverMessage) {
              message = serverMessage;
            }
            setError(message);
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
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              setIsSubmitted(true);
              form.handleSubmit();
            }}
          >
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
                  const isInvalid = isSubmitted && !field.state.meta.isValid;
                  const hasEmailError = error === "Incorrect email";
                  return (
                    <Field>
                      <FieldLabel>
                        Email <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          if (error === "Incorrect email") setError("");
                        }}
                        aria-invalid={isInvalid || hasEmailError}
                        placeholder="Enter email"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      {!isInvalid && hasEmailError && (
                        <FieldError>{error}</FieldError>
                      )}
                    </Field>
                  );
                }}
              />

              
             <form.Field
                name="password"
                children={(field) => {
                  const isInvalid = isSubmitted && !field.state.meta.isValid;
                  const hasPasswordError = error === "Incorrect password";
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Password <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          if (error === "Incorrect password") setError("");
                        }}
                        aria-invalid={isInvalid || hasPasswordError}
                        placeholder="Enter password"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      {!isInvalid && hasPasswordError && (
                        <FieldError>{error}</FieldError>
                      )}
                    </Field>
                  );
                }}
              />

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                {error && error !== "Incorrect email" && error !== "Incorrect password" && (
                  <p className="text-sm font-medium text-red-500 mt-2 text-center">
                    {error}
                  </p>
                )}
              </Field>
               
        
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