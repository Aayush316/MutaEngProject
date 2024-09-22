import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import App from './App';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartWishlistProvider } from './components/CartWishlistContext.jsx'
import { UserProvider } from './components/UserContext.jsx'; 

const root = ReactDOM.createRoot(document.getElementById('root')); 

root.render(
  <GoogleOAuthProvider clientId="Your_google_client_id"> 
    <BrowserRouter>
      <CartWishlistProvider>
        <UserProvider>
          <App />
        </UserProvider>
      <ToastContainer />
      </CartWishlistProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);




