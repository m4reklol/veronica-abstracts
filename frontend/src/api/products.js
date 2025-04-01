const API_URL = `/api/products`;

export const getProducts = async () => {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    return [];
  }
};
