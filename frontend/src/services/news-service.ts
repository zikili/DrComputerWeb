import axios, { AxiosError, AxiosResponse } from "axios";


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
export const getData =  async ():Promise<AxiosResponse<Data> | AxiosError> => {
    try {
        const baseUrl='https://newsapi.org/v2/'
        const key=import.meta.env.VITE_NEWS_API_KEY
        const type="everything"
        const query="q=computer"
        const url= `${baseUrl}${type}/?${query}&apiKey=${key}`
        const response: AxiosResponse<Data> =await axios.get(url);
        return response
    } catch (error) {
        if(axios.isAxiosError(error))
            return error
    }
    return new AxiosError()
};
