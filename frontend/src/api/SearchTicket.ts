const SEARCH_URL = "https://chorehop-cc7c0bf7a12c.herokuapp.com/tickets/search";

const searchTickets = async (searchParams = {}) => {
  try {
    const queryString = new URLSearchParams(searchParams).toString();
    const url = queryString ? `${SEARCH_URL}?${queryString}` : SEARCH_URL;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching tickets:", error);
    throw error;
  }
};

export default searchTickets;
