import React, {useState} from 'react'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import Logo from '../../Assets/Logo.png';
export default function Loginpage() {
    const [checked1, setChecked1] = useState(false);

  return (
    <div className='flex justify-content-center w-screen align-items-center bg-primary  lg:h-screen'>
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
            <div className="text-center mb-5">
                <img src={Logo} alt="hyper" className="mb-3 w-10 md:w-6" />
                <div className="text-900 text-3xl font-medium mb-3">Member Login</div>
                <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
            </div>

            <div>
                <label htmlFor="username" className="block text-900 font-medium mb-2">Username</label>
                <InputText id="username" type="text" placeholder="Username" className="w-full mb-3" />

                <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                <InputText type="password" placeholder="Password" className="w-full mb-3" />

                <div className="flex align-items-center justify-content-between mb-6">
                    <div className="flex align-items-center">
                        <Checkbox id="rememberme" className="mr-2" checked={checked1} onChange={(e) => setChecked1(e.checked)} />
                        <label className='text-900' htmlFor="rememberme">Remember me</label>
                    </div>
                    <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
                </div>

                <Button label="Log In" icon="pi pi-user" className="w-full" />
            </div>
        </div>
    </div>
    
  )
}
