const BASE_URL = "https://chorehop-cc7c0bf7a12c.herokuapp.com/tickets";
// Sends a DELETE request to the specified API endpoint to delete the ticket by the ticketId
const deleteTicket = async (ticketId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${ticketId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete the ticket");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting ticket:", error);
    throw error;
  }
};

export default deleteTicket;
