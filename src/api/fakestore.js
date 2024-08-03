import axios from 'axios';
//const BASE_URL = 'http://localhost:3500';
const BASE_URL = 'https://fakestoreapi.com';

export default axios.create({
    baseURL: BASE_URL,
    PASSED_PARAM: true
});
