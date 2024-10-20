import { useEffect, useState, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import { Disclosure } from '@headlessui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarLoader } from 'react-spinners';
import {
  CheckIcon,
  ChevronDownIcon,
  MapPinIcon,
  ArrowUturnDownIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';

import TextInput from '../../Components/TextInput/TextInput';
import TextArea from '../../Components/TextArea/TextArea';
import Button from '../../Components/Button/Button';
import ConditionSelect from '../../Components/ConditionSelect/ConditionSelect';
import TagSelect from '../../Components/TagSelect/TagSelect';
import ImageUpload from '../../Components/ImageUpload/ImageUpload';

export default function EditLot() {
    const navigate = useNavigate();

  const { lotId } = useParams();
  const [lotInfo, setLotInfo] = useState(null);
  const [editedLotInfo, setEditedLotInfo] = useState(null);
  const [preAiInfo, setPreAiInfo] = useState(null);
  const [gptStatus, setGptStatus] = useState(false);

  useEffect(() => {
    const fetchLotInfo = async () => {
      try {
        const response = await axiosInstance.get('/v1/crew/lot/fullInfo', {
          params: { lotId: lotId },
        });
        setLotInfo(response.data.lot);
        setEditedLotInfo(response.data.lot);
        setPreAiInfo(response.data.lot);
      } catch (error) {
        console.log('Error fetching lot info:', error);
        toast.error('Error fetching lot information.');
      }
    };

    fetchLotInfo();
  }, [lotId]);

  if (!lotInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  async function handleEditSubmit() {
    try {
      const tagIds = editedLotInfo.tags.map((tag) => tag._id);

      const response = await axiosInstance.put('/v1/crew/lot/edit/' + lotId, {
        title: editedLotInfo.title,
        description: editedLotInfo.description,
        lotNumber: editedLotInfo.lotNumber,
        tags: tagIds,
        condition: editedLotInfo.condition.id,
        conditionDescription: editedLotInfo.conditionDescription,
        images: editedLotInfo.images,
        details: editedLotInfo.details,
      });

      toast.success('Lot details updated successfully!');
      
      // Navigate to a different route after success
      navigate('/dashboard/lots'); // Change to your desired route

      return response;
    } catch (error) {
      console.log(error);
      toast.error('Failed to submit lot information.');
      throw error;
    }
  }

  async function chatgptFix() {
    setGptStatus('Loading');
    try {
      const response = await axiosInstance.post('/v1/crew/lot/chatgpt-fix', {
        itemTitle: editedLotInfo.title,
        itemDescription: editedLotInfo.description,
        itemImages: editedLotInfo.images,
        upc: editedLotInfo.details.upc,
        model: editedLotInfo.details.model,
        brand: editedLotInfo.details.brand,
      });

      const { itemTitle, itemDescription, upc, brand, model } = response.data;

      setPreAiInfo((prevState) => ({
        ...prevState,
        title: lotInfo.title,
        description: lotInfo.description,
        details: {
          ...prevState.details,
          upc: Number(lotInfo.details.upc),
          model: Number(lotInfo.details.model),
          brand: Number(lotInfo.details.brand),
        },
      }));

      setEditedLotInfo((prevState) => ({
        ...prevState,
        title: itemTitle,
        description: itemDescription,
        details: {
          ...prevState.details,
          upc: Number(upc),
          model: model,
          brand: brand,
        },
      }));

      setGptStatus('Complete');
      toast.success('AI completion successful!');
      return response;
    } catch (error) {
      console.log(error);
      setGptStatus(false);
      toast.error('AI completion failed.');
      throw error;
    }
  }

  return (
    <div className="mx-auto p-3">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1 mb-3">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Edit Lot
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <MapPinIcon
                aria-hidden="true"
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              />
              {lotInfo.locationHistory[0]
                ? lotInfo.locationHistory[0].label
                : 'Not Located'}
            </div>

            {editedLotInfo.tags.length > 0 && (
              <div className="mt-2 flex items-center text-sm gap-1 text-gray-500">
                {editedLotInfo.tags.map((tag) => (
                  <div
                    key={tag._id}
                    style={{
                      color: tag.color,
                      backgroundColor: tag.backgroundColor,
                    }}
                    className="rounded-full px-2 text-xs flex items-center h-full"
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span className="ml-3 hidden sm:block">
            {gptStatus === 'Complete' ? (
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => {
                  setEditedLotInfo((prevState) => ({
                    ...prevState,
                    title: preAiInfo.title,
                    description: preAiInfo.description,
                    details: {
                      ...prevState.details,
                      upc: Number(preAiInfo.details.upc),
                      model: preAiInfo.details.model,
                      brand: preAiInfo.details.brand,
                    },
                  }));
                  setGptStatus(false);
                  toast.info('AI changes undone.');
                }}
              >
                <ArrowUturnDownIcon
                  aria-hidden="true"
                  className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                />
                Undo AI
              </button>
            ) : (
              <button
                disabled={gptStatus === 'Loading'}
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => chatgptFix()}
              >
                <SparklesIcon
                  aria-hidden="true"
                  className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                />
                {gptStatus === false ? (
                  <>AI Completion</>
                ) : (
                  <BarLoader width={60} />
                )}
              </button>
            )}
          </span>

          <span className="sm:ml-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
            >
              <CheckIcon
                aria-hidden="true"
                className="-ml-0.5 mr-1.5 h-5 w-5"
              />
              Submit
            </button>
          </span>
        </div>
      </div>

      <form className="space-y-3">
        <ImageUpload
          preUploadedImages={lotInfo.images}
          onChange={(e) =>
            setEditedLotInfo((prevState) => ({
              ...prevState,
              images: e,
            }))
          }
        />

        <div className="flex gap-3 w-full">
          <TextInput
            id="lotNumber"
            type="number"
            label="Lot Number"
            value={editedLotInfo.lotNumber}
            onChange={(e) =>
              setEditedLotInfo((prevState) => ({
                ...prevState,
                lotNumber: parseInt(e.target.value),
              }))
            }
            placeholder="Enter Lot Number"
            required
          />
          <TextInput
            id="title"
            label="Title"
            containerClassName="w-full"
            value={editedLotInfo.title}
            onChange={(e) => {
              if (e.target.value.length <= 80) {
                setEditedLotInfo((prevState) => ({
                  ...prevState,
                  title: e.target.value,
                }));
              }
            }}
            suffix={editedLotInfo.title.length + '/80'}
            placeholder="Enter Lot Title"
            required
          />
        </div>

        <TextArea
          id="description"
          value={editedLotInfo.description}
          label="Description"
          onChange={(e) =>
            setEditedLotInfo((prevState) => ({
              ...prevState,
              description: e.target.value,
            }))
          }
          placeholder="Enter Lot Description"
          multiline
          rows={4}
          required
        />

        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                <span>Lot Details</span>
                <ChevronDownIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-gray-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <TextInput
                  id="upc"
                  label="UPC"
                  type="number"
                  suffix={
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(
                          editedLotInfo.details.upc
                        );
                        toast.info('UPC copied to clipboard!');
                      }}
                      className="cursor-pointer"
                    >
                      Copy
                    </a>
                  }
                  value={editedLotInfo.details?.upc || ''}
                  onChange={(e) =>
                    setEditedLotInfo((prevState) => ({
                      ...prevState,
                      details: {
                        ...prevState.details,
                        upc: Number(e.target.value),
                      },
                    }))
                  }
                  placeholder="Enter UPC"
                />

                <TextInput
                  id="model"
                  label="Model"
                  value={editedLotInfo.details?.model || ''}
                  onChange={(e) =>
                    setEditedLotInfo((prevState) => ({
                      ...prevState,
                      details: {
                        ...prevState.details,
                        model: e.target.value,
                      },
                    }))
                  }
                  suffix={
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(
                          editedLotInfo.details.model
                        );
                        toast.info('Model copied to clipboard!');
                      }}
                      className="cursor-pointer"
                    >
                      Copy
                    </a>
                  }
                  placeholder="Enter Model"
                />

                <TextInput
                  id="brand"
                  label="Brand"
                  value={editedLotInfo.details?.brand || ''}
                  onChange={(e) =>
                    setEditedLotInfo((prevState) => ({
                      ...prevState,
                      details: {
                        ...prevState.details,
                        brand: e.target.value,
                      },
                    }))
                  }
                  placeholder="Enter Brand"
                />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <ConditionSelect
          label="Condition"
          selectedOption={lotInfo.condition}
          onChange={(e) =>
            setEditedLotInfo((prevState) => ({
              ...prevState,
              condition: {
                value: e.value,
                id: e.id,
                name: e.name,
                useNotes: e.useNotes,
              },
            }))
          }
        />

        {editedLotInfo.condition.useNotes && (
          <TextArea
            label="Condition Description"
            value={editedLotInfo.conditionDescription}
            onChange={(e) =>
              setEditedLotInfo((prevState) => ({
                ...prevState,
                conditionDescription: e.target.value,
              }))
            }
          />
        )}

        <TagSelect
          selectedTags={lotInfo.tags}
          label="Tags"
          onChange={(e) =>
            setEditedLotInfo((prevState) => ({
              ...prevState,
              tags: e,
            }))
          }
        />
      </form>
      <div>
      <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location History</label>
            <div className="mt-2 space-x-2 flex">
              {lotInfo.locationHistory && lotInfo.locationHistory.length > 0 ? (
                lotInfo.locationHistory.map((location, index) => (
                  <div
                    key={index}
                    className="p-2 border border-gray-300 rounded-md bg-gray-50"
                  >
                    <div className="flex justify-between w-full">
                      <p className="font-bold">{location.label || 'N/A Label'}</p>
                      {index === 0 && <p className="text-green-500 font-bold">Current</p>}
                    </div>
                    <p className="text-gray-400">{new Date(location.createdAt).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <span className="text-gray-500">No Location History Available</span>
              )}
            </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Information
            </label>
            <div className="mt-1 p-4 border border-gray-300 rounded-md bg-gray-50">
              {lotInfo.source ? (
                <div className="space-y-2">
                  <p>
                    <strong>Name (Title):</strong> {lotInfo.source.name}
                  </p>
                  {lotInfo.source.orderedAt && (
                    <p>
                      <strong>Ordered At:</strong>{' '}
                      {new Date(lotInfo.source.orderedAt).toLocaleString()}
                    </p>
                  )}
                  {lotInfo.source.createdAt && (
                    <p>
                      <strong>Created At:</strong>{' '}
                      {new Date(lotInfo.source.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-gray-500">No Source Information Available</span>
              )}
            </div>
          </div>

          
          </div>
        </div>
    </div>
  );
}
