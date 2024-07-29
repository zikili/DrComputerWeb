import axios, { AxiosError, AxiosResponse } from "axios";


export interface New{
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
    News: New[]
}
export const getData =  async ():Promise<AxiosResponse<Data> | AxiosError> => {
    try {
        const key=import.meta.env.VITE_NEWS_API_KEY
        const baseUrl='https://newsapi.in/newsapi/news.php?key='+key
        const content_type="full_content"
        const query="q=computer"
        const url= `${baseUrl}&content_type=${content_type}&${query}&lang=english`
        const response: AxiosResponse<Data> =await axios.get("https://newsapi.in/newsapi/news.php?key=Lwgb4IDM18TeXfLliRxW7LikpD1NTP&category=hindi_state");
        console.log(response)
        return response
    } catch (error) {
        if(axios.isAxiosError(error))
            return error
    }
    return new AxiosError()
};
