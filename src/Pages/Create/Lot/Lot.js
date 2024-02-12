import React from 'react'
import TextInput from '../../../Components/TextInput/TextInput'
import { Dialog } from '@headlessui/react'
import { AirplayIcon } from 'lucide-react'


export default function Lot() {
    const [open, setOpen] = React.useState(true)
    const actions = [
        {
            title: 'Deactivate',
            onClick: () => setOpen(true),
            className: 'bg-red-600 text-white hover:bg-red-700'
        },
        {
            title: 'Cancel',
            onClick: () => setOpen(false),
            className: 'bg-gray-600 text-white hover:bg-gray-700'
        }
    ]
    return (
        <div>

            <TextInput placeholder={'Title'} scanner={true}  />
            <TextInput label="Lot Description" trailingIcon={<AirplayIcon className='h-5 w-5 text-gray-400' />} />
            <TextInput label="Lot Location" helpText={'This is so you know where the item is.'} />
            <TextInput label="Lot Size" scanner={true} />
            <TextInput label="Lot Type" />
            <TextInput label="Lot Price" />
        </div>
    )
}
