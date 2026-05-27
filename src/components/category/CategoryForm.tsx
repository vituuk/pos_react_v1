"use client"
 
import { useForm } from "@tanstack/react-form"
 
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-category"
import { toast } from "sonner"
import type { Category } from "@/types/category"
import { useEffect, useState } from "react"

const categorySchema = z.object({
  name: z
    .string().min(1, "Category name must be at least 1 character.")
    
    })

interface Props{
    open:boolean,
    setOpen:(open:boolean)=>void
    category?: Category | null  //optional have when edit
}
const CategoryForm=({open,setOpen,category}:Props) =>{
    const {mutate:createCategoryMutate} =useCreateCategory();
    const {mutate:updateCategoryMutate} = useUpdateCategory();

  const form = useForm({
    defaultValues: {
      // name: "",
      name: category?.name || ""
      
    },
    validators: {
      onSubmit: categorySchema,
    },
    onSubmit: async ({ value }) => {

     if(category){
       updateCategoryMutate(
        {id:category.id,request:value},
        {
            onSuccess:()=>{
                toast.success("Category updated successfully")
                setOpen(false);
                form.reset();
            }
        }
       );
       }
       else {
        console.log("Form submitted with values:", value)
        createCategoryMutate(value,{
        onSuccess:()=>{
            toast.success("Category created successfully")
            setOpen(false);
            form.reset();
        }
     });
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
 },[category, form]);

  return (

     <Dialog open={open} onOpenChange={setOpen}>
     
         
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{category ? "Edit" : "Create"} Category</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
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
                    <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>
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
            <Button type="submit" form="category-form">Save</Button>
          </DialogFooter>
        </DialogContent>
      
    </Dialog>
  
  )
}

export default CategoryForm;