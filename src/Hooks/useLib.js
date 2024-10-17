// useLib.js

import axios from "axios";
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode'; 
import JSZip from 'jszip'; // Import JSZip for ZIP creation
import { saveAs } from 'file-saver'; // Import FileSaver for download
import axiosInstance from "../axiosInstance";

// 1. createServerUrl(path) => returns the server url with the path appended from the env file
const createServerUrl = (path) => {
    return `${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_DOMAIN}${process.env.REACT_APP_SERVER_PORT ? ':'+process.env.REACT_APP_SERVER_PORT : ''}${path}`;
};

// 2. getCookie(name) => returns the value of the cookie with the name
const getCookie = (name) => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }

    return null; // Return null if the cookie is not found
};

// 3. isLoggedIn() => returns a boolean value if the user is logged in (checks the refresh token expiration date)
const isLoggedIn = () => {
    const refreshToken = getCookie('refreshToken');
    if (refreshToken) {
        const decoded = jwtDecode(refreshToken);
        if (decoded) {
            if (decoded.exp * 1000 > Date.now()) {
                return false;
            } else {
                return true;
            }
        }
    }
    return false;
};

// 4. setCookie(name, value, days) => sets a cookie with the name, value, and days until expiration
const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
};

// 5. toast => the toast function from react-toastify (already imported above)

// 6. useNotification => gets and uses the notification object from the URL ?notification={severity: 'success', message: 'message'} then clears the URL
const useNotification = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const notification = urlParams.get('notification');
    if (notification) {
        let notificationObject = JSON.parse(notification);
        toast[notificationObject.severity](notificationObject.message);
        window.history.replaceState(null, null, window.location.pathname);

        return notificationObject;
    } else {
        return null;
    }
};

// 7. createNotification => creates a notification object to be used in the URL ?notification={severity: 'success', message: 'message'}
const createNotification = (severity, message) => {
    return `notification=${JSON.stringify({severity: severity, message: message})}`;
};

// 8. signOut() => signs the user out and redirects to the sign-in page
const signOut = () => {
    // Remove the cookies
    document.cookie = 'refreshToken=; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'accessToken=; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/sign-in';
};

// 9. fileToBase64(file) => converts an image or file to a base64 string
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      // Use FileReader to convert the file to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        // The result attribute contains the data as a base64 encoded string
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file!'));
      };
      reader.readAsDataURL(file);
    });
};

