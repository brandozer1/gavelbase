// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import useLib from '../../../Hooks/useLib';
import PageHeading from '../../../Components/PageHeading/PageHeading';
import ImageUpload from '../../../Components/ImageUpload/ImageUpload';
import TextInput from '../../../Components/TextInput/TextInput';
import TextArea from '../../../Components/TextArea/TextArea';
import SelectMenu from '../../../Components/SelectMenu/SelectMenu';
import Dropzone from 'react-dropzone';
import { Dialog } from '@headlessui/react';
import { AirplayIcon } from 'lucide-react';

// Array to hold condition badge colors
const conditionBadgeColors = ['bg-color1', 'bg-color2', 'bg-color3', 'bg-color4', 'bg-color5', 'bg-color6', 'bg-color7', 'bg-color8', 'bg-color9', 'bg-color10'];

// Functional component 'Lot'
export default function Lot() {
    // State to manage lot information, wether editing or creating a new lot
    const [lotInfo, setLotInfo] = useState({
        title: 'Sub Pump',
        description: 'dd',
        condition: {value: 3, name: 'Nedw', description: 'New', note: 'sounds funny'},
        images: []
    });

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-100 flex flex-col gap-2" >
            <PageHeading title={'Create Lot'} />
            {/* Image upload component */}
            <ImageUpload label={'Pictures'} hints={lotInfo.images.length+'/3 Required'} />

            {/* Text input for lot title */}
            <TextInput placeholder={'Title'} label={'Title'} clearable={true} value={lotInfo.title} onChange={(e) => setLotInfo(prevState => ({ ...prevState, title: e.target.value }))} />

            {/* Text area for lot description */}
            <TextArea placeholder={'Description'} label={'Description'} value={lotInfo.description} onChange={(e) => setLotInfo(prevState => ({ ...prevState, description: e.target.value }))} />

            {/* Select menu for lot condition */}
            <SelectMenu
                label={'Condition'}
                condition={true}
                placeholder={'Select a condition'}
                // Set the input lot's condition and select the current option to its condition regardless if it has been removed.
                selectedOption={{
                    name: lotInfo.condition.name,
                    description: lotInfo.condition.description,
                    value: lotInfo.condition.value,
                    badgeColor: conditionBadgeColors[lotInfo.condition.value]
                }}
                // set the selectedOption to the selected option and set the lotInfo condition to the selected option.
                onChange={(e) => setLotInfo(prevState => ({ ...prevState, condition: e }))}
                options={JSON.parse(decodeURIComponent(useLib.getCookie('gavelbase_settings'))).conditions.map((condition) => {
                    return {
                        description: condition.description,
                        name: condition.name,
                        badgeColor: conditionBadgeColors[condition.value - 1] ? conditionBadgeColors[condition.value - 1] : 'bg-gray-400',
                        value: condition.value
                    };
                })}
            />

            {/* Text Area For condition notes */}
            <TextArea placeholder={'Sounds funny, Dented, Scratched...'} label={'Condition Notes'} hints={'This will be displayed under the title'} value={lotInfo.condition.note} />
        </div>
    );
}
