import React, {useState, useEffect} from 'react'
import { Dialog } from '@headlessui/react'
import Button from '../Button/Button'
import { ArrowLeftIcon, ArrowRightIcon, PencilIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { CheckBadgeIcon } from '@heroicons/react/24/outline'
import { CheckCheckIcon, CheckCircle, EditIcon } from 'lucide-react'

// bring in category json file
import categories from '../../categories.json'
import { DotFilledIcon } from '@radix-ui/react-icons'

export default function CategorySelect({value, onChange, open=false}) {
    const [currentSelectedPath, setCurrentSelectedPath] = useState([])
    const [currentCategory, setCurrentCategory] = useState(value)
    const [openDialog, setOpenDialog] = useState(open)

    // find all subcategories based on the current path
    function findCategoriesByPath(path) {
        // Filter to get only those categories whose path length is one more than the given path
        const subCategories = categories.filter(category => 
            category.categoryPath.length === path.length + 1 && 
            category.categoryPath.slice(0, path.length).every((value, index) => value === path[index])
        );
        return subCategories;
    }

    // searches finds and returns a single category object entirely based on the path
    function findCategoryByPath(path) {
        let category = categories.find(category => JSON.stringify(category.categoryPath) === JSON.stringify(path));
        console.log(path)
        return category
    }
    // checks a path to see if it has any subcategories in the json file
    function hasSubcategories(path) {
        const nextLevel = path.length + 1;
        return categories.some(category => 
            category.categoryPath.length === nextLevel && 
            category.categoryPath.slice(0, path.length).every((value, index) => value === path[index])
        );
    }
    
    useEffect(() => {
        if (value) {
            setCurrentSelectedPath(value.categoryPath)
        }
    }, [])

    // set the currentSelectedPath to the current path everytime the currentCategory changes aka when the user clicks on a category
    useEffect(() => {
        setCurrentCategory(findCategoryByPath(currentSelectedPath))
    }, [currentSelectedPath])


    return (
        <div>
            
            <div className={openDialog && 'w-full h-full bg-gray-500 bg-opacity-50 tr absolute top-0 left-0'}>
                <Dialog className="overflow-y-auto absolute inset-0 flex items-center justify-center py-40" open={openDialog} onClose={(e)=>{}}>
                    <Dialog.Panel className="relative bg-white p-4 rounded-xl shadow-2xl border-1 border-grey-500 w-96 h-full m-auto ">
                        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                            <button
                                type="button"
                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => {
                                    onChange(null);
                                    setCurrentCategory(null)
                                    setOpenDialog(false)
                                    setCurrentSelectedPath([])
                                }}
                            >
                                <span className="sr-only">Close</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <Dialog.Title as="h3" className="text-lg font-semibold text-center">Select a category</Dialog.Title>
                        {
                            // map through the categories variable from the file at currentSelectedPath
                            findCategoriesByPath(currentSelectedPath).length > 0 ?
                                <div className="flex flex-col gap-2 mt-4 h-1/2 overflow-y-scroll">
                                    {findCategoriesByPath(currentSelectedPath).map((category, index) => (
                                        // if the sub category is the deepest then auto submit on selection
                                        <button key={index} className='flex justify-between bg-white hover:bg-gray-200 p-2 rounded-md' onClick={() => {
                                            setCurrentSelectedPath(category.categoryPath)
                                            if (!hasSubcategories(category.categoryPath)) {
                                                setOpenDialog(false); 
                                                onChange(currentCategory);
                                            }
                                        }}>
                                            <span className='ml-2'>{category.categoryPath[category.categoryPath.length - 1]}</span>
                                            {hasSubcategories(category.categoryPath) ? <ArrowRightIcon className='h-6 w-6'/> : <DotFilledIcon className='h-6 w-6'/>}
                                        </button>
                                    ))}
                                </div>
                            :
                                // if there are no subcategories, display the current category and a button to go back a category
                                <div className="flex flex-col gap-2 mt-4">
                                    {/* display last branch on currentpath */}
                                    <span className='text-center font-semibold'>
                                        {currentSelectedPath.slice().reverse()[0]}
                                    </span>
                                    
                                </div>
                                                

                                        
                        }

                        {/* buttons to control the dialog */}
                        <div className='flex gap-2'>
                            <Button text='Reset' className='mt-4 justify-between' Icon={ArrowLeftIcon} iconPosition='left' onClick={()=>{{setCurrentSelectedPath([])}}}/>
                            <Button text='Submit' className='mt-4 justify-between' Icon={CheckCircle} iconPosition='right' onClick={()=>{{setOpenDialog(false); onChange(currentCategory);}}}/>
                        </div>
                        {/* display the entire current chosen category path */}
                        <div className="flex justify-center mt-4 text-gray-500">
                            {currentSelectedPath.join(' > ')}
                        </div>
                    </Dialog.Panel>
                </Dialog>


                
            </div>



            {/* rendered current selection so the user can tell what theyve selected */}
            {
                currentCategory ?

                    <div className="flex flex-col gap-2 cursor-pointer mt-2" onClick={(e) => {setOpenDialog(true); setCurrentSelectedPath([])}}>
                        <div className='flex gap-2'>
                            <PencilSquareIcon className="h-6 w-6" />
                            <span className='text-start underline font-semibold'>
                                {currentCategory.categoryPath[currentCategory.categoryPath.length - 1]}
                            </span>
                        </div>
                        <span className='text-gray-500'>
                            {currentCategory.categoryPath.join(' > ')}
                        </span>
                    </div>
                :
                    <div className="flex justify-center cursor-pointer mt-4 text-gray-500 gap-2" onClick={(e) => {setOpenDialog(true)}}>
                        <PencilSquareIcon className="h-6 w-6" />
                        <span className="underline font-medium">No Category Selected</span>
                    </div>
            }
        </div>
    )
}
