// Import necessary dependencies and components
import React, { useEffect, useState } from 'react';
import useLib from '../../../Hooks/useLib';
import { toast } from 'react-toastify';
import Loading from '../../Loading/Loading';
import ImageUpload from '../../../Components/ImageUpload/ImageUpload';
import TextInput from '../../../Components/TextInput/TextInput';
import TextArea from '../../../Components/TextArea/TextArea';
import Button from '../../../Components/Button/Button';
import CategorySelect from '../../../Components/CategorySelect/CategorySelect';
import ConditionSelect from '../../../Components/ConditionSelect/ConditionSelect';
import ThumbnailContainer from '../../../Components/ThumbnailContainer/ThumbnailContainer';
import { Disclosure, Transition } from '@headlessui/react';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { ArrowBigDown, ArrowBigDownIcon, ArrowDown, ArrowDownIcon, FileWarning } from 'lucide-react';
import Toggle from '../../../Components/Toggle/Toggle';
import Select from '../../../Components/Select/Select';
import Autocomplete from '../../../Components/Autocomplete/Autocomplete';
import axios from 'axios';


// TEMPORARY DATA FOR THE SOURCE CUSTOMER LIST
const names = [
    { "id": 1, "name": "Alice" }
  ]
  
// Array to hold condition badge colors
const conditionBadgeColors = ['bg-color1', 'bg-color2', 'bg-color3', 'bg-color4', 'bg-color5', 'bg-color6', 'bg-color7', 'bg-color8', 'bg-color9', 'bg-color10'];







