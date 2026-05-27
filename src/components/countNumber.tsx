import { useEffect, useState } from 'react'
import { Button } from './ui/button';
const countNumber = () => {
    const [count,setCount]=useState(0);
    useEffect(()=>{
        if(count==5){
            console.log("five");
        }
    }
   
    ,[count])
  return (
    <div>
        <Button className=' bg-amber-500' onClick={()=>setCount(count+1)} >+</Button>
        {count}
        <Button className=' bg-red-600' onClick={()=>setCount(count-1)}>-</Button>
    </div>
  )
}

export default countNumber