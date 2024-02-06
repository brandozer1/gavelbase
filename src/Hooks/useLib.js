import { useState, useEffect } from "react";

// Enter the functions here for exporting in the useLib object
// reference the function by using useLib.functionName given
// so {addNumbers: useAddNumbers} would be used as useLib.addNumbers(Parameters)
// Functions
// createServerUrl(path) => returns the server url with the path appended from the env file

const createServerUrl = (path) => {
    return `${process.env.REACT_APP_SERVER_PROTOCOL}://${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/${path}`;
}


const useLib = {
    createServerUrl,
}

export default useLib;