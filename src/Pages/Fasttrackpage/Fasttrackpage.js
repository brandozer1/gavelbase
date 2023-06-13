import React, { useState, useEffect} from 'react'

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import Logo from '../../Assets/fasttracklogo.png'


const infoReq = [
  {
    field: 'Title',
    general: 'The title of the product. This should be the name of the product, and should be as descriptive as possible. If the product is a bundle, the title should include the word bundle.',
    word: '40',
    nots: 'Do not include the word lot in the title. Do not include the word auction in the title. Do not include the word box in the title. Do not include the word bundle in the title.'

  },
  {
    field: 'Description',
    general: 'The description of the product. This should be a detailed description of the product, including any relevant information. This should include any relevant information about the product, including',
    word: '40',
    nots: 'Do not include the word lot in the title. Do not include the word auction in the title. Do not include the word box in the title. Do not include the word bundle in the title.'
  },
  
]

export default function Fasttrackpage() {
  const [step, setStep] = useState(-1);
  const [manual, setManual] = useState(false);

  const [name, setName] = useState('');
  const [lotId, setLotId] = useState(null);
  const [upc, setUpc] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {

  }, [images]);
  

  return (
    <div className='flex w-full flex-column w-full align-items-center m-3 gap-2'>
      <div className='flex align-items-center justify-content-center gap-4'>
        <img className='w-2' src={Logo} />
        <Button label="Full Help" icon="pi pi-book" onClick={() => setManual(true)} />
      </div>
      
      {
        step == -1 &&
      <>
        <div className='text-900 text-xl mt-8'>To begin Enter your name below</div>
        <InputText onChange={(e)=>setName(e.target.value)} className='w-6' placeholder='Name' />
        <Button onClick={()=>{setStep(step+1)}} label="Begin Session" icon="pi pi-play" />
      </>
      
      }

      {
        step == 0 &&
        <>
          <Camera
            onTakePhoto = { (dataUri) => { images.push(dataUri); console.log(images) } }
          />
          {images.map((image, index) => (
        <img key={index} src={image} alt={`Image ${index + 1}`} />
      ))}
        </>
      }

      {
        step == 1 &&
        <>
          <div className='text-900 text-xl mt-8'>Hi {name}! after you are done testing the product scan the lot label you applied.</div>
          <InputText className='w-6' placeholder='Product Lot Id' />
          <Button label="Continue" icon="pi pi-play" />
        </>
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      <Dialog header="Full Help WIP NOT FINISHED" visible={manual} style={{ width: '50vw' }} onHide={() => setManual(false)}>
        <Card title='Step 1' className='w-12'>
          <p>Retrieve a product and apply a single lot label. Place it on a reasonable location preferably near the barcode of the product, but NOT over it.</p>
        </Card>
        <Card title='Step 2' className='w-12'>
          <p>Open and test the product by all available methods. Items should be tested by minimum viabillity in that it powers on, is intact, contains parts etc. Do not test products beyond initial use. If an item has a particular condition such as a broken piece or other oddities, leave the box opened for picturing. If you do not have a way to completely test a product, you can continue.</p>
        </Card>
        <Card title='Step 3' className='w-12'>
          <p>Every product requires that you take a minimum of 3 pictures. These three will be a front facing shot, a back facing shot, and a top down. Make sure the product is in the center of the frame, with margin. Also make sure to take the pictures level/even with the table. Lastly Take pictures of all oddities found while testing. 4-8 pictures is the goal.</p>
        </Card>
        <Card title='Step 4' className='w-12'>
          <p>Scan the Lot label applied earlier. This will upload as much information as possible about the product. If only partial information is found, you will be expected to perform manual entry according to the chart below. Descriptions should generally include relevant sizes according to the type of product, colors, compatible products etc. There will be a minimum length of 40 words. </p>
          <DataTable value={infoReq} tableStyle={{ minWidth: '50rem' }}>
            <Column field="field" header="field"></Column>
            <Column field="general" header="general requirments"></Column>
            <Column field="word" header="word requirements"></Column>
            <Column field="nots" header="DO-NOTS"></Column>
        </DataTable>
        </Card>
        <Card title='Step 5' className='w-12'>
          <p>Once you have completed the above steps, you can submit the product for review. If you have any questions, please contact your supervisor.</p>
        </Card>
      </Dialog>
      
      
    </div>
  )
}
