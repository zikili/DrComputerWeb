import apiClient from "./api-client";

interface IUpoloadResponse {
    url: string;
}
export const uploadPhoto = async (photo: File) => {
    return new Promise<string>((resolve, reject) => {
        console.log("Uploading photo..." + photo)
        const formData = new FormData();
        if (photo) {
            formData.append("file", photo);
            apiClient.post<IUpoloadResponse>('file?file=123.jpeg', formData, {
                headers: {
                    'Content-Type': 'image/jpeg'
                }
            }).then(res => {
                console.log(res);
                resolve(res.data.url);
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        }
    });
}