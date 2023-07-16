import React, {useState} from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';


export default function FasttrackMenu({open}) {
    const [manual, setManual] = useState(true)
    return (
        <Dialog header="Menu" visible={manual} className='w-full p-2 flex flex-column' onHide={() => {setManual(false); open(false)}}>
            <div className='w-12 flex flex-column gap-2'>
                <Button label='Edit Mode'></Button>
                <Button label='View Past Entries'></Button>
            </div>
        </Dialog>
    )
}
