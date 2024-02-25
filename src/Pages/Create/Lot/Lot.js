import React from 'react'
import useLib from '../../../Hooks/useLib'
import TextInput from '../../../Components/TextInput/TextInput'
import TextArea from '../../../Components/TextArea/TextArea'
import SelectMenu from '../../../Components/SelectMenu/SelectMenu'
import { Dialog } from '@headlessui/react'
import { AirplayIcon } from 'lucide-react'


export default function Lot() {
    const [open, setOpen] = React.useState(true)
    return (
        <div>
            <TextInput placeholder={'Title'} label={'Title'} clearable={true} />
            <TextArea placeholder={'Description'} label={'Description'} />
            <SelectMenu 
            label={'Condition'} 
            condition={true}
            placeholder={'Select a condition'}
            options={JSON.parse(decodeURIComponent(useLib.getCookie('gavelbase_settings'))).conditions.map((condition) => {
                return {id: condition.id, description: condition.description, name: condition.name, badgeColor: 'bg-color'+condition.value.toString()}
            })}
            />

        </div>
    )
}
