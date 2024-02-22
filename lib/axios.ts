import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL as string,
    timeout: 10000,
    // headers: {'X-Custom-Header': 'foobar'}
});
