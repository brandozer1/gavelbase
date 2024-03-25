// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import useLib from '../../../Hooks/useLib';
import PageHeading from '../../../Components/PageHeading/PageHeading';
import ImageUpload from '../../../Components/ImageUpload/ImageUpload';
import TextInput from '../../../Components/TextInput/TextInput';
import TextArea from '../../../Components/TextArea/TextArea';
import Button from '../../../Components/Button/Button';
import ConditionSelect from '../../../Components/ConditionSelect/ConditionSelect';
import { Disclosure, Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { ArrowBigDown, ArrowBigDownIcon, ArrowDown, ArrowDownIcon } from 'lucide-react';
import Toggle from '../../../Components/Toggle/Toggle';
import Select from '../../../Components/Select/Select';
import Autocomplete from '../../../Components/Autocomplete/Autocomplete';

const names = [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Amelia" },
    { "id": 3, "name": "Aaron" },
    { "id": 4, "name": "Bella" },
    { "id": 5, "name": "Benjamin" },
    { "id": 6, "name": "Bethany" },
    { "id": 7, "name": "Charlotte" },
    { "id": 8, "name": "Christopher" },
    { "id": 9, "name": "Catherine" },
    { "id": 10, "name": "David" },
    { "id": 11, "name": "Danielle" },
    { "id": 12, "name": "Daniel" },
    { "id": 13, "name": "Emily" },
    { "id": 14, "name": "Ethan" },
    { "id": 15, "name": "Ella" },
    { "id": 16, "name": "Fiona" },
    { "id": 17, "name": "Frederick" },
    { "id": 18, "name": "Felicia" },
    { "id": 19, "name": "Gabriel" },
    { "id": 20, "name": "Grace" },
    { "id": 21, "name": "George" },
    { "id": 22, "name": "Hannah" },
    { "id": 23, "name": "Henry" },
    { "id": 24, "name": "Haley" },
    { "id": 25, "name": "Isabella" },
    { "id": 26, "name": "Ian" },
    { "id": 27, "name": "Ivy" },
    { "id": 28, "name": "Jack" },
    { "id": 29, "name": "Jessica" },
    { "id": 30, "name": "Jacob" },
    { "id": 31, "name": "Kevin" },
    { "id": 32, "name": "Katherine" },
    { "id": 33, "name": "Kyle" },
    { "id": 34, "name": "Liam" },
    { "id": 35, "name": "Lily" },
    { "id": 36, "name": "Lucas" },
    { "id": 37, "name": "Matthew" },
    { "id": 38, "name": "Madison" },
    { "id": 39, "name": "Megan" },
    { "id": 40, "name": "Nathan" },
    { "id": 41, "name": "Nora" },
    { "id": 42, "name": "Noah" },
    { "id": 43, "name": "Olivia" },
    { "id": 44, "name": "Owen" },
    { "id": 45, "name": "Oliver" },
    { "id": 46, "name": "Peter" },
    { "id": 47, "name": "Penelope" },
    { "id": 48, "name": "Patrick" },
    { "id": 49, "name": "Quinn" },
    { "id": 50, "name": "Quentin" },
    { "id": 51, "name": "Queenie" },
    { "id": 52, "name": "Ryan" },
    { "id": 53, "name": "Rachel" },
    { "id": 54, "name": "Rebecca" },
    { "id": 55, "name": "Sophia" },
    { "id": 56, "name": "Samuel" },
    { "id": 57, "name": "Samantha" },
    { "id": 58, "name": "Thomas" },
    { "id": 59, "name": "Taylor" },
    { "id": 60, "name": "Tyler" },
    { "id": 61, "name": "Uma" },
    { "id": 62, "name": "Uri" },
    { "id": 63, "name": "Ulysses" },
    { "id": 64, "name": "Victoria" },
    { "id": 65, "name": "Vincent" },
    { "id": 66, "name": "Vanessa" },
    { "id": 67, "name": "William" },
    { "id": 68, "name": "Wendy" },
    { "id": 69, "name": "Walter" },
    { "id": 70, "name": "Xavier" },
    { "id": 71, "name": "Xena" },
    { "id": 72, "name": "Xander" },
    { "id": 73, "name": "Yasmine" },
    { "id": 74, "name": "Yvette" },
    { "id": 75, "name": "Yale" },
    { "id": 76, "name": "Zachary" },
    { "id": 77, "name": "Zoe" },
    { "id": 78, "name": "Zara" }
  ]
  


// Array to hold condition badge colors
const conditionBadgeColors = ['bg-color1', 'bg-color2', 'bg-color3', 'bg-color4', 'bg-color5', 'bg-color6', 'bg-color7', 'bg-color8', 'bg-color9', 'bg-color10'];

// Functional component 'Lot'
export default function Lot() {
    // State to manage lot information, wether editing or creating a new lot
    const [lotObject, setLotObject] = useState({
        title: '',
        description: '',
        condition: {value: 3, name: 'Nedw', description: 'New', note: ''},
        images: [],
        source: {
            sourceId: 'asdf2323',
            consignment: true
        }

    });

    useEffect(() => {
        console.log(lotObject);
    }, [lotObject]);

    return (
        <div className="py-4 md:py-10 px-4 sm:px-6 lg:px-8 bg-gray-100 flex flex-col gap-2 h-100" >
            <span className="text-3xl font-bold">Create Lot</span>

            {/* Image upload component */}
            <ImageUpload label={'Pictures'} hints={lotObject.images.length+'/3 Required'} helpText={'Drag & Drop Images'} onChange={(e)=>setLotObject(prevState => ({ ...prevState, images: e }))} value={lotObject.images} />

            <div className='flex gap-2 flex-col md:flex-row'>
                <TextInput placeholder={'Lot Number'} label={'Lot Number'} scanner={true} />

                {/* Text input for lot title */}
                <TextInput containerClassName={'w-full'} placeholder={'Title'} label={'Title'} clearable={true} setState={(e)=>setLotObject(prevState => ({ ...prevState, title: e }))} value={lotObject.title} onChange={(e) => setLotObject(prevState => ({ ...prevState, title: e.target.value }))} />

            </div>
            
            {/* Text area for lot description */}
            <TextArea placeholder={'Description'} label={'Description'} value={lotObject.description} onChange={(e) => setLotObject(prevState => ({ ...prevState, description: e.target.value }))} />

            {/* Select menu for lot condition */}
            <ConditionSelect
                label={'Condition'}
                condition={true}
                placeholder={'Select a condition'}
                // Set the input lot's condition and select the current option to its condition regardless if it has been removed.
                selectedOption={{
                    name: lotObject.condition.name,
                    description: lotObject.condition.description,
                    value: lotObject.condition.value,
                    badgeColor: conditionBadgeColors[lotObject.condition.value]
                }}
                // set the selectedOption to the selected option and set the lotObject condition to the selected option.
                onChange={(e) => setLotObject(prevState => ({ ...prevState, condition: e }))}
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
            <TextArea placeholder={'Sounds funny, Dented, Scratched...'} label={'Condition Notes'} hints={'This will be displayed under the title'} value={lotObject.condition.note} onChange={(e) => setLotObject(prevState => ({ ...prevState, condition: { ...prevState.condition, note: e.target.value } }))} />
            
            {/* disclosure for lot details  */}
            {/* add a divider with a header saying Lot Details, and a disclosure for the lot details */}
            <div className="flex flex-col gap-2">
                {/* <hr className="border-t border-gray-300" /> */}
                <Disclosure>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex justify-between align-center w-full py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                <span className='text-lg'>Details</span>
                                {/* make the icon use hero icons */}
                                {/* center it */}
                                <ArrowDownIcon className={`${open ? 'transform rotate-180' : ''} w-5 text-gray-500`} aria-hidden="true" />
                            </Disclosure.Button>
                            <Transition
                                show={open}
                                enter="transition-all duration-300 ease-out"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                            >
                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                    <TextInput placeholder={'Model Number'} label={'Model Number'} clearable={true} scanner={true} />
                                    <TextInput placeholder={'Brand'} label={'Brand'} clearable={true} />
                                    <TextInput placeholder={'Serial Number'} label={'Serial Number'} clearable={true} scanner={true} />
                                    <TextInput placeholder={'UPC'} label={'UPC'} clearable={true} scanner={true} />
                                </Disclosure.Panel>
                            </Transition>
                        </>
                    )}
                </Disclosure>
                
                <hr className="border-t border-gray-300" />
                {/* "Lot Source" */}
                <Disclosure>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="flex justify-between align-center w-full py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                <span className='text-lg'>Source</span>
                                {/* make the icon use hero icons */}
                                {/* center it */}
                                <ArrowDownIcon className={`${open ? 'transform rotate-180' : ''} w-5 text-gray-500`} aria-hidden="true" />
                            </Disclosure.Button>
                            <Transition
                                show={open}
                                enter="transition-all duration-300 ease-out"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                            >
                                <Disclosure.Panel className="pl-4 py-2 text-sm gap-2 flex flex-col">
                                    <Toggle label={'Consignment'} description={'Was this lot brought in by a customer or other reseller?'} onChange={(e)=>setLotObject(prevState => ({ ...prevState, source: { ...prevState.source, consignment: e } }))} />
                                    {/* if consignment == true then show a list of customers to search and use instead */}
                                    {
                                        lotObject.source.consignment ?
                                        // OPTIONS SHOULD INCLUDE A LIST OF MULTIPLE NAMES THAT START WITH ANY RANDOM LETTERS OF THE ALPHABET AND THE LIST SHOULD BE VERY MIXED
                                            <Autocomplete label={'Source'} placeholder={'Search for a customer or reseller'} options={names} />
                                        :
                                            <Select options={[{name: 'Truckload ref#08435 (3/22/2024)', value: 'customer'}, {name: 'Truckload ref#98234 (3/23/2024)', value: 'reseller'}, {name: 'Auction Purchase ref#516188 (3/12/2024)'}]} label={'Source'} />
                                    }
                                    
                                </Disclosure.Panel>
                            </Transition>
                        </>
                    )}
                </Disclosure>
                
                <Button size="md" icon={<CheckCircleIcon />} text="Create Lot" />
            </div>
            
            
        </div>
    );
}
