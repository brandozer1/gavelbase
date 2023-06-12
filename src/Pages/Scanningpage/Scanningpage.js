import React, {useState, useRef} from 'react'
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import axios from 'axios';

export default function Scanningpage() {
    const [upc, setUpc] = useState('');
    const [product, setProduct] = useState({});
    const toast = useRef(null);

    const handleCode = () => {
        axios.get(`http://localhost:3001/api/lookup/${upc}`)
        .then((response) => {
            
            setProduct(response.data.items[0]);
            console.log(product);
        })
        .catch((error) => {
            console.error('Error fetching product information:', error);
        });
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
          .then(() => {
            toast.current.show({ severity: 'success', summary: 'Copied!', detail: 'Info added to clipboard!' });
            console.log('Text copied to clipboard:', text);
            // You can show a success message or perform any other actions after successful copying
          })
          .catch((error) => {
            console.error('Error copying text to clipboard:', error);
            // You can show an error message or perform any other error handling
          });
      };
      


    return (
    <div className='px-4 w-12 surface-ground flex flex-column gap-3'>
        <Toast ref={toast} />
        <h1>Scanning</h1>
        <div className='p-inputgroup w-full'>
            <InputText onChange={(e)=>setUpc(e.target.value)} placeholder='Scan or Enter UPC' />
            <Button onClick={()=>{handleCode()}} label='Submit' />
        </div>
        
        <div className="flex flex-column gap-3">
            <div className="flex gap-3 w-full justify-content-start align-items-center">
                <span>{product.title}</span>
                <Button label="Copy" onClick={() => handleCopy(product.title)} />
            </div>
        </div>
        <div className="flex flex-column gap-3">
            <div className="flex gap-3 w-full justify-content-start align-items-center">
                <span>{product.description}</span>
                <Button label="Copy" onClick={() => handleCopy(product.description)} />
            </div>
        </div>
        <div className="flex flex-column gap-3">
            <div className="flex gap-3 w-full justify-content-start align-items-center">
                <span>{product.color}</span>
                <Button label="Copy" onClick={() => handleCopy(product.color)} />
            </div>
        </div>
    </div>
    )
}
