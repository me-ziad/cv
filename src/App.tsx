import React, { useEffect } from 'react';
import './index.css'
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
 import Layout from './component/layout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './component/Auth/login';
import Register from './component/Auth/Register';
import ForgetPassword from './component/Auth/forgotPassword';
import ResetCode from './component/Auth/resetCode';
import ResetPassword from './component/Auth/ResetPassword';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './component/ProtectedRoute';
 import SeekerDashboard from './component/Dashboard/SeekerDashboard';
  import SeekerOverviewPage from './component/SeekerOverviewPage';
  
 
   const routers = createBrowserRouter([

        {path: "",element: <Layout />,children: [
        {index: true,element: <ProtectedRoute><SeekerDashboard></SeekerDashboard></ProtectedRoute> ,},
        {path: "login",element: <Login></Login>},
        {path: "register",element: <Register></Register>},
        {path: "forgotPassword",element: <ForgetPassword></ForgetPassword>},
        {path: "resetCode",element: <ResetCode></ResetCode>},
        {path: "ResetPassword",element: <ResetPassword></ResetPassword>},
         {path: "SeekerProfile",element: <ProtectedRoute><SeekerDashboard></SeekerDashboard></ProtectedRoute>},
          {path: "seeker/overview/:id",element: <SeekerOverviewPage></SeekerOverviewPage>},
 
    ]},
  ]);


function App() {
  return (
    
    <Provider store={store}>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
 
        <RouterProvider router={routers} />
     </Provider>
  );
}

export default App;