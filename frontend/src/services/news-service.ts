import axios, { AxiosResponse } from "axios";


export interface Article{
    source: string,
    author?: string,
    title: string,
    description?: string,
    url: string,
    urlToImage?: string,
    publishedAt: string,
    content?: string
}
export interface Data {
    status: string,
    totalResults: number,
    articles: Article[]
}
export const getData = async ():Promise<AxiosResponse<Data>> => {
    try {
        const baseUrl='https://newsapi.org/v2/'
        const key=import.meta.env.VITE_NEWS_API_KEY
        const type="everything"
        const query="q=computer"
        const url= `${baseUrl}${type}/?${query}&apiKey=${key}`

        const response: Promise<AxiosResponse<Data>> = axios.get(url,{
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'YourAppName/1.0' // Custom User-Agent header, adjust as needed
                // 'Upgrade': 'websocket' // Uncomment if the API requires this header
              }
        });
        return response
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
