export const getCategory = async () => {
    const res = await fetch(`http://localhost:3000/api/v1/category`);
    const data =await res.json();
    console.log(data);
    return data;
}

export const createCategory = async (request: any)=>{
    const res = await fetch(`http://localhost:3000/api/v1/category`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    }  )
    const data = await res.json();
    return data;
}

export const updateCategory = async (id:number,request:any)=>{
    const res = await fetch(`http://localhost:3000/api/v1/category/${id}`,{
        method: "PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
        }
    )
    const data = await res.json();
    return data;
}

export const deleteCategory = async (id?:number) => {
    const res = await fetch(`http://localhost:3000/api/v1/category/${id}`,{
        method: "DELETE",
        headers:{
            "Content-Type": "application/json"
        },
    });
    const data = await res.json();
    return data;
}