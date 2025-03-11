//@ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const shortenUrl = async (url:string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to shorten URL");
    }

    return await response.json();
  } catch (error) {
    console.error("Error shortening URL:", error);
    throw error;
  }
};
 