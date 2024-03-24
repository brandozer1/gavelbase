import { useState } from 'react'
import { Switch } from '@headlessui/react'
import useSound from 'use-sound'
import switchtoggle from '../../Assets/Audio/switchtoggle.mp3'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Toggle({ 
  enabled = false,
  onChange = () => {},
  label = '',
  description = '',
  switchClassName = '',
  labelClassName = '',
  descriptionClassName = '',
  playSound = true
}) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const [playswitchtoggle] = useSound(switchtoggle, { volume: 0.25 })

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled)
    onChange(!isEnabled)
    if (playSound === true) {
        playswitchtoggle()
    }
    
  }

  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex flex-grow flex-col">
        {label && (
          <Switch.Label as="span" className={classNames('text-sm font-medium leading-6', labelClassName)} passive>
            {label}
          </Switch.Label>
        )}
        {description && (
          <Switch.Description as="span" className={classNames('text-sm text-gray-500', descriptionClassName)}>
            {description}
          </Switch.Description>
        )}
      </span>
      <Switch
        checked={isEnabled}
        onChange={toggleSwitch}
        className={classNames(
          isEnabled ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
          switchClassName
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            isEnabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  )
}
