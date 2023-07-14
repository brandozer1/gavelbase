import React, { useState, useEffect} from 'react'

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Skeleton } from 'primereact/skeleton';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Camera from 'react-html5-camera-photo';
import { ListBox } from 'primereact/listbox';
import axios from 'axios';
import { FACING_MODES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import './Fasttrackpage.css'
import success from "../../Assets/success.mp3";
import error from "../../Assets/fail.mp3";
import complete from "../../Assets/complete.mp3";

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
    'Quantity',
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
  const [stockImage, setStockImage] = useState('');
  const [finalImages, setFinalImages] = useState([]); 

  const [locationInput, setLocationInput] = useState('');
  const [locationCode, setLocationCode] = useState(null);
  const [locationLotId, setLocationLotId] = useState(null);

  function nextStep(status = null) {
    
    if (status == false) {
      new Audio(error).play();
      return;
    }
    if (status == true) {
      new Audio(success).play();
      
    }

    setStep(step+1);
    
  }

  function restart() {
    setStep(0); 
    setImages([]); 
    setCondition(''); 
    setMissing([]); 
    setStatus('')
    setBrand('');
    setTitle('');
    setDescription('');
    setColor('');
    setModel('');
    setStockImage('');
    setUpc('');
  }

  function handleUPC() {
    axios.get(`https://gavelbaseserver.herokuapp.com/api/lookup/${upc}`, {withCredentials: true}).then((res)=>{
      console.log(res.data);
      setProductInfo(res.data);
      for (let i = 0; i < res.data.items.length; i++ ) {
        if (res.data.items[i].model && !model) {
          setModel(res.data.items[i].model); 
        }
        if (res.data.items[i].brand && !brand) {
          setBrand(res.data.items[i].brand);
        }
        if (res.data.items[i].color && !color) {
          setColor(res.data.items[i].color);
        }
        if (res.data.items[i].title && !title) {
          setTitle(res.data.items[i].title);
        }
        if (res.data.items[i].description && !description) {
          setDescription(res.data.items[i].description);
        }
        if (res.data.items[i].images && !stockImage) {
          setStockImage(res.data.items[i].images[0]);
          setFinalImages(finalImages.concat(res.data.items[i].images));
        }
      }
      new Audio(success).play();
    }).catch((err)=>{
      new Audio(error).play();
      console.log(err.response);
    });
  }

  function handleSubmission() {
    axios.post('https://gavelbaseserver.herokuapp.com/api/appendLot', [
      lotId,
      JSON.stringify(finalImages),
      upc,
      title,
      description,
      stockImage,
      model,
      brand,
      color,
      condition,
      JSON.stringify(missing),
      status,
      name,
      new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      
    ], {withCredentials: true}).then((res)=>{
      console.log(res.data);
    }).catch((err)=>{
      console.log(err.response);
    })
  }

  function handleManualSubmission(e) {
    e.preventDefault();
    if (locationInput.split('-')[0] == 'loc' || locationInput.split('-')[0] == 'Loc') {
      setLocationInput(locationInput.replace('Loc', 'loc'))
      setLocationCode(locationInput);
    }else{
      setLocationLotId(locationInput);
    }
    setLocationInput('');
    
    
  }

  useEffect(()=>{
    if (locationCode && locationLotId) {
      // updateLot
      axios.post('https://gavelbaseserver.herokuapp.com/api/updateLot', {lotId: locationLotId, loc: locationCode}, {withCredentials: true}).then((res)=>{
        new Audio(complete).play();
      }).catch((err)=>{
        new Audio(error).play();
        console.log(err.response);
      });
      setLocationCode(null);
      setLocationLotId(null);
    }else{
      new Audio(success).play();
    }
  }, [locationCode, locationLotId])


  return (
    <div className='flex w-full flex-column w-full align-items-centers gap-2 p-2'>
      <div className='flex justify-content-between w-full align-items-center'>
        <button className='sm:w-2 w-4 ' style={{border: 'none', background: 'none'}}>
          <img className=' w-full ' onClick={()=>{setStep(-1)}} src={Logo} />
        </button>
        
        <div className='p-inputgroup w-auto sm:h-auto h-2rem'>
          <Button label="Help" icon="pi pi-book" onClick={() => setManual(true)} />
          { 
            step >= 0 &&
            <Button severity='danger' label="Restart" icon="pi pi-trash" onClick={()=>restart()} />
          }
          

        </div>
        
      </div>
      

      {
        step == -2 &&
      <form onSubmit={(e)=>{handleManualSubmission(e)}} className='flex flex-column w-full gap-2 align-items-center'>
        <InputText value={locationInput} onChange={(e)=>setLocationInput(e.target.value)} className='w-full' autoFocus />
        {
          locationCode ?
          <div className='flex flex-column w-full gap-3 p-3 border-green-200 border-2 border-round-xl'>
            <h3 className='m-0'>Location Code</h3>
            <div>Location Code Found, waiting for Lot Id</div>
            <div className='text-lg'>{locationCode}</div>
          </div>
          :
          
          <div className='flex flex-column w-full gap-3 p-3 border-200 border-2 border-round-xl'>
            <h3 className='m-0'>Location Code</h3>
            <div>Waiting For Scan</div>
            <Skeleton height="2rem" className="mb-2" borderRadius="16px"></Skeleton>
          </div>
            
          
        }

        {
          locationLotId ?
          <div className='flex flex-column w-full gap-3 p-3 border-green-200 border-2 border-round-xl'>
            <h3 className='m-0'>Lot Id</h3>
            <div>Lot Id Found, waiting for Location Code</div>
            <div className='text-lg'>{locationLotId}</div>
          </div>
          :
          <div className='flex flex-column w-full gap-3 p-3 border-200 border-2 border-round-xl'>
            <h3 className='m-0'>Lot Id</h3>
            <div>Waitng For Lot Id Scan</div>
            <Skeleton height="2rem" className="mb-2" borderRadius="16px"></Skeleton>
          </div>
        }
        
        
        <Button className='w-full sm:w-6' label="Manual Submit" icon="pi pi-play" />
        <Button className='w-full sm:w-6' onClick={()=>{setStep(-1); setLocationCode(null); setLocationLotId(null)}} label="Exit Session" icon="pi pi-times" severity='danger' />
      </form>
      
      }
      
      {
        step == -1 &&
      <div className='flex flex-column gap-2 align-items-center'>
        <div className='text-900 text-xl mt-8'>To begin Enter your name below</div>
        <InputText onChange={(e)=>setName(e.target.value)} className='sm:w-6 w-10' placeholder='Name' />
        <Button className='sm:bottom-50 bottom-0 mb-8 w-11 sm:w-6 fixed' onClick={()=>{if (name) {document.documentElement.requestFullscreen(); setStep(-2); new Audio(success).play();} else {new Audio(error).play();}}} label="Begin Locating Session" icon="pi pi-map-marker" />
        <Button onClick={()=>{if (name) {document.documentElement.requestFullscreen(); nextStep(true)} else {nextStep(false)}}} className='sm:bottom-50 bottom-0 mb-3 w-11 sm:w-6 fixed' type='submit' label="Begin Uploading Session" icon="pi pi-cloud-upload" />
      </div>
      
      }

      {
        step == 0 &&
        <>
          <Camera
            idealFacingMode = {FACING_MODES.ENVIRONMENT}
            onTakePhoto = { (dataUri) => { if (images.length > 7) {setImages(images.splice(1, 8)); setImages(images => [...images,dataUri] );} else {setImages(images => [...images,dataUri] );}
            console.log(dataUri)
            axios.post('https://gavelbaseserver.herokuapp.com/api/addLotImage/', {image: dataUri}).then((res)=>{
              const {base64} = res.data;
              if (finalImages.length > 7) {setFinalImages(finalImages.splice(1, 8)); setFinalImages(finalImages => [...finalImages,base64] );} else {setFinalImages(finalImages => [...finalImages,base64] );}
            }).catch((err)=>{console.log(err.response);});
          } }
          />
          {
            images.length > 2 &&
            <Button onClick={()=>{nextStep(true)}} label='Continue' />
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
          <ListBox value={condition} onChange={(e) => {setCondition(e.value); nextStep(true)}} options={conditions} className="w-full md:w-14rem" />
          <Button label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
        </>
      }

      {
        step == 2 &&
        <>
          <div className='text-900 text-xl mt-8'>What is the product missing?</div>
          <ListBox multiple value={missing} onChange={(e) => setMissing(e.value)} options={missingStates} className="w-full md:w-14rem" />
          {
            missing.length > 0 ?
            <Button onClick={()=>{nextStep(true)}} label='Continue' />
            :
            <Button onClick={()=>{nextStep(true)}} label='Nothing' />
          }
          <Button label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
          
        </>
      }

      {
        step == 3 &&

        <>
          <div className='text-900 text-xl mt-8'>What is the product's testing status?</div>
          <ListBox value={status} onChange={(e) => {setStatus(e.value); nextStep(true)}} options={statuses} className="w-full md:w-14rem" />
          <Button label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
        </>
      }

      {
        step == 4 &&
        <form className='flex flex-column align-items-center gap-2' onSubmit={()=>nextStep(true)}>
          <div className='text-900 text-xl mt-8'>Scan or enter the Lot ID.</div>
          <InputText
            autoFocus
            value={lotId}
            onChange={(e) => {
              const inputValue = e.target.value.replace(/[^0-9]/g, '');
              setLotId(inputValue);
            }}
            className='sm:w-6 w-10'
            placeholder='Lot ID'
            inputMode='numeric'
            pattern='[0-9]*'
            autoComplete='off'
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
          <Button className='sm:w-6 w-11 bottom-0 fixed m-3' type='submit' label='Continue' />
          <Button label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
        </form>
      }

      {
        step == 5 &&
        <form className='flex flex-column align-items-center gap-2' onSubmit={()=>{handleUPC(); nextStep()}}>
          <div className='text-900 text-xl mt-8'>Scan or enter the products UPC (Barcode).</div>
          <InputText
            autoFocus
            value={upc}
            onChange={(e) => {
              const inputValue = e.target.value.replace(/[^0-9]/g, '');
              setUpc(inputValue);
            }}
            className='sm:w-6 w-10'
            placeholder='UPC'
            inputMode='numeric'
            pattern='[0-9]*'
            autoComplete='off'
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
          <Button className='sm:w-6 w-11 bottom-0 fixed m-3 mb-7' type='submit' label='Continue' />
          <Button label='Back' className='sm:w-6 w-11 bottom-0 fixed m-3' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
        </form>
      }

      {
        step == 6 && 
        <div className='flex flex-column align-items-center gap-4'>
          
          <div className='text-900 text-xl'>Confirm data below</div>
          <span className="p-float-label w-full">
            <InputText id="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={'w-full ' + (!brand && 'p-invalid')} />
            <label htmlFor="Brand">Brand</label>
          </span>
          <span className="p-float-label w-full">
            <InputText id="Title" value={title} onChange={(e) => setTitle(e.target.value)} className={'w-full ' + (!title && 'p-invalid')} />
            <label htmlFor="Title">Title</label>
          </span>
          <span className="p-float-label w-full">
            <InputTextarea id="Description" value={description} onChange={(e) => setDescription(e.target.value)} className={'w-full ' + (!description && 'p-invalid')} />
            <label htmlFor="Description">Description</label>
          </span>
          <span className="p-float-label w-full">
            <InputText id="Color" value={color} onChange={(e) => setColor(e.target.value)} className={'w-full ' + (!color && 'p-invalid')} />
            <label htmlFor="Color">Color</label>
          </span>
          <span className="p-float-label w-full">
            <InputText id="Model" value={model} onChange={(e) => setModel(e.target.value)} className={'w-full ' + (!model && 'p-invalid')} />
            <label htmlFor="Model">Model</label>
          </span>
          
          <div className='flex justify-content-around w-full'>

            <img className='w-4' src={stockImage ? stockImage : images[0]} />
            <div className='flex flex-column'>
              {
                stockImage ?
                  <Tag severity="success" value="Stock Image Found"></Tag>
                :
                  <Tag severity="danger" value="No Stock Image Found"></Tag>
              }
              <div className='text-900 text-xl'>Condition: {condition}</div>
              <div className='text-900 text-xl'>Missing:  
                {
                  missing.length > 0 ?
                  missing.map((item, index) => (
                    <span key={index}>{" "+item}, </span>
                  ))
                  :
                  ' Nothing'
                }
              </div>
              <div className='text-900 text-xl'>Status: {status}</div>
            </div>
            
          </div>
          <Button label='Back' severity='danger' className='w-full' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
          
          
          <Button className='sm:w-6 w-11 bottom-0 fixed mx-3 mb-8' type='submit' label='Send to Data Entry' />
          <Button className='sm:w-6 w-11 bottom-0 fixed m-3' onClick={()=>{handleSubmission(); new Audio(complete).play(); restart()}} label='Finish & Submit' />
        </div>
        
      }



      
      
      
      
      
      
      
      
      
      
      
      
      
      
      <Dialog header="Full Help WIP NOT FINISHED" visible={manual} className='w-full p-2 flex flex-column' onHide={() => setManual(false)}>
        <div className='w-12'>
          <h3>Step 1</h3>
          <p>Retrieve a product and apply a single lot label. Place it on a reasonable location preferably near the barcode of the product, but NOT over it.</p>
        </div>
        <Divider />
        <div className='w-12'>
          <h3>Step 2</h3>
          <p>Open and test the product by all available methods. Items should be tested by minimum viabillity in that it powers on, is intact, contains parts etc. Do not test products beyond initial use. If an item has a particular condition such as a broken piece or other oddities, leave the box opened for picturing. If you do not have a way to completely test a product, you can continue.</p>
        </div>
        <Divider />
        <div className='w-12'>
          <h3>Step 3</h3>
          <p>Every product requires that you take a minimum of 3 pictures. These three will be a front facing shot, a back facing shot, and a top down. Make sure the product is in the center of the frame, with margin. Also make sure to take the pictures level/even with the table. Lastly Take pictures of all oddities found while testing. 4-8 pictures is the goal.</p>
        </div>
        <Divider />
        <div className='w-12'>
          <h3>Step 4</h3>
          <p>Scan the Lot label applied earlier. This will upload as much information as possible about the product. If only partial information is found, you will be expected to perform manual entry according to the chart below. Descriptions should generally include relevant sizes according to the type of product, colors, compatible products etc. There will be a minimum length of 40 words. </p>
          <DataTable value={infoReq} tableStyle={{ minWidth: '50rem' }}>
            <Column field="field" header="field"></Column>
            <Column field="general" header="general requirments"></Column>
            <Column field="word" header="word requirements"></Column>
            <Column field="nots" header="DO-NOTS"></Column>
        </DataTable>
        </div>
        <Divider />
        <div className='w-12'>
          <h3>Step 5</h3>
          <p>Once you have completed the above steps, you can submit the product for review. If you have any questions, please contact your supervisor.</p>
        </div>
      </Dialog>
      
      
    </div>
  )
}
