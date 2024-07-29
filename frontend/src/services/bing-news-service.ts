import axios from "axios";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const ENDPOINT = "https://api.bing.microsoft.com/v7.0/news/search";

export interface NewsArticle {
    name: string;
    url: string;
    description: string;
    image?: {
      thumbnail?: {
        contentUrl?: string;
      }
    };
  }
export interface NewsResponse {
  value: NewsArticle[];
}

export async function searchNews(query: string): Promise<NewsResponse> {
  try {
    const response = await axios.get(ENDPOINT, {
      headers: {
        "Ocp-Apim-Subscription-Key": API_KEY,
      },
      params: {
        q: query,
        count: 10,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}
