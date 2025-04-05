// const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // The CORS proxy URL
// const imageUrl = "https://jsk-co.com/storage/slider/2025/03/01/azQYXT8e2x8wZesNz5GRACAQDtrLy0CvxoKFvP7o.jpg"; // Your image URL
// const imageWithProxy = proxyUrl + imageUrl;

export async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url ,{mode:"no-cors"});
  const blob = await response.blob();
  const mimeType = blob.type || "image/jpeg";
  return new File([blob], filename, { type: mimeType });
}



