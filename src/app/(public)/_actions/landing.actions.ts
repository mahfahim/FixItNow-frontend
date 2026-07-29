"use server";

// Example action to fetch popular categories
export async function getPopularCategories() {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/categories?limit=6`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

// Example action to fetch top-rated technicians
export async function getTopTechnicians() {
  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/technicians?sort=-rating&limit=4`, {
      next: { revalidate: 3600 },
    });
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch top technicians:", error);
    return [];
  }
}

// Search or filter services from backend
export async function getServices(searchParams: { search?: string; category?: string }) {
    try {
        const query = new URLSearchParams();
        if (searchParams.search) query.append("search", searchParams.search);
        if (searchParams.category) query.append("category", searchParams.category);

        const res = await fetch(`${process.env.BACKEND_API_URL}/api/services?${query.toString()}`, {
            cache: "no-store", // Get fresh search results
        });

        if (!res.ok) return { success: false, data: [] };
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return { success: false, data: [] };
    }
}