// 10. uploadImages(files) => uploads an array of files to the server
const uploadImages = async (name, imageArray) => {
    try {
        // Axios request with the base64 images
        const response = await axios.post(createServerUrl('/api/v1/image/upload'), {
            company: "5dollarauctions",
            name: name,
            imageData: imageArray
        }, {
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// 11. createLot(lotObject) => creates a lot with the lotObject, sends the images to the server's S3 bucket and returns the response while creating the lot in MongoDB
const createLot = (lot) => {
    // Return a new Promise
    // if no images just create the lot without images
    if (lot.images.length === 0) {
        return new Promise((resolve, reject) => {
            axios.post(createServerUrl('/api/v1/lot/create'), lot, {
                withCredentials: true
            })
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                console.log(error)
                reject(error.response.data)
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            uploadImages(lot.lotNumber, lot.images)
                .then(response => {
                    // Check if all images were uploaded successfully
                    if (response) {
                        if (response.length !== lot.images.length) {
                            throw new Error('Image upload failed');
                        }
                    }
                    
                    // Update the lot's images with the response
                    lot.images = response;

                    // Proceed to create the lot with updated lot
                    return axios.post(createServerUrl('/api/v1/lot/create'), lot, {
                        withCredentials: true
                    })
                })
                .then(response => {
                    // Resolve the outer Promise with the response if lot creation is successful
                    resolve(response);
                })
                .catch(error => {
                    // Reject the outer Promise with a descriptive error message
                    if (error.message === 'Image upload failed') {
                        reject('Images failed to upload.');
                    } else {
                        // Sends the error code given by MongoDB to the front end
                        console.log(error)
                        reject(error.response.data)
                    }
                });
        });
    }
};

// Helper function to extract filename from URL
const extractFileName = (url, index) => {
    const originalName = url.substring(url.lastIndexOf('/') + 1) || `image_${Math.random().toString(36).substring(7)}.jpg`;
    const nameParts = originalName.split('.');
    const extension = nameParts.pop();
    const baseName = nameParts.join('.') || 'image';
    return `${baseName}_${index}.${extension}`;
};

// Helper function to generate CSV content
const generateCSV = (lots) => {
    const headers = [
        'Lot Number',
        'Title',
        'Description',
        'Condition',
        'Condition Description',
        'Category',
        'User Name',
        'User Email',
        'Member Name',
        'Status',
        'Source Name',
        'Crew Name',
        'Tags',
        'Created At',
        'Updated At',
        'Image URLs',
    ];

    const rows = lots.map((lot) => [
        lot.lotNumber || '',
        `"${lot.title || ''}"`, // Encapsulate in quotes to handle commas
        `"${lot.description || ''}"`,
        lot.condition ? lot.condition.name : '',
        lot.conditionDescription || '',
        lot.category ? lot.category.name : '',
        lot.userId ? lot.userId.username : '',
        lot.userId ? lot.userId.email : '',
        lot.member ? lot.member.name : '',
        lot.status || '',
        lot.sourceId ? lot.sourceId.sourceName : '',
        lot.crewId ? lot.crewId.crewName : '',
        lot.tags && lot.tags.length > 0 ? lot.tags.map(tag => tag.tagName).join('; ') : '',
        lot.createdAt ? new Date(lot.createdAt).toISOString() : '',
        lot.updatedAt ? new Date(lot.updatedAt).toISOString() : '',
        lot.images && lot.images.length > 0 ? lot.images.join('; ') : '',
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    return csv;
};

// Main function to download auction data
const downloadAuctionData = async (lotIds) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Step 1: Fetch lot data
            const response = await axiosInstance.get('/v1/crew/lot/info', {
                params: { lotId: lotIds },
            });

            const lots = response.data.lots || (response.data.lot ? [response.data.lot] : []);
            if (lots.length === 0) {
                throw new Error('No lots found for the provided lotId(s).');
            }

            // Step 2: Generate CSV content
            const csvContent = generateCSV(lots);

            // Step 3: Initialize JSZip
            const zip = new JSZip();
            zip.file('lots.csv', csvContent); // Add CSV to the ZIP

            // Step 4: Collect image URLs and ensure they are tied to the correct lotNumber
            const imageUrls = [];
            lots.forEach((lot) => {
                if (lot.images && Array.isArray(lot.images)) {
                    lot.images.forEach((url, index) => {
                        if (url) {
                            imageUrls.push({ url, lotNumber: lot.lotNumber, index });
                        }
                    });
                }
            });

            console.log(`Collected ${imageUrls.length} image URLs.`);

            // Step 5: Function to download a single image
            const downloadImage = async (url) => {
                try {
                    const response = await axios.get(url, {
                        responseType: 'blob',
                    });
                    return response.data;
                } catch (error) {
                    console.error(`Failed to download image from ${url}:`, error.message);
                    return null;
                }
            };

            // Step 6: Download images in batches
            const CONCURRENT_DOWNLOADS = 20;
            for (let i = 0; i < imageUrls.length; i += CONCURRENT_DOWNLOADS) {
                const batch = imageUrls.slice(i, i + CONCURRENT_DOWNLOADS);
                const downloadPromises = batch.map(({ url }) => downloadImage(url));
                const results = await Promise.all(downloadPromises);

                results.forEach((blob, index) => {
                    if (blob) {
                        const { lotNumber, index: imageIndex } = batch[index];
                        const fileName = `${lotNumber}_${imageIndex + 1}.jpg`; // Set filename to lotNumber + index
                        zip.folder('images').file(fileName, blob);
                    }
                });
            }

            // Step 7: Finalize ZIP and trigger download
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, 'manual-auctions.zip');

            // Step 8: Success message
            toast.success('ZIP file downloaded successfully!');
            resolve('ZIP file downloaded successfully!');
        } catch (error) {
            console.error('Error during download process:', error);
            toast.error('Failed to download ZIP file.');
            reject('Failed to download ZIP file.');
        }
    });
};

// 12. Add downloadAuctionData to useLib
const useLib = {
    createServerUrl,
    getCookie,
    setCookie,
    toast,
    useNotification,
    createNotification,
    signOut,
    fileToBase64,
    uploadImages,
    createLot,
    downloadAuctionData // Add the new function here
};

export default useLib;
