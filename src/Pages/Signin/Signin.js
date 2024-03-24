import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Logo from  '../../Assets/Images/Logo.webp'
import useLib from '../../Hooks/useLib'
import Loading from '../Loading/Loading'

export default function Signin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const signin = (e) => {
    e.preventDefault()
    setLoading(true)
    // axios.post(useLib.createServerUrl('/api/v1/member/login'), {
    //   username: username,
    //   password: password,
    // }, {
    //   withCredentials: true
    // })
    // .then((response) => {
    //   if (response.status === 200) {
    //     window.location.href = '/Dashboard?'+useLib.createNotification('success', response.data)
    //   }else{
    //     useLib.toast.error(response.data)
    //   }
    // })
    // .catch((error) => {
    //   setLoading(false)
    //   useLib.toast.error(error.response.data)
    // })
  }

  useEffect(() => {
    document.title = 'Sign in - Gavelbase'

    useLib.useNotification()

    // check if the user is already logged in
    axios.get(useLib.createServerUrl('/api/v1/member/verify'), {
      withCredentials: true
    })
    .then((response) => {
      if (response.status === 200) {
        window.location.href = '/Dashboard'
      }
    })
    .catch((error) => {
    })
  }, [])

  return (
    <>
      {
        loading ?
            <Loading />
          :
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <img
                className="mx-auto h-10 w-auto"
                src={Logo}
                alt="Gavelbase"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={signin} method="POST">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Username/Email address
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setUsername(e.target.value)}
                      id="email"
                      name="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    <div className="text-sm">
                      <a href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
              <p className="mt-10 text-center text-sm text-gray-500">
                Not a member?{' '}
                <a href="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  Start a 30 day free trial
                </a>
              </p>
            </div>
          </div>
      }
    </>
  )
}