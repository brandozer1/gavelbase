import React, {useState, useEffect} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';

        




export default function Aucitionassemblypage() {
    const [page, setPage] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [update, setUpdate] = useState(false)
    const [palletInput, setPalletInput] = useState('')
    const [pallets, setPallets] = useState([])

    const [titleTemplateBefore, setTitleTemplateBefore] = useState('')
    const [titleTemplateAfter, setTitleTemplateAfter] = useState('')
    const [descriptionTemplateBefore, setDescriptionTemplateBefore] = useState('')
    const [descriptionTemplateAfter, setDescriptionTemplateAfter] = useState('')

    const downloadImages = async (pallets) => {
        const response = await axios.post('https://gavelbaseserver.herokuapp.com/api/auction/getImages', { pallets }, { responseType: 'blob' }).then((response) => {setIsLoading(false); return response});
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.getElementById('imageDownload');
        link.href = url;
        let now = new Date().toISOString().slice(0,10).replace(/-/g, "/");
        link.setAttribute('download', 'images'+now+'.zip');
        
    }

    function removePallet(pallet) {
        let temp = pallets;
        temp.splice(temp.indexOf(pallet), 1)
        setPallets(temp);
        setUpdate(!update)
    }
                                

  return (
    <div className='w-screen p-3 gap-3 flex'>
        {
            isLoading ? 
            <div className='w-6 flex flex-column align-items-center gap-3'>
                <ProgressSpinner />
            </div>
            :
        
        <div className='w-6 flex flex-column align-items-center gap-3'>
            <h1>Auction Assembly</h1>
            <div className='p-inputgroup'>
                <InputText value={palletInput} onChange={(e)=>{setPalletInput(e.target.value)}} placeholder="Enter Pallet ID" className='inputtext-p' />
                <Button onClick={()=>{setPallets([...pallets, palletInput]);setPalletInput('')}} label="Add Pallet" className='button-p' />
            </div>
            <div>
                {
                    pallets.length > 0 ? pallets.map((pallet) => {
                        return (
                            <div className='flex align-items-center'>
                                <div className='p-2 text-xl '>{pallet}</div>
                                <Button severity='danger' icon="pi pi-times" className='button-p w-2rem h-2rem' onClick={(e)=>{removePallet(pallet)}} />

                            </div>
                        )
                    })
                    :
                    <div className='p-2'>No Pallets Added</div>
                }
            </div>
            <div className='w-full flex flex-column align-items-center'>
                <h3>Title Template</h3>
                <div>*quantity* = quantity, *condition* = condition, *testingstatus* = testing status, *missing* = missing array ie "[thing 1, thing 2, etc]"</div>
                <div className='flex p-inputgroup'>
                    <InputText value={titleTemplateBefore} onChange={(e)=>setTitleTemplateBefore(e.target.value)} className='w-full text-right'/>
                    <div className='p-2'>
                        TITLE
                    </div>
                    <InputText value={titleTemplateAfter} onChange={(e)=>setTitleTemplateAfter(e.target.value)} className='w-full'/>
                </div>
                <div>{titleTemplateBefore}<span>TITLE</span>{titleTemplateAfter}</div>
            </div>
            <div className='w-full flex flex-column align-items-center'>
                <h3>Description Template</h3>
                <div className='flex p-inputgroup'>
                    <InputText value={descriptionTemplateBefore} onChange={(e)=>setDescriptionTemplateBefore(e.target.value)} className='w-full text-right'/>
                    <div className='p-2'>
                        DESCRIPTION
                    </div>
                    <InputText value={descriptionTemplateAfter} onChange={(e)=>setDescriptionTemplateAfter(e.target.value)} className='w-full'/>
                </div>
                <div>{descriptionTemplateBefore}<span>DESCRIPTION</span>{descriptionTemplateAfter}</div>
            </div>
            

            <Button label='Assemble Auction' onClick={()=>{downloadImages(pallets); setIsLoading(true); setPallets([])}} />
        </div>
        }
        <div>
            <a id="imageDownload">
                <Button label='Download Images' />
            </a>
            <a>
                <Button label='Download Import Sheet' />
            </a>
        </div>

        <div className='w-6 flex flex-column gap-3 align-items-center'>
            <h1>Auction Preview</h1>
            <div className='flex justify-content-between w-full p-3 border-round surface-ground gap-2 shadow-2'>
                <div className='flex gap-2'>
                    {
                        <Skeleton size="7rem"></Skeleton>
                    }
                    <div className='flex flex-column'>
                        <div>TITLE</div>
                        <div className='text-sm text-900'>DESCRIPTION</div>
                    </div>
                </div>
                <div className='flex flex-column'>
                    <span>Lot #:</span>
                    <span>Pallet #:</span>
                    <span>Make:</span>  
                    <span>Model:</span>
                    <span>Color:</span>
                </div>
            </div>

        </div>
        
    </div>
  )
}