// Functional component 'Lot'
export default function Lot() {
    const [loading, setLoading] = useState(false);
    const [searchMode, setSearchMode] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [sources, setSources] = useState([{name: "Pick a Source"}]);
    // State to manage lot information, wether editing or creating a new lot
    const [lotObject, setLotObject] = useState({
        member: JSON.parse(decodeURIComponent(useLib.getCookie('gavelbase_member')))._id,
        lotNumber: 0,
        title: '',
        description: '',
        condition: {note: ''},
        images: [],
        details: {},
        source: {
            sourceId: 'asdf2323',
            consignment: false
        }

    });

    useEffect(() => {
        // get sources from the database
        axios.get(useLib.createServerUrl('/api/v1/source'), { withCredentials: true }).then((res) => {
            setSources(res.data);
            console.table(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    return (

        <>
            {
                loading ? <Loading loadingMessages={["Creating Lot.", "Creating Lot..", "Creating Lot..."]} />  :
                <div className="py-4 md:py-10 px-4 sm:px-6 lg:px-8 bg-gray-100 flex flex-col gap-2 h-full" >

                    {
                        // initial search to find an item that has been listed in the past
                        searchMode ?
                        <div>
                            <span className="text-3xl font-bold">Product Search</span>
                            <TextInput
                                placeholder={'Search for product info by upc, model, brand, title & more'}
                                clearable={true}
                                scanner={true}
                                setState={setSearchInput}
                                onChange={(e)=>setSearchInput(e.target.value)}
                                value={searchInput}
                            />
                            <div>
                                Use the search bar above to find a product that has been listed in the past. If you can't find the product you are looking for, you can create a new lot by clicking the button below.
                            </div>
                            <Button size="md" Icon={ExclamationTriangleIcon}  text="Create Without Match" onClick={()=>setSearchMode(false)} />
                        </div>

                    :
                    

                        <div className='flex flex-col justify-between h-full'>

                            
                            <div className='flex flex-col gap-2'>
                                <span className="text-3xl font-bold">Lot Summary</span>

                                <div className='flex gap-2'>
                                    <span className="text-1xl font-bold">Photos</span>
                                </div>

                                {/* Image upload component */}
                                {/* convert images to base64 for temp storage before uploading */}
                                <ImageUpload hints={lotObject.images.length+'/3 Required'} helpText={'Drag & Drop Images'} onChange={(e)=>setLotObject(prevState => ({ ...prevState, images: e }))} value={lotObject.images} />

                                <div className='flex gap-2 flex-col md:flex-row'>
                                    <TextInput placeholder={'Lot Number'} label={'Lot Number'} scanner={true} onChange={(e)=>setLotObject(prevState => ({ ...prevState, lotNumber: e.target.value }))} value={lotObject.lotNumber} />

                                    {/* Text input for lot title */}
                                    <TextInput 
                                        containerClassName={'w-full'} 
                                        placeholder={'Title'} 
                                        label={'Title'} 
                                        hints={lotObject.title.length+"/80"}
                                        clearable={true} 
                                        setState={(e)=>setLotObject(prevState => ({ ...prevState, title: e }))} 
                                        value={lotObject.title} 
                                        onChange={(e) => setLotObject(prevState => ({ ...prevState, title: e.target.value }))}
                                    />

                                </div>
                                
                                {/* Text area for lot description */}
                                <TextArea className={'min-h-20'} placeholder={'Description'} label={'Description'} value={lotObject.description} onChange={(e) => setLotObject(prevState => ({ ...prevState, description: e.target.value }))} />


                                <div className='flex gap-2'>
                                    {
                                        lotObject.condition.value ?
                                            // color will be green when true
                                            <CheckCircleIcon className="w-6 text-green-500" />
                                        :   
                                            // question mark icon will be orange
                                            <QuestionMarkCircleIcon className="w-6 text-yellow-300" />
                                        
                                    }
                                    <span className="text-1xl font-bold">Condition</span>
                                </div>
                                {/* Select menu for lot condition */}
                                <ConditionSelect
                                    condition={true}
                                    placeholder={'Select a condition'}
                                    // selectedOption={lotObject.condition}
                                    // Set the input lot's condition and select the current option to its condition regardless if it has been removed.
                                    // set the selectedOption to the selected option and set the lotObject condition to the selected option.
                                    onChange={(e) => setLotObject(prevState => ({ ...prevState, condition: e }))}
                                    options={JSON.parse(decodeURIComponent(useLib.getCookie('gavelbase_member'))).settings.conditions.map((condition) => {
                                        return {
                                            description: condition.description,
                                            name: condition.name,
                                            badgeColor: conditionBadgeColors[condition.value - 1] ? conditionBadgeColors[condition.value - 1] : 'bg-gray-400',
                                            value: condition.value
                                        };
                                    })}
                                />

                                {/* Text Area For condition notes */}
                                <TextArea className={'min-h-10'} placeholder={'Sounds funny, Dented, Scratched...'} label={'Condition Notes'} hints={'Displayed under condition info.'} value={lotObject.condition.note} onChange={(e) => setLotObject(prevState => ({ ...prevState, condition: { ...prevState.condition, note: e.target.value } }))} />
                                
                                <div className='flex gap-2'>
                                    {
                                        lotObject.category ?
                                            // color will be green when true
                                            <CheckCircleIcon className="w-6 text-green-500" />
                                        :   
                                            // question mark icon will be orange
                                            <QuestionMarkCircleIcon className="w-6 text-yellow-300" />
                                        
                                    }
                                    <span className="text-1xl font-bold">Category</span>
                                </div>

                                <CategorySelect
                                    value={lotObject.category}
                                    onChange={(e) => setLotObject(prevState => ({ ...prevState, category: e }))}
                                />

                                

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
                                                        <TextInput
                                                            placeholder={'UPC'}
                                                            label={'UPC'}
                                                            clearable={true}
                                                            scanner={true}
                                                            onChange={(e)=>setLotObject(prevState => ({ ...prevState, details: { ...prevState.details, upc: e.target.value } }))}
                                                            value={lotObject.details.upc && lotObject.details.upc}
                                                        />
                                                        <TextInput 
                                                            placeholder={'Model Number'} 
                                                            label={'Model Number'} 
                                                            clearable={true} scanner={true} 
                                                            onChange={(e)=>setLotObject(prevState => ({ ...prevState, details: { ...prevState.details, modelNumber: e.target.value } }))} 
                                                            value={lotObject.details.modelNumber && lotObject.details.modelNumber} 
                                                        />
                                                        <TextInput
                                                            placeholder={'Brand'} 
                                                            label={'Brand'} 
                                                            clearable={true}
                                                            onChange={(e)=>setLotObject(prevState => ({ ...prevState, details: { ...prevState.details, brand: e.target.value } }))} 
                                                            value={lotObject.details.brand && lotObject.details.brand}
                                                        />
                                                        <TextInput
                                                            placeholder={'Color'} 
                                                            label={'Color'} 
                                                            clearable={true}
                                                            onChange={(e)=>setLotObject(prevState => ({ ...prevState, details: { ...prevState.details, color: e.target.value } }))} 
                                                            value={lotObject.details.color && lotObject.details.color}
                                                        />
                                                        
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
                                                        {/* <Toggle label={'Single Consignment'} description={'Was this lot brought in by a customer or other reseller?'} onChange={(e)=>setLotObject(prevState => ({ ...prevState, source: { ...prevState.source, consignment: e } }))} /> */}
                                                        {/* if consignment == true then show a list of customers to search and use instead */}
                                                        {
                                                            lotObject.source.consignment ?
                                                            // OPTIONS SHOULD INCLUDE A LIST OF MULTIPLE NAMES THAT START WITH ANY RANDOM LETTERS OF THE ALPHABET AND THE LIST SHOULD BE VERY MIXED
                                                                <Autocomplete label={'Source'} placeholder={'Search for a customer or reseller'} options={sources} />
                                                            :
                                                                <Select options={
                                                                    // array of sources from the database
                                                                    sources.map((source) => {
                                                                        return {
                                                                            name: source.title,
                                                                            value: source._id
                                                                        };
                                                                    })
                                                                    
                                                                } 
                                                                label={'Source'}
                                                                 />
                                                        }
                                                        
                                                    </Disclosure.Panel>
                                                </Transition>
                                            </>
                                        )}
                                    </Disclosure>

                                    

                                    
                                </div>

                            </div>
                            
                            
                            <div className='flex flex-col py-4'>
                                {/* some text saying that the item can be changed any time and a preview button */}
                                <span className="text-sm text-gray-500">You can change these details at any time.</span>
                                
                                <Button size="md" Icon={CheckCircleIcon} text="Create Lot" onClick={()=>{
                                    setLoading(true);
                                    // remove badgeColor from condition object
                                    let lotObjectCopy = JSON.parse(JSON.stringify(lotObject));
                                    delete lotObjectCopy.condition.badgeColor;
                                    useLib.createLot(lotObjectCopy).then((res) => {
                                        setLotObject({
                                            member: JSON.parse(decodeURIComponent(useLib.getCookie('gavelbase_member')))._id,
                                            lotNumber: 0,
                                            title: '',
                                            description: '',
                                            condition: {note: ''},
                                            images: [],
                                            details: {},
                                            source: {
                                                sourceId: 'asdf2323',
                                                consignment: true
                                            }
                                        });
                                        setLoading(false);
                                        setSearchInput('');
                                        setSearchMode(true);
                                        // large toast with success message
                                        toast.success(()=>{
                                            return (
                                                <div className='flex flex-col'>
                                                    <span className="font-semibold text-xl">Lot Created!</span>
                                                    <div className='flex gap-2'>
                                                        <ThumbnailContainer className="h-10 w-10" src={res.data.images.length > 0 ? res.data.images[0] : null} />
                                                        <div className='flex flex-col gap-2'>
                                                            <span className="font-semibold">{lotObjectCopy.title}</span>
                                                            <span className="text-sm">{lotObjectCopy.lotNumber}</span>
                                                        </div>

                                                    </div>
                                                </div>
                                            )
                                        },
                                        {
                                            position: 'top-center',
                                        }
                                    );
                                    }).catch((err) => {

                                        // check each input for errors thrown on creation. I'd use a switch but I want to display all errors at once and maps or loops arent working

                                        if (err.condition) {
                                            toast.error(err.condition);
                                        }

                                        if (err.category) {
                                            toast.error(err.category);
                                        }

                                        if (err.lotNumber) {
                                            toast.error(err.lotNumber);
                                        }

                                        if (err.title) {
                                            toast.error(err.title);
                                        }

                                        if (err.description) {
                                            toast.error(err.description);
                                        }

                                        if (err.member) {
                                            toast.error(err.member);
                                        }
                                        

                                        

                                        if (!err.lotNumber && !err.title && !err.description && !err.condition && !err.member && !err.category) {
                                            toast.error('An error occurred, please try again later');
                                        }

                                        setLoading(false);
                                        
                                    });
                                    
                                }} />
                            </div>
                        </div>
                    }                            
                </div>
            }
        </>
        
    );
}
