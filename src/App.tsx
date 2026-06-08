import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import ProductPage from '@/pages/Product';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CategoryPage from './pages/Category';
import { Toaster } from './components/ui/sonner';
import Categories from './pages/test-category';
import LoginPage from './pages/LoginPage'
import PosPage from './pages/PosPage';
import DashboardPage from './pages/Dashboard';
import CustomerPage from '@/pages/Customer';
import OrdersPage from '@/pages/Orders';
import PaymentsPage from '@/pages/Payments';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient();
const App = () => {
   
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <Toaster position='top-center'/>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout/>}>
              <Route path='/login' element={<LoginPage/>}/>
            </Route>

            <Route element={<DashboardLayout/>}>
              <Route path='/admin/dashboard' element={<DashboardPage/>}/>
              <Route path='/admin/products' element={<ProductPage/>}/>
              <Route path='/admin/category' element={<CategoryPage/>}/>
              <Route path='/testCategory' element={<Categories/>}/>
              <Route path='/admin/pos' element={<PosPage/>}/>
              <Route path='/admin/customers' element={<CustomerPage/>}/>
              <Route path='/admin/orders' element={<OrdersPage/>}/>
              <Route path='/admin/payments' element={<PaymentsPage/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
