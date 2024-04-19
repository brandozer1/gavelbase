import axios from "axios";
import { toast } from 'react-toastify';
// Enter the functions here for exporting in the useLib object
// reference the function by using useLib.functionName given
// so {addNumbers: useAddNumbers} would be used as useLib.addNumbers(Parameters)
// Functions
// 1. createServerUrl(path) => returns the server url with the path appended from the env file
// 2. getCookie(name) => returns the value of the cookie with the name
// 3. getMemberCookie() => returns the member object from the member cookie
// 4. setCookie(name, value, days) => sets a cookie with the name, value, and days until expiration
// 5. toast => the toast function from react-toastify
// 6. useNotification => gets and uses the notificatin object from the url ?notification={severity: 'success', message: 'message'} then clears the url
// 7. createNotification => creates a notification object to be used in the url ?notification={severity: 'success', message: 'message'}
// 8. signOut() => signs the user out and redirects to the sign-in page
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

const getMemberCookie = () => {
    let memberObject = getCookie('gavelbase_member');
    let parsedMemberObject = JSON.parse(decodeURIComponent(memberObject));
    // return the object if it exists
    if (parsedMemberObject) {
        return parsedMemberObject;
    }else{
        return null;
    }

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
    axios.get(createServerUrl('/api/v1/member/signout'), {
        withCredentials: true
    })
    .then((response) => {
        if (response.status === 200) {
            window.location.href = '/Sign-In?'+createNotification('success', 'Signed out successfully');
        }else{
            toast.error('An error occurred while signing out');
        }
    })
    .catch((error) => {
        toast.error('An error occurred while signing out');
    })
}


const useLib = {
    createServerUrl,
    getCookie,
    getMemberCookie,
    setCookie,
    toast,
    useNotification,
    createNotification,
    signOut,
}

export default useLib;