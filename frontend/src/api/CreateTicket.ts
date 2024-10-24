const BASE_URL = "http://localhost:3000/tickets";

const createTicket = async (ticket: {
  title: string;
  description: string;
  category: string;
  deadline: string;
  status: string;
  owner_id: string;
  assigneduser_id: string | undefined;
  payment: number;
  priority: string
//   {
//     "owner_id": "011ff2c1-1ade-4c92-a649-9725f85aec00",
//     "priority": "High"
// }
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
