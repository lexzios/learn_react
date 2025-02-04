import axios from 'axios';
//const BASE_URL = 'http://localhost:3500';
const BASE_URL = 'http://localhost:3500';

export default axios.create({
    baseURL: BASE_URL,
    PASSED_PARAM: true
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
    PASSED_PARAM: true
});