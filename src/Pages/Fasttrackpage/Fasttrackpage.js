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

  const [step, setStep] = useState(-2);
  const [mode, setMode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manual, setManual] = useState(false);

  const [name, setName] = useState('');

  const [palletId, setPalletId] = useState(null);

  const [lotId, setLotId] = useState(null);

  const [upc, setUpc] = useState(null);
  const [searchInput, setSearchInput] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  
  const [bufferimg, setBufferimg] = useState(null); // datauri buffer because the camera comp is weird and wont allow me to push to state
  const [images, setImages] = useState([]);
  const [productInfo, setProductInfo] = useState({});

  const [condition, setCondition] = useState('');
  const [conditionInput, setConditionInput] = useState(''); // this is the input for the condition

  const [missing, setMissing] = useState([]);
  const [missingInput, setMissingInput] = useState(''); // this is the input for the missing item
  
  const [status, setStatus] = useState('');
  const [statusInput, setStatusInput] = useState('');

  const [itemCount, setItemCount] = useState(1);


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
    setItemCount(1);
    setSearchInput('');


    
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
      case 'submit':
        new Audio(complete).play();
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
            if (res.data.items[i].images) {
              setStockImage(res.data.items[i].images[0]);
              setFinalImages(res.data.items[i].images.concat(finalImages));
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

  function handleSearch () {
    return new Promise((resolve, reject) => {
      axios.get(`https://gavelbaseserver.herokuapp.com/api/lot/search/${searchInput}`, { withCredentials: true })
        .then((res) => {
          setSearchResults(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    });
  }  
        

  

  function handleSubmission() {
    if (itemCount < 1) {
      message('error', 'Item count must be greater than 0');
      return;
    }

    if (condition == '') {
      message('error', 'Condition must be selected');
      return;
    }

    if (status == '') {
      message('error', 'Status must be selected');
      return;
    }
    

    

    setIsLoading(true);
    axios.post('https://gavelbaseserver.herokuapp.com/api/addLotImage/', {images: images, lotnumber: lotId}).then((res)=>{
      axios.post('https://gavelbaseserver.herokuapp.com/api/appendLot', [
        lotId,
        palletId,
        '=IMAGE(getFirstItemInStringifiedArray(INDIRECT(ADDRESS(ROW(), COLUMN()+1))))',
        JSON.stringify(finalImages.concat(res.data)), //concat the images after being uploaded to the s3 bucket
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
        itemCount,
        name,
        new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
        
      ], {withCredentials: true}).then((res)=>{
        console.log("=TO_TEXT("+palletId+")")
        setIsLoading(false);
        // message('submit', 'Lot Added Successfully');
        restart();
        new Audio(complete).play();
          
      }).catch((err)=>{
        message('error', 'Lot Failed to Add');
        // setIsLoading(false);
        console.log(err);
      })
    }).catch((err)=>{
      message('error', 'Lot Failed to Add');
      // setIsLoading(false);
      console.log(err.response);
    });
    
  }

  function handleManualSubmission(e) {
    e.preventDefault();
    if (locationInput.split('-')[0] == 'loc' || locationInput.split('-')[0] == 'Loc') {
      setLocationInput(locationInput.replace('Loc', 'loc'))
      setLocationCode(locationInput.replace('loc-', ''));
    }
    if (locationInput.split('-')[0] == 'lot' || locationInput.split('-')[0] == 'Lot') {
      setLocationInput(locationInput)
      setLocationLotId(locationInput.replace('lot-', ''));
    }
    if (!(locationInput.split('-')[0] == 'lot' || locationInput.split('-')[0] == 'Lot')&!(locationInput.split('-')[0] == 'loc' || locationInput.split('-')[0] == 'Loc')) {
      message('error', 'Invalid Location/Lot Scan');
    }
    setLocationInput('');
    
    
  }

  function editLot(lotId) {

    axios.get('https://gavelbaseserver.herokuapp.com/api/getLot?lotNumber='+lotId, {withCredentials: true}).then((res)=>{
      let missingStatesTemp = missingStates.concat(JSON.parse(res.data[10]));
      missingStatesTemp = [...new Set(missingStatesTemp)]
      setLotId(lotId);
      setImages(JSON.parse(res.data[1]));
      // setFinalImages(res.data.images);
      setUpc(res.data[2]);
      setCondition(res.data[9]);
      setMissing(JSON.parse(res.data[10]));
      setMissingStates(missingStatesTemp);
      setStatus(res.data[11]);
      setBrand(res.data[7]);
      // setTitle(res.data[3]);
      // setDescription(res.data[4]);
      setColor(res.data[8]);
      setModel(res.data[6]);
      setStockImage(res.data[5]);
      setStep(5);
    }).catch((err)=>{
      console.log(err.response);
    });
  }

  useEffect(()=>{
    if (locationCode && locationLotId) {
      // updateLot
      axios.post('https://gavelbaseserver.herokuapp.com/api/updateLot', {lotId: locationLotId, loc: locationCode, locator: name, pallet: palletId, time: new Date().toLocaleString() }, {withCredentials: true}).then((res)=>{
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
    <div className='flex flex-column h-screen w-full align-items-center justify-content-center'>
      
      <ProgressSpinner />
      <h2>Loading...</h2>
    </div>
    :
    <div className='flex w-full flex-column w-full align-items-centers gap-2 p-2'>
      <div className='flex sm:justify-content-between justify-content-center w-full align-items-center'>
        <button className='sm:w-2 sm:block hidden ' style={{border: 'none', background: 'none'}}>
          <img className='w-full ' onClick={()=>{setStep(-1)}} src={Logo} />
        </button>
        {step >= 0 &&
        <div className='sm:flex flex-column border-200 border-1 border-round'>
          <div className='text-900 sm:text-l text-m flex align-items-center justify-content-center sm:px-3 px-1'>
            pal-{palletId}
          </div>
          <div className='p-inputgroup w-auto sm:h-auto h-2rem'>
            
              <>
                <Button severity='info' label="Change Pallet" icon="pi pi-box" onClick={()=>{setStep(-1); setPalletId(null)}} />
                <Button label="Menu" icon="pi pi-bars" onClick={() => setManual(true)} />
              </>
              
            
          </div>
        </div>
        }
        
      </div>
      

      {
        step == -3 &&
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
        step == -2 &&
      <div className='flex flex-column gap-2 align-items-center'>
        <div className='text-900 text-xl mt-8'>To begin Enter your name below</div>
        <InputText onChange={(e)=>setName(e.target.value)} className='sm:w-6 w-10' placeholder='Name' />
        <Button className='sm:bottom-50 bottom-0 mb-8 w-11 sm:w-6 fixed' onClick={()=>{if (name) {nextStep(true); setMode('locate');} else {new Audio(error).play();}}} label="Begin Locating Session" icon="pi pi-map-marker" />
        <Button onClick={()=>{if (name) {nextStep(true);  setMode('upload');} else {nextStep(false)}}} className='sm:bottom-50 bottom-0 mb-3 w-11 sm:w-6 fixed' type='submit' label="Begin Uploading Session" icon="pi pi-cloud-upload" />
      </div>
      
      }
      
      {
        step == -1 &&
        <form className='flex flex-column align-items-center gap-2' onSubmit={(e)=>{
        e.preventDefault();
        if ((palletId.includes('pal-') || palletId.includes('Pal-')) && palletId.length === 8) {
          setPalletId(palletId.split('-')[1]);
          if (mode === 'locate') {
            setStep(-3);
            new Audio(success).play();
          }else{
            nextStep(true);
          }
          
        }else{
          setPalletId('');
          message('error', 'Invalid Pallet Id Scan');
        }
        
        }}>
          <div className='text-900 text-xl mt-8'>Scan or enter the Pallet ID.</div>
          <div className='p-inputgroup w-9'>
            <InputText
              autoFocus
              value={palletId}
              onChange={(e) => {
                const inputValue = e.target.value
                setPalletId(inputValue);
              }}
              className='sm:w-6 w-10'
              placeholder='Pallet ID'
              autoComplete='off'
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
            />

            <Button type='button' severity='danger' icon=' pi pi-times' onClick={()=>{setPalletId('')}} />

          </div>
          
          <div className='sm:w-6 w-full bottom-0 fixed flex flex-column gap-2 p-2 surface-100 shadow-3'>
            <Button className='w-full' type='button' label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
            <Button className='w-full' severity='success' type='submit' label='Continue' />
          </div>
          
          
        </form>
      
      }

      {
        step == 0 &&
        <>
          <Camera
            idealFacingMode = {FACING_MODES.ENVIRONMENT}
            onTakePhoto = { (dataUri) => { if (images.length > 7) {setImages(images.splice(1, 8)); setImages(images => [...images,dataUri] );} else {setImages(images => [...images,dataUri] );}
            // console.log(dataUri)
            
          } }
          />
          {
            images.length > 1 &&
            <Button onClick={()=>{
              nextStep(true);
            }} label='Continue' />
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

          <div className='sm:w-6 w-full bottom-0 left-0 fixed flex flex-column gap-2 p-2 surface-100 shadow-3'>
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

          <div className='sm:w-6 w-full bottom-0 left-0 fixed flex flex-column gap-2 p-2 surface-100 shadow-3'>
            <div className='w-full p-inputgroup'>
              <InputText value={missingInput} onChange={(e)=>{setMissingInput(e.target.value)}} placeholder='Custom' />
              <Button label='Add' onClick={()=>{setMissingStates(missingStates=>[...missingStates, missingInput]); setMissing(missing => [...missing, missingInput])}}></Button>
            </div>
            
            <Button className='w-full' label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
            
            {
              missing.length > 0 ?
              <Button severity='success' onClick={()=>{nextStep(true)}} label='Continue' />
              :
              <Button severity='info' onClick={()=>{nextStep(true)}} label='Nothing' />
            }
          </div>
        </>
      }

      {
        step == 3 &&

        <>
          <div className='text-900 text-xl mt-8'>What is the product's testing status?</div>
          <ListBox value={status} onChange={(e) => {setStatus(e.value); nextStep(true)}} options={statuses} className="w-full md:w-14rem" />
          
          <div className='sm:w-6 w-full bottom-0 left-0 fixed flex flex-column gap-2 p-2 surface-100 shadow-3'>
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
        <form className='flex flex-column align-items-center gap-2' onSubmit={(e)=>{
        e.preventDefault();
        if ((lotId.includes('lot-') || lotId.includes('Lot-') ) && lotId.length === 10) {
          setLotId(lotId.split('-')[1]);

          nextStep(true);
        }

        if (lotId.includes('?lot=lot-')) {
          setLotId(lotId.split('=')[1].replace('lot-', ''));
          nextStep(true);
        }

        if (!(lotId.includes('?lot=lot-')) && !(lotId.includes('lot-') && lotId.length === 10)) {
          setLotId('');
          message('error', 'Invalid Lot Id Scan');
        }
        
        }}>
          <div className='text-900 text-xl mt-8'>Scan or enter the Lot ID.</div>
          <div className='p-inputgroup w-9'>
            <InputText
              autoFocus
              value={lotId}
              onChange={(e) => {
                const inputValue = e.target.value
                setLotId(inputValue);
              }}
              className='sm:w-6 w-10'
              placeholder='Lot ID'
              autoComplete='off'
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
            />

            <Button type='button' severity='danger' icon=' pi pi-times' onClick={()=>{setLotId('')}} />

          </div>
          
          <div className='sm:w-6 w-full bottom-0 fixed flex flex-column gap-2 p-2 surface-100 shadow-3'>
            <Button className='w-full' type='button' label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
            <Button className='w-full' severity='success' type='submit' label='Continue' />
          </div>
          
          
        </form>
      }

      {
        step == 5 &&
        <form className='flex flex-column align-items-center gap-2' onSubmit={(e)=>{
          e.preventDefault();
          handleUPC().then(()=>{
            nextStep(); 
            setIsLoading(false)
            }).catch(()=>{nextStep(); setIsLoading(false)}); setIsLoading(true) }}>
          <div className='text-900 text-xl mt-8 text-center'>Scan or enter the products UPC (Barcode).</div>
          <div className='p-inputgroup w-9'>
            <InputText
              autoFocus
              id='UPC'
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
            <Button type='button' severity='danger' icon=' pi pi-times' onClick={()=>{setUpc(''); document.getElementById("UPC").focus();}} />
          </div>
          <div className='text-900 text-xl text-center'>Or search for an item by keyword, model, or brand</div>
          <div className='p-inputgroup w-9'>
            <InputText
              placeholder='Keyword Search'
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              className='sm:w-6 w-10'
              autoComplete='off'

            />
            <Button type='button' severity='info' icon=' pi pi-search' onClick={()=>{handleSearch()}} />
          </div>

          <div className='flex flex-column gap-2 w-full'>
            {searchResults.products && <div className='text-900 text-xl'>Product Info</div>}
            {
              searchResults.products &&
              searchResults.products.map((item, index) => (
                <div key={index} className='flex border-round flex-column gap-2 w-full p-2 surface-100 shadow-3' onClick={()=>{
                  setBrand(item.brand);
                  setTitle(item.title);
                  setDescription(item.description);
                  setColor(item.color);

                  if (item.model) {
                    setModel(item.model);
                  }else{
                    setModel(item.mpn);
                  }
                  // setStockImage(res.data.items[i].images[0]);
                  
                  // setFinalImages(res.data.items[i].images.concat(finalImages));
                  setFinalImages(item.images.concat(finalImages));
                  setStockImage(item.images[0]);
                  nextStep(true);
                  
                }}>
                  <div className='flex gap-1 w-full justify-content-between'>
                    {
                      item.images.length > 0 &&
                      <img className=' w-2' src={item.images[0]} /> 
                    }
                    
                    <div className='text-900 text-m text-overflow-ellipsis'>{item.title}</div>
                  </div>
                  <div className='flex w-full justify-content-between'>
                    <div className='flex flex-column'>
                      <div>UPC:</div>
                      <div className='text-900 text-m'>{item.barcode_number}</div>
                    </div>

                    <div className='flex flex-column'>
                      <div>Model:</div>
                      <div className='text-900 text-m'>{item.model?item.model:item.mpn?item.mpn:'Unkown'}</div>
                    </div>
                  </div>
                </div>
              ))
            }

          </div>

          <div className='sm:w-6 w-full bottom-0 fixed flex flex-column gap-2 p-2 surface-100 shadow-3'>
            <div className='flex w-full p-inputgroup'>
              <Button className='w-6' type='button' label='Back' severity='danger' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1); setLotId('lot-'+lotId)}} />
              <Button className='w-full' onClick={()=>nextStep()} type='button' label='Continue Without Search' />
            </div>
            
            <Button className='w-full' severity='success' type='submit' label='Continue' />
          </div>
        </form>
      }

      {
        step == 6 && 
        <div className='flex flex-column align-items-center gap-4 pt-3'>
          
          <span className="p-float-label w-full">
            <InputNumber inputMode='numeric' id="Quantity" value={itemCount} onChange={(e) => {setItemCount(e.value);}} className={'w-full ' + (!itemCount && 'p-invalid')} />
            <label htmlFor="Quantity">Quantity</label>
          </span>
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
          <div className='flex gap-2 w-full'>
            <span className="p-float-label w-full">
              <InputText id="Color" value={color} onChange={(e) => setColor(e.target.value)} className={'w-full ' + (!color && 'p-invalid')} />
              <label htmlFor="Color">Color</label>
            </span>
            <span className="p-float-label w-full">
              <InputText id="Model" value={model} onChange={(e) => setModel(e.target.value)} className={'w-full ' + (!model && 'p-invalid')} />
              <label htmlFor="Model">Model</label>
            </span>
          </div>
          
          
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
          
          
          <div className='sm:w-6 w-full bottom-0 fixed flex flex-column gap-2 p-2 surface-100 shadow-3'>
            <Button label='Back' severity='danger' className='w-full' icon=' pi pi-chevron-left' onClick={()=>{setStep(step-1)}} />
            {/* <Button className='w-full' type='submit' label='Send to Data Entry' /> */}
            <Button severity='success' className='w-full' onClick={()=>{handleSubmission();}} label='Finish & Submit' />
          </div>

        </div>
        
      }



      
      
      
      <Dialog header="Menu" visible={manual} className='w-full p-2 flex flex-column' onHide={() => {setManual(false);}}>
        <FasttrackMenu functions={{open: setManual, editLot: editLot, message: message, restart: restart}} />   
      </Dialog>
        
      
      
      
      
      
      
      
      
      
      
      
      
      <Toast position="top-center" ref={toast} />
      <div className='h-20rem'></div>

      

    </div>

  }
  </>
  )
}
