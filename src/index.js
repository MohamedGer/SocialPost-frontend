import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import '@progress/kendo-theme-default/dist/all.css';
import { ToastContainer} from 'react-toastify';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react'
import {GlobalContext} from "./context/Context"
import chakraTheme from '@chakra-ui/theme'
import { registerLicense,li } from '@syncfusion/ej2-base';
//scheduler styles
import "@syncfusion/ej2-base/styles/bootstrap.css";
import "@syncfusion/ej2-buttons/styles/bootstrap.css";
import "@syncfusion/ej2-calendars/styles/bootstrap.css";
import "@syncfusion/ej2-dropdowns/styles/bootstrap.css";
import "@syncfusion/ej2-inputs/styles/bootstrap.css";
import "@syncfusion/ej2-lists/styles/bootstrap.css";
import "@syncfusion/ej2-navigations/styles/bootstrap.css";
import "@syncfusion/ej2-popups/styles/bootstrap.css";
import "@syncfusion/ej2-splitbuttons/styles/bootstrap.css";
import "@syncfusion/ej2-react-schedule/styles/bootstrap.css";
import "@syncfusion/ej2-react-grids/styles/bootstrap.css";
import 'react-toastify/dist/ReactToastify.css';

//this is for the add post splitter
import '@syncfusion/ej2-layouts/styles/bootstrap.css';
const { Button } = chakraTheme.components
const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = extendBaseTheme({
  components: {
    Button,
  },
})
// Registering Syncfusion license key
registerLicense(process.env.REACT_APP_SYNCFUSIONLICENSEKEY);

root.render(
  
  <> 
    
    
    <header>
    </header>
    <GlobalContext>
    <ToastContainer
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
  
    <App/>
    
   
  
    </GlobalContext>
    
    
    
    <footer>
  {/*<FooterComp/>*/}
</footer>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
