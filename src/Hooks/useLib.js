import axios from "axios";
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode'; 
// Enter the functions here for exporting in the useLib object
// reference the function by using useLib.functionName given
// so {addNumbers: useAddNumbers} would be used as useLib.addNumbers(Parameters)
// Functions
// 1. createServerUrl(path) => returns the server url with the path appended from the env file

// 2. getCookie(name) => returns the value of the cookie with the name

// 3. isLoggedIn() => returns a boolean value if the user is logged in (checks the refresh token expiration date

// 4. setCookie(name, value, days) => sets a cookie with the name, value, and days until expiration

// 5. toast => the toast function from react-toastify

// 6. useNotification => gets and uses the notificatin object from the url ?notification={severity: 'success', message: 'message'} then clears the url

// 7. createNotification => creates a notification object to be used in the url ?notification={severity: 'success', message: 'message'}

// 8. signOut() => signs the user out and redirects to the sign-in page
// DEPENDENCIES => toast, createNotification

// 9. fileToBase64(file) => converts an image or file to a base64 string

// 10. uploadImages(files) => uploads an array of files to the server (MAINLY USED IN THE IMAGE UPLOAD COMPONENT & ON THE LOT CREATION PAGE) PLEASE CHECK CODE FOR USAGE
// DEPENDENCIES => createServerUrl

// 11. createLot(lotObject) => creates a lot with the lotObject, sends the images to the servers s3 bucket and returns the response while creating the lot in mongoDB
// DEPENDENCIES => uploadImages, createServerUrl

const createServerUrl = (path) => {
    return `${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_DOMAIN}${process.env.REACT_APP_SERVER_PORT ? ':'+process.env.REACT_APP_SERVER_PORT : ''}${path}`};

const getCookie = (name) => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }

    return null; // Return null if the cookie is not found
}


const isLoggedIn = () => {
    const refreshToken = getCookie('refreshToken');
    if (refreshToken) {
        const decoded = jwtDecode(refreshToken);
        if (decoded) {
            if (decoded.exp * 1000 > Date.now()) {
                return false
            }else{
                return true;
            }
        }
    }
    return false;
}





const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
}

const useNotification = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const notification = urlParams.get('notification');
    if (notification) {
        let notificationObject = JSON.parse(notification);
        toast[notificationObject.severity](notificationObject.message);
        window.history.replaceState(null, null, window.location.pathname);

        return notificationObject;
    }else{
        return null;
    }
}

const createNotification = (severity, message) => {
    return `notification=${JSON.stringify({severity: severity, message: message})}`
}

const signOut = () => {
    // remove the cookies
    document.cookie = 'refreshToken=; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'accessToken=; expires = Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/sign-in';
}

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
}

function createLot(lot) {
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
    }else{
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
                        // sends the error code given by mongodb to the front end
                        console.log(error)
                        reject(error.response.data)
                    }
                });
        });
    }
    
}


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
    createLot
}

export default useLib;