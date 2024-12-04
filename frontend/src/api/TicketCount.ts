const BASE_URL = "https://chorehop-cc7c0bf7a12c.herokuapp.com";

export const getCreatedTicketsCount = async (userId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/created_tickets/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch created tickets count");
    }
    const data = await response.json();
    return data.created_tickets_count;
  } catch (error) {
    console.error("Error fetching created tickets count:", error);
    throw error;
  }
};

export const getCompletedTicketsCount = async (userId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/finished_tickets/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch completed tickets count");
    }
    const data = await response.json();
    return data.finished_tickets_count;
  } catch (error) {
    console.error("Error fetching completed tickets count:", error);
    throw error;
  }
};
