import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import UserService from "./user-service";
const apiKey=import.meta.env.VITE_API_BASE_URL

export { CanceledError } from "axios";

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

class ApiClient {
  private static instance: AxiosInstance;
  private static isRefreshing = false;
  private static requestQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
    config: ExtendedAxiosRequestConfig;
  }> = [];

  private constructor() {}

  private static async processQueue(newToken: string | null) {
    this.requestQueue.forEach(({ resolve, reject, config }) => {
      if (newToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        resolve(this.instance(config));
      } else {
        reject(new Error("Failed to refresh token"));
      }
    });
    this.requestQueue = [];
  }

  public static getInstance(): AxiosInstance {
    if (!ApiClient.instance) {
      ApiClient.instance = axios.create({
        baseURL: apiKey,
      });

      ApiClient.instance.interceptors.response.use(
        response => response,
        async (error: AxiosError) => {
          const originalConfig = error.config as ExtendedAxiosRequestConfig;

          if (axios.isAxiosError(error) && error.response && error.response.status === 403 && !originalConfig._retry) {
            originalConfig._retry = true;

            if (!ApiClient.isRefreshing) {
              ApiClient.isRefreshing = true;
              const userService = new UserService();

              try {
                const tokens = await userService.refreshTokens();
                if (tokens) {
                  const newToken = localStorage.getItem("accessToken");
                  originalConfig.headers = {
                    ...originalConfig.headers,
                    Authorization: `Bearer ${newToken}`,
                  };
                  await ApiClient.processQueue(newToken);
                  return ApiClient.instance(originalConfig);
                } else {
                  await ApiClient.processQueue(null);
                  throw new Error("Failed to refresh token");
                }
              } catch (refreshError) {
                await ApiClient.processQueue(null);
                throw refreshError;
              } finally {
                ApiClient.isRefreshing = false;
              }
            // } else {
            //   // If a refresh is already in progress, queue this request
            //   return new Promise((resolve, reject) => {
            //     ApiClient.requestQueue.push({ resolve, reject, config: originalConfig });
            //   });
            }
          }
          return Promise.reject(error);
        }
      );
    }
    return ApiClient.instance;
  }
}

export default ApiClient.getInstance();