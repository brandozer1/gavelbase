import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Logo from '../../Assets/Images/Logo.webp';
import useLib from '../../Hooks/useLib';
import Loading from '../Loading/Loading';

export default function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // Ref to track if the component is mounted
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Set the document title
    document.title = 'Sign in - Gavelbase';

    // Initialize notifications
    useLib.useNotification();

    // Check if the user is already logged in
    if (useLib.getCookie('refreshToken')) {
      window.location.href = '/Dashboard';
    }

    // Cleanup function to set the ref to false on unmount
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const signin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create an AbortController to cancel the request if needed
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await axios.post(
        useLib.createServerUrl('/v1/public/crew/login'),
        { email: username, password: password },
        {
          headers: {
            'x-no-auth': true,
          },
          withCredentials: true,
          signal, // Attach the abort signal to the request
        }
      );

      console.log(response);
      if (response.status === 200) {
        if (isMountedRef.current) {
          window.location.href = '/Dashboard?' + useLib.createNotification('success', response.data);
        }
      } else {
        console.log(response);
        if (isMountedRef.current) {
          useLib.toast.error(response.data);
          setLoading(false);
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        setLoading(false);
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else if (error.response) {
          useLib.toast.error(error.response.data);
        } else {
          useLib.toast.error('An error occurred, please try again later');
        }
      }
    }

    // Optional: Cancel the request if the component unmounts while the request is in progress
    return () => {
      controller.abort();
    };
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img className="mx-auto h-10 w-auto" src={Logo} alt="Gavelbase" />
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
            {/* <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              <a href="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Start a 30 day free trial
              </a>
            </p> */}
          </div>
        </div>
      )}
    </>
  );
}
