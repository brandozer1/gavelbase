import React, {useState} from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';       
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Fieldset } from 'primereact/fieldset';
import { Editor } from 'primereact/editor';

import './Createauctionpage.css'
        
export default function Createauctionpage() {
    const [templates, setTemplates] = useState([
        {name: 'Template 1', value: 'template1'},
        {name: 'Template 2', value: 'template2'},
        {name: 'Template 3', value: 'template3'},
        {name: 'Template 4', value: 'template4'}
    ])
    const [chosenTemplate, setChosenTemplate] = useState('')
    const [templateVisible, setTemplateVisible] = useState(false)

    const [auctionTitle, setAuctionTitle] = useState('')
    const [startTime, setStartTime] = useState(null);
    const [locations, setLocations] = useState([{label: 'newLocation'}])
    const [newLocation, setNewLocation] = useState('');
    const [description, setDescription] = useState('');
    const [auctionTerms, setAuctionTerms] = useState('');

    function handleTemplate (e) {
        setTemplateVisible(false);
    }

    function handleNewLocation () {
        setLocations(locations.concat([{label: newLocation}]));  // push isnt working for some reason
        setNewLocation('');
    }

    return (
        <div className='w-12 h-screen' style={{overflowY: 'scroll'}}>
            
            <div className="surface-section px-4 py-5 ">
                <div className="flex md:align-items-center md:justify-content-between flex-column md:flex-row pb-4 border-bottom-1 surface-border">
                    <div className="flex align-items-center">
                        <i className="pi pi-file-edit text-2xl mr-3 text-500"></i>
                        <span className="text-3xl font-medium text-900">Create New Auction</span>
                    </div>
                    <div className="mt-3 md:mt-0">
                        <Button onClick={()=>setTemplateVisible(true)} label="Use Auction Template" icon="pi pi-copy" />
                    </div>
                </div>
                <div className='flex flex-column gap-4 pt-5 w-full'>
                    <div className='p-float-label'>
                        <InputText className='w-full' />
                        <label>Auction Title</label>
                    </div>
                    <div className='p-float-label'>
                        <Calendar className='w-full' selectionMode="range" value={startTime} onChange={(e) => setStartTime(e.value)} showTime hourFormat="12" />
                        <label>Auction Time Range (Start Time - End Time)</label>
                    </div>
                    <ListBox listStyle={{ height: '15rem' }} virtualScrollerOptions={{ itemSize: 38}} optionLabel="label" options={locations} filter filterTemplate={
                        <div className='flex justify-content-between align-items-center w-full'>
                            <span className='text-xl'>Auction Locations</span>
                            <div className='flex gap-3 w-5'>
                                <InputText value={newLocation} onChange={(e)=>setNewLocation(e.target.value)} placeholder='New Location' className='w-8 h-full' />
                                <Button onClick={()=>{handleNewLocation()}} label='Add Location' className='h-full px-3 w-4' />
                            </div>
                        </div>
                    } />
                    <div className='flex gap-3 w-full'>
                        <div className='flex flex-column w-6'>
                            <span>Auction Description</span>
                            <Editor className='w-full' value={description} onTextChange={(e) => setDescription(e.htmlValue)} style={{ height: '320px' }} />
                        </div>
                        <div className='flex flex-column w-6'>
                            <span>Auction Terms</span>
                            <Editor className='w-full' value={auctionTerms} onTextChange={(e) => setAuctionTerms(e.htmlValue)} style={{ height: '320px' }} />
                        </div>
                    </div>
                    <div className='p-float-label'>
                        <input className='w-full' />
                        <label>Auction Contact</label>
                    </div>

                    <div className='flex gap-3'>
                        <Button label='Send to Template' outlined />
                        <Button label='Create Auction'/>
                    </div>
                </div>
            </div>
            <Dialog className='w-4' header="Choose Template" footer={<Button onClick={()=>handleTemplate()} disabled={!chosenTemplate}>Use Template</Button>} visible={templateVisible} onHide={() => setTemplateVisible(false)}>
                <ListBox filter value={chosenTemplate} onChange={(e) => setChosenTemplate(e.value)} options={templates} optionLabel="name" className="w-full" />
            </Dialog>
        </div>
    )
}
