"use client"

// import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
 
  CardFooter,
 
} from "@/components/ui/card"
import {
  Field,
 
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
 

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters.")
    .max(32, "Category name must be at most 32 characters."),
 
})

 
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
 
 
import { Label } from "@/components/ui/label"
import { tr } from "zod/v4/locales"
import { createdCategory, updateCategories } from "@/hooks/test-category"
import type { Category } from "@/types/category"
import { useEffect } from "react"

interface Props{
    open: boolean,
    setOpen: (open:boolean)=>void;
    category?:Category;//use for edit form of each row table
}

export function FormTest({open,setOpen,category}:Props) {

  const {mutate:createCategoryMutate} = createdCategory(); 
  const {mutate:updateCategoryMutate} = updateCategories();
   

  const form = useForm({
    defaultValues: {
      name: category?.name || "",//use for edit form of each row table
    },
    validators: {
      onSubmit: formSchema,
    },
    
    onSubmit: async ({ value }) => {
      console.log("Form submitted with values:", value)

      if(category){
          updateCategoryMutate({id:category.id,request:value},
            {
              onSuccess:()=>{
                toast.success("Category updated successfully"),
                setOpen(false);
                form.reset();
              }
            }
          )
      } else{
      createCategoryMutate(value,{
        onSuccess:()=>{ 
          toast.success("Category created successfully"),
          setOpen(false);
          form.reset();
        }
      })
      }
    
    },
  })
  
 useEffect(()=>{
  if(category){
    // When category changes (clicking edit on a different row), update the form value
    form.setFieldValue('name', category.name);
  } else {
    // Clear form when switching to create mode
    form.reset();
  }
 },[category]);

  return (

<Dialog open={open} onOpenChange={setOpen}>
    
         
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          
            <form
          id="category-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter category name"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            
          </FieldGroup>
        </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" form="category-form">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      
    </Dialog>

    // <Card className="w-full sm:max-w-md">
       
    //   <CardContent>
    //     <form
    //       id="bug-report-form"
    //       onSubmit={(e) => {
    //         e.preventDefault()
    //         form.handleSubmit()
    //       }}
    //     >
    //       <FieldGroup>
    //         <form.Field
    //           name="name"
    //           children={(field) => {
    //             const isInvalid =
    //               field.state.meta.isTouched && !field.state.meta.isValid
    //             return (
    //               <Field data-invalid={isInvalid}>
    //                 <FieldLabel htmlFor={field.name}>Category</FieldLabel>
    //                 <Input
    //                   id={field.name}
    //                   name={field.name}
    //                   value={field.state.value}
    //                   onBlur={field.handleBlur}
    //                   onChange={(e) => field.handleChange(e.target.value)}
    //                   aria-invalid={isInvalid}
    //                   placeholder="Enter category name"
    //                   autoComplete="off"
    //                 />
    //                 {isInvalid && (
    //                   <FieldError errors={field.state.meta.errors} />
    //                 )}
    //               </Field>
    //             )
    //           }}
    //         />
            
    //       </FieldGroup>
    //     </form>
    //   </CardContent>
    //   <CardFooter>
    //     <Field orientation="horizontal">
    //       <Button type="button" variant="outline" onClick={() => form.reset()}>
    //         Reset
    //       </Button>
    //       <Button type="submit" form="bug-report-form">
    //         Submit
    //       </Button>
    //     </Field>
    //   </CardFooter>
    // </Card>
  )
}
