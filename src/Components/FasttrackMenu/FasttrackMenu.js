import React, {useState} from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

export default function FasttrackMenu({functions}) {
    const [editInput, setEditInput] = useState('')
    return (
        <div className='w-12 flex flex-column gap-2 mt-1'>
            
            <form className='p-inputgroup' onSubmit={(e)=>{
                e.preventDefault()
                if (!editInput.includes('lot-')) {
                    functions.message('error', 'Invalid Lot ID')
                }else{
                    functions.editLot(editInput.replace('lot-', ''))
                    functions.open(false);
                }
                
            }}>
                <InputText onChange={(e)=>setEditInput(e.target.value)} placeholder='Lot ID to edit' ></InputText>
                <Button severity='info' icon='pi pi-file-edit' label='Edit'></Button>
            </form>
            <Button severity='info' label='View Past Entries'></Button>
        </div>
        
    )
}
