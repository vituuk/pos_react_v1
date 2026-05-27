import { Button } from "@/components/ui/button"
import {
  Card,
  CardFooter,
} from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
interface Props {

  productName: string
  productPrice:number
  qty: number
  image: string
  
}

function Product({ productName, productPrice, qty, image }: Props) {
  return (
    <div className=" flex justify-between ">
       <Card className="w-full flex justify-between px-2 max-w-sm">
      
      <div className="flex justify-between   font-bold px-3 text-emerald-500  text-3xl">
         <p>{productName}</p>
      <p>{productPrice}</p>
      <p>{qty}</p>
      </div>
     
      <img src={image} alt="" />
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  
       
    </div>
  )
}

export default Product
