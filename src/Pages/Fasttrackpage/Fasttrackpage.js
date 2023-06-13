import React, { useState, useEffect} from 'react'

import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Camera from 'react-html5-camera-photo';
import { ListBox } from 'primereact/listbox';
import axios from 'axios';
import { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import './Fasttrackpage.css'

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
  

  const conditions = [
    'New',
    'Unused',
    'Slightly Used',
    'Used',
    'Parts & Repair',
  ]

  const missingStates = [
    'Battery',
    'Cable(s)',
    'Attatchment',
    'Bag'
  ]

  const statuses = [
    'Tested Works',
    'Partially Tested & Works',
    'Unable to Test'
  ]

  const [step, setStep] = useState(-1);
  const [manual, setManual] = useState(false);

  const [name, setName] = useState('');
  const [lotId, setLotId] = useState(null);
  const [upc, setUpc] = useState(null);
  const [bufferimg, setBufferimg] = useState(null); // datauri buffer because the camera comp is weird and wont allow me to push to state
  const [images, setImages] = useState([]);
  const [productInfo, setProductInfo] = useState({});

  const [condition, setCondition] = useState('');
  const [missing, setMissing] = useState([]);
  const [status, setStatus] = useState('');


  const [brand, setBrand] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [model, setModel] = useState('');

  
  useEffect(() => {
    console.log(missing)
  }, [missing])

  function nextStep() {
    setStep(step+1);
  }

  function handleUPC() {
    axios.get(`http://localhost:3001/api/lookup/${upc}`, {withCredentials: true}).then((res)=>{
      console.log(res.data);
      setProductInfo(res.data);
      for (let i = 0; i < res.data.items.length; i++ ) {
        if (res.data.items[i].model) {
          setModel(res.data.items[i].model); 
        }
        if (res.data.items[i].brand) {
          setBrand(res.data.items[i].brand);
        }
        if (res.data.items[i].color) {
          setColor(res.data.items[i].color);
        }
        if (res.data.items[i].title) {
          setTitle(res.data.items[i].title);
        }
        if (res.data.items[i].description) {
          setDescription(res.data.items[i].description);
        }
      }
      console.log(brand, title, description, color, model);
      
    }).catch((err)=>{
      console.log(err.response);
    });
  }


  return (
    <div className='flex w-full flex-column w-full align-items-centers gap-2 p-2'>
      <div className='flex align-items-center sm:justify-content-center justify-content-between gap-4'>
        <img className='sm:w-2 w-5 ' src={Logo} />
        <Button label="Full Help" icon="pi pi-book" onClick={() => setManual(true)} />
      </div>
      
      {
        step == -1 &&
      <form onSubmit={()=>{document.documentElement.requestFullscreen(); nextStep()}} className='flex flex-column gap-2 align-items-center'>
        <div className='text-900 text-xl mt-8'>To begin Enter your name below</div>
        <InputText autoFocus onChange={(e)=>setName(e.target.value)} className='sm:w-6 w-10' placeholder='Name' />
        <Button className='sm:bottom-50 bottom-0 mb-3 w-11 sm:w-6 fixed' type='submit' label="Begin Session" icon="pi pi-play" />
      </form>
      
      }

      {
        step == 0 &&
        <>
          <Camera
            idealFacingMode = {FACING_MODES.ENVIRONMENT}
            onTakePhoto = { (dataUri) => { if (images.length > 7) {setImages(images.splice(1, 8)); setImages(images => [...images,dataUri] );} else {setImages(images => [...images,dataUri] );} } }
          />
          {
            images.length > 2 &&
            <Button onClick={()=>{nextStep()}} label='Continue' />
          }
          <div className='grid'>
            {images.map((image, index) => (
              <img className='col-3' key={index} src={image} alt={`Image ${index + 1}`} />
            ))}
          </div>
          
        </>
      }

      {
        step == 1 &&
        <>
          <div className='text-900 text-xl mt-8'>What is the condition of the product?</div>
          <ListBox value={condition} onChange={(e) => {setCondition(e.value); nextStep()}} options={conditions} className="w-full md:w-14rem" />
        </>
      }

      {
        step == 2 &&
        <>
          <div className='text-900 text-xl mt-8'>What is the product missing?</div>
          <ListBox multiple value={missing} onChange={(e) => setMissing(e.value)} options={missingStates} className="w-full md:w-14rem" />
          {
            missing.length > 0 ?
            <Button onClick={()=>{nextStep()}} label='Continue' />
            :
            <Button onClick={()=>{nextStep()}} label='Nothing' />
          }
          
        </>
      }

      {
        step == 3 &&
        <>
          <div className='text-900 text-xl mt-8'>What is the product's testing status?</div>
          <ListBox value={status} onChange={(e) => {setStatus(e.value); nextStep()}} options={statuses} className="w-full md:w-14rem" /></>
      }

      {
        step == 4 &&
        <form className='flex flex-column align-items-center gap-2' onSubmit={()=>{nextStep()}}>
          <div className='text-900 text-xl mt-8'>Scan or enter the Lot ID.</div>
          <InputText autoFocus onChange={(e)=>setLotId(e.target.value)} className='sm:w-6 w-10' placeholder='Lot ID' />
          <Button className='sm:w-6 w-11 bottom-0 fixed m-3' type='submit' label='Continue' />
        </form>
      }

      {
        step == 5 &&
        <form className='flex flex-column align-items-center gap-2' onSubmit={()=>{handleUPC(); nextStep()}}>
          <div className='text-900 text-xl mt-8'>Scan or enter the products UPC (Barcode).</div>
          <InputText autoFocus onChange={(e)=>setUpc(e.target.value)} className='sm:w-6 w-10' placeholder='UPC' />
          <Button className='sm:w-6 w-11 bottom-0 fixed m-3' type='submit' label='Continue' />
        </form>
      }

      {
        step == 6 && (productInfo.code == 'OK' ?
        <div>

          <div className='text-900 text-xl mt-8'>Confirm data below</div>
          


          {
            brand ?
            <div className='text-900 text-xl mt-8'>Brand: {brand}</div>
            :
            <span className="p-float-label">
              <InputText id="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
              <label htmlFor="Brand">Brand</label>
            </span>
          }
          {
            title ?
            <div className='text-900 text-xl mt-8'>Title: {title}</div>
            :
            <span className="p-float-label">
              <InputText id="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <label htmlFor="Title">Title</label>
            </span>
          }
          {
            description ?
            <div className='text-900 text-xl mt-8'>Description: {description}</div>
            :
            <span className="p-float-label">
              <InputText id="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <label htmlFor="Description">Description</label>
            </span>
          }
          {
            color ?
            <div className='text-900 text-xl mt-8'>Color: {color}</div>
            :
            <span className="p-float-label">
              <InputText id="Color" value={color} onChange={(e) => setColor(e.target.value)} />
              <label htmlFor="Color">Color</label>
            </span>
          }
          {
            model ?
            <div className='text-900 text-xl mt-8'>Model: {model}</div>
            :
            <span className="p-float-label">
              <InputText id="Model" value={model} onChange={(e) => setModel(e.target.value)} />
              <label htmlFor="Model">Model</label>
            </span>
          }
          
          <div className='text-900 text-xl mt-8'>Condition: {condition}</div>
          <div className='text-900 text-xl mt-8'>Missing: 
            {
              missing.map((item, index) => (
                <span key={index}>{item}, </span>
              ))
            }
          </div>
          <div className='text-900 text-xl mt-8'>Status: {status}</div>
          
          
          <Button className='sm:w-6 w-11 bottom-0 fixed m-3' type='submit' label='Finish & Submit' />
        </div>
        :
        <div>
          <div className='text-900 text-xl mt-8'>Product not found. Please enter the info below:</div>
          
        </div>
        )
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
