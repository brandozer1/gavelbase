import React, {useState} from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';       
import { Dropdown } from 'primereact/dropdown';
export default function Createlotpage() {
    const [templates, setTemplates] = useState([
        {name: 'Template 1', value: 'template1'},
        {name: 'Template 2', value: 'template2'},
        {name: 'Template 3', value: 'template3'},
        {name: 'Template 4', value: 'template4'}
    ])
    const [chosenTemplate, setChosenTemplate] = useState('')
    const [templateVisible, setTemplateVisible] = useState(false)

    const [auctions, setAuctions] = useState([
        {label: 'auction 1', value: 'auction1'},
        {label: 'auction 2', value: 'auction2'},
        {label: 'auction 3', value: 'auction3'}
    ]);
    const [chosenAuction, setChosenAuction] = useState('')


    function handleTemplate (e) {
        setTemplateVisible(false);
    }

    return (
        <div className='w-12'>
            
            <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
                <div className="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border">
                    <div className="flex align-items-center">
                        <i className="pi pi-file-edit text-2xl mr-3 text-500"></i>
                        <span className="text-3xl font-medium text-900">Add Lot</span>
                    </div>
                    <div className="mt-3 md:mt-0">
                        <Button onClick={()=>setTemplateVisible(true)} label="Use Lot Template" icon="pi pi-copy" />
                    </div>
                </div>
                <div className='flex flex-column w-full'>
                    <div className='p-float-label'>
                        <Dropdown className='w-full' value={chosenAuction} onChange={(e)=>{setChosenAuction(e.value)}} options={auctions} />
                        <label>Choose Auction</label>
                    </div>
                    <div className='flex gap-3'>
                        <Button label='Send to Template' outlined />
                        <Button label='Add Lot'/>
                    </div>
                </div>
                

            </div>
            <Dialog className='w-4' header="Choose Template" footer={<Button onClick={()=>handleTemplate()} disabled={!chosenTemplate}>Use Template</Button>} visible={templateVisible} onHide={() => setTemplateVisible(false)}>
                <ListBox filter value={chosenTemplate} onChange={(e) => setChosenTemplate(e.value)} options={templates} optionLabel="name" className="w-full" />
            </Dialog>
        </div>
    )
}