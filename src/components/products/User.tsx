// import { data } from "react-router-dom";
// import { columns } from "./columns";
// import { DataTable } from "./data-table";
// import { useState, useEffect } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { Spinner } from "../ui/spinner";
// import { fetProduct } from "../../services/product.service";
// import { Input } from "@/components/ui/input";
// import { Button } from "../ui/button";


// // export default User;
// const User = () => {
  
//   const [searchInput,setSearchInput]=useState("");
//   const [search,setSearch]=useState("");

//   const {data,isLoading}=useQuery({queryKey: ['products',search], queryFn:()=> fetProduct(searchInput)});

//   if (isLoading){
//     return <div><Spinner/></div>
//   }

//   //search 
//   const handleSearch=()=>{
//   console.log("searching for",searchInput);
//   setSearch(searchInput);
//   }

//   return (
//     <div>
       
//       <div className="py-2 flex gap-2 outline-0">
//         <Input className="w-64" onChange={(e)=>setSearchInput(e.target.value)}/>
//         <Button onClick={()=>handleSearch()}>Search</Button>
//       </div>
//       <DataTable columns={columns} data={data.data ?? []} />
//     </div>
//   );
// };


// export default User;
