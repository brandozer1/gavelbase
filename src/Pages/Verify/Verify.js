import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import useLib from '../../Hooks/useLib';
import Loading from '../Loading/Loading';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; // Correct v2 imports

export default function Verify() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('Verifying your email...');
    const [error, setError] = useState(null);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const location = useLocation();

    useEffect(() => {
        document.title = 'Verify Email - Gavelbase';

        const verifyEmail = async () => {
            try {
                const response = await axios.post(useLib.createServerUrl('/v1/public/user/verify-email'), { token });
                if (response.status === 200) {
                    setMessage('Email verified successfully! You can now log in. Feel free to close this page.');
                    setVerificationStatus('success');
                } else {
                    setError('Verification failed. Please try again later.');
                    setVerificationStatus('failed');
                }
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Error verifying email. Please try again.');
                setVerificationStatus('failed');
            } finally {
                setLoading(false);
            }
        };

        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            verifyEmail();
        } else {
            setError('Invalid verification link.');
            setLoading(false);
        }
    }, [location.search]);

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            <div className="flex justify-center items-center space-x-2">
                                {verificationStatus === 'failed' ? (
                                    <>
                                        <XCircleIcon className="h-6 w-6 text-red-500" />
                                        <span>Verification Failed</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                        <span>Email Verified</span>
                                    </>
                                )}
                            </div>
                        </h2>
                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <div className="text-center text-gray-700">
                            {verificationStatus === 'failed' ? (
                                <p className="text-red-500">{error}</p>
                            ) : (
                                <p>{message}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
