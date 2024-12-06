const BASE_URL = "https://chorehop-cc7c0bf7a12c.herokuapp.com/tickets";

// Sends a POST request to the specified API endpoint to create ticket with all the necessary fields
const createTicket = async (ticket: {
  title: string;
  description: string;
  category: string;
  deadline: string;
  status: string;
  owner_id: string;
  assigneduser_id: string | undefined;
  payment: number;
  priority: string;
}) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};

export default createTicket;
