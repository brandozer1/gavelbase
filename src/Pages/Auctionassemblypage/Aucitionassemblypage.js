import React, {useState, useEffect} from 'react'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';

        




export default function Aucitionassemblypage() {
    const [page, setPage] = useState([])
    const [update, setUpdate] = useState(false)
    const [palletInput, setPalletInput] = useState('')
    const [pallets, setPallets] = useState([])

    const [titleTemplateBefore, setTitleTemplateBefore] = useState('')
    const [titleTemplateAfter, setTitleTemplateAfter] = useState('')
    const [descriptionTemplateBefore, setDescriptionTemplateBefore] = useState('')
    const [descriptionTemplateAfter, setDescriptionTemplateAfter] = useState('')


    function removePallet(pallet) {
        let temp = pallets;
        temp.splice(temp.indexOf(pallet), 1)
        setPallets(temp);
        setUpdate(!update)
    }
                                

  return (
    <div className='w-screen flex flex-column align-items-center'>
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

        <Button label='Assemble Auction' />

    </div>
  )
}