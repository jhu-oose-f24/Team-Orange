const BASE_URL = "https://chorehop-cc7c0bf7a12c.herokuapp.com/tickets";
// Sends a request to the specified API endpoint to get all tickets
const getTickets = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

export default getTickets;
