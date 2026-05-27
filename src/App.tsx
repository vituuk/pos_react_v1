 import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import HomePage from '@/pages/HomePage';
import Product from '@/pages/Product';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Category from './pages/Category';
import { Toaster } from './components/ui/sonner';
import Categories from './pages/test-category';
import LoginPage from './pages/LoginPage'
import { User } from 'lucide-react';
import PosPage from './pages/PosPage';

const queryClient = new QueryClient();
const App = () => {
   
  return (
      
     <QueryClientProvider client={queryClient}>
     <Toaster position='top-center'/>
      <BrowserRouter>
       <Routes>
        <Route element={<MainLayout/>}>
        {/* <Route path='/' element={<HomePage/>}/> */}
        <Route path='/login' element={<LoginPage/>}/>
       </Route>

        <Route element={<DashboardLayout/>}>
        <Route path='/admin/products' element={<Product/>}/>
        {/* <Route path='/user' element={<User/>}/> */}
        <Route path='/admin/category' element={<Category/>}/>
        <Route path='/testCategory' element={<Categories/>}/>
        <Route path='/admin/pos' element={<PosPage/>}/>
        </Route>
       
       </Routes>
     </BrowserRouter>
   
     </QueryClientProvider>
      
     
     
 
  )
}

export default App
