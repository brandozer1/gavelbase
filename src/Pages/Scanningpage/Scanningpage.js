import React, {useState} from 'react'
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

export default function Scanningpage() {
    const [upc, setUpc] = useState('')
    function handleCode (code) {
        
        axios.get(`https://api.barcodelookup.com/v3/products?barcode=${code}&formatted=y&key=8yfxfqeyaogud5nkdfouxc2nlut19c`)
        .then(res => {
            console.log(res.data)
        })
    }

    return (
    <div>
        <InputText onChange={(e)=>setUpc(e.value)} placeholder='Scan or Enter UPC' className='w-12'/>
        <Button onClick={()=>{handleCode(upc)}} label='Submit' className='w-12'/>
    </div>
    )
}
