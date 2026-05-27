 
import  { useEffect } from 'react'

const ApiData = () => {
 
  const fetProduct=async()=>{
    const res=await fetch("http://localhost:3000/api/v1/product")
    const data=await res.json();
    return data;
  }
  return (
    <div>ApiData</div>
  )
}

export default ApiData