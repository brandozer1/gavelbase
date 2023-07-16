import React, { useState, useEffect, useRef} from 'react'

import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import {ProgressSpinner} from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Camera from 'react-html5-camera-photo';
import { ListBox } from 'primereact/listbox';
import axios from 'axios';
import { FACING_MODES } from 'react-html5-camera-photo';
import FasttrackMenu from '../../Components/FasttrackMenu/FasttrackMenu';
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
    'New Open Box',
    'Slightly Used',
    'Used',
    'Parts & Repair',
  ]

  const statuses = [
    'Tested Works',
    'Tested Works w/ Cosmetic Damage',
    'Partially Tested Works',
    'Unable to Test'
  ]

  const toast = useRef(null);

  const [missingStates, setMissingStates] = useState([
    'Battery',
    'Cable(s)',
    'Attatchment',
    'Quantity',
    'Bag'
  ]);

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
  const [missingInput, setMissingInput] = useState(''); // this is the input for the missing item
  const [conditionInput, setConditionInput] = useState(''); // this is the input for the condition
  const [statusInput, setStatusInput] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);


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
    setLotId(null)
    setMissingInput('');
    setConditionInput('');
    setStatusInput('');
    setFinalImages([]);

    
  }

  function message(type, message) {
    toast.current.show({severity: type, summary: message, life: 3000});
    switch (type) {
      case 'success':
        new Audio(success).play();
        break;
      case 'error':
        new Audio(error).play();
        break;
      default:
        break;
    }
  }


  function handleUPC() {
    return new Promise((resolve, reject) => {
      axios.get(`https://gavelbaseserver.herokuapp.com/api/lookup/${upc}`, { withCredentials: true })
        .then((res) => {
          console.log(res.data);
          setProductInfo(res.data);
          for (let i = 0; i < res.data.items.length; i++) {
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
          resolve(); // Resolve the promise with the response data
        })
        .catch((err) => {
          new Audio(error).play();
          console.log(err.response);
          reject(); // Reject the promise with the error
        });
    });
  }
  

  function handleSubmission() {

    if (missing) {
      setDescription('Missing: ' + JSON.stringify(missing) + ', ' + description);
    }
    
    axios.post('https://gavelbaseserver.herokuapp.com/api/appendLot', [
      lotId,
      JSON.stringify(finalImages),
      upc,
      condition + ' ' + title + ' | ' + status + (missing.length > 0 ? ' | MISSING ITEMS SEE DESCRIPTION' : ''),
      (missing.length> 0 ? "Missing: "+JSON.stringify(missing).replace('"', '')+" | ": '')+ "Condition: "+condition+' | Testing Status: '+status+' | '+description,
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
  <>
  {
    isLoading ?
    <div className='flex w-full align-items-center justify-content-center'>
      <ProgressSpinner />
    </div>
    :
    <div className='flex w-full flex-column w-full align-items-centers gap-2 p-2'>
      <div className='flex justify-content-between w-full align-items-center'>
        <button className='sm:w-2 w-4 ' style={{border: 'none', background: 'none'}}>
          <img className=' w-full ' onClick={()=>{setStep(-1)}} src={Logo} />
        </button>
        
        <div className='p-inputgroup w-auto sm:h-auto h-2rem'>
          <Button label="Menu" icon="pi pi-bars" onClick={() => setManual(true)} />
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
        <Button className='sm:bottom-50 bottom-0 mb-8 w-11 sm:w-6 fixed' onClick={()=>{if (name) {setStep(-2); new Audio(success).play();} else {new Audio(error).play();}}} label="Begin Locating Session" icon="pi pi-map-marker" />
        <Button onClick={()=>{if (name) {nextStep(true)} else {nextStep(false)}}} className='sm:bottom-50 bottom-0 mb-3 w-11 sm:w-6 fixed' type='submit' label="Begin Uploading Session" icon="pi pi-cloud-upload" />
      </div>
      
      }

      {
        step == 0 &&
        <>
          <Camera
            idealFacingMode = {FACING_MODES.ENVIRONMENT}
            onTakePhoto = { (dataUri) => { if (images.length > 7) {setImages(images.splice(1, 8)); setImages(images => [...images,dataUri] );} else {setImages(images => [...images,dataUri] );}
            // console.log(dataUri)
            axios.post('https://gavelbaseserver.herokuapp.com/api/addLotImage/', {image: dataUri}).then((res)=>{
              
              if (finalImages.length > 7) {setFinalImages(finalImages.splice(1, 8)); setFinalImages(finalImages => [...finalImages,res.data] );} else {setFinalImages(finalImages => [...finalImages,res.data] );}
              console.log(res.data);
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

          <div className='sm:w-6 w-full bottom-0 left-0 fixed flex flex-column gap-2 p-2 surface-ground shadow-3'>
            <div className='p-inputgroup w-full'>
              <InputText value={conditionInput} onChange={(e)=>{setConditionInput(e.target.value)}} placeholder='Custom' />
              <Button label='Set Custom' onClick={()=>{setCondition(conditionInput); nextStep(true)}}></Button>
            </div>
            <Button className='w-full' label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
          </div>
        </>
      }

      {
        step == 2 &&
        <>
          <div className='text-900 text-xl mt-8'>What is the product missing?</div>
          <ListBox multiple value={missing} onChange={(e) => setMissing(e.value)} options={missingStates} className="w-full md:w-14rem" />

          <div className='sm:w-6 w-full bottom-0 left-0 fixed flex flex-column gap-2 p-2 surface-ground shadow-3'>
            <div className='w-full p-inputgroup'>
              <InputText value={missingInput} onChange={(e)=>{setMissingInput(e.target.value)}} placeholder='Custom' />
              <Button label='Add' onClick={()=>{setMissingStates(missingStates=>[...missingStates, missingInput]); setMissing(missing => [...missing, missingInput])}}></Button>
            </div>
            
            <Button className='w-full' label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
            
            {
              missing.length > 0 ?
              <Button onClick={()=>{nextStep(true)}} label='Continue' />
              :
              <Button onClick={()=>{nextStep(true)}} label='Nothing' />
            }
          </div>
        </>
      }

      {
        step == 3 &&

        <>
          <div className='text-900 text-xl mt-8'>What is the product's testing status?</div>
          <ListBox value={status} onChange={(e) => {setStatus(e.value); nextStep(true)}} options={statuses} className="w-full md:w-14rem" />
          
          <div className='sm:w-6 w-full bottom-0 left-0 fixed flex flex-column gap-2 p-2 surface-ground shadow-3'>
            <div className='p-inputgroup w-full'>
              <InputText value={statusInput} onChange={(e)=>{setStatusInput(e.target.value)}} placeholder='Custom Status' />
              <Button label='Use Custom' onClick={()=>{setStatus(statusInput); nextStep(true)}}></Button>
            </div>
            <Button className='w-full' label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
          </div>
        </>
      }

      {
        step == 4 &&
        <form className='flex flex-column align-items-center gap-2' onSubmit={(e)=>{if (lotId.includes('LOT-')) {
          setLotId(lotId.replace('LOT-', ''));
          nextStep(true);
        }else{
          message('error', 'Invalid Lot ID Scan');
        }
        e.preventDefault();
        }}>
          <div className='text-900 text-xl mt-8'>Scan or enter the Lot ID.</div>
          <InputText
            autoFocus
            value={lotId}
            onChange={(e) => {
              const inputValue = e.target.value
              setLotId(inputValue);
            }}
            className='sm:w-6 w-10'
            placeholder='Lot ID'
            inputMode='numeric'
            autoComplete='off'
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
          />
          <div className='sm:w-6 w-full bottom-0 fixed flex flex-column gap-2 p-2 surface-ground shadow-3'>
            <Button className='w-full' label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
            <Button className='w-full' type='submit' label='Continue' />
          </div>
          
          
        </form>
      }

      {
        step == 5 &&
        <form className='flex flex-column align-items-center gap-2' onSubmit={()=>{handleUPC().then(()=>{nextStep(); setIsLoading(false)}).catch(()=>{nextStep(); setIsLoading(false)}); setIsLoading(true) }}>
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
          <div className='sm:w-6 w-full bottom-0 fixed flex flex-column gap-2 p-2 surface-ground shadow-3'>
            <Button className='w-full' label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
            <Button className='w-full' type='submit' label='Continue' />
          </div>
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
          
          
          <div className='sm:w-6 w-full bottom-0 fixed flex flex-column gap-2 p-2 surface-ground shadow-3'>
          <Button label='Back' severity='danger' className='w-full' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
            <Button className='w-full' type='submit' label='Send to Data Entry' />
            <Button className='w-full' onClick={()=>{handleSubmission(); new Audio(complete).play(); restart()}} label='Finish & Submit' />
          </div>

        </div>
        
      }



      
      
      
      {
        manual &&
        <FasttrackMenu open={setManual} />
      }
      
      
      
      
      
      
      
      
      
      
      
      <Toast ref={toast} />
      <div className='h-20rem'></div>

      

    </div>

  }
  </>
  )
}
