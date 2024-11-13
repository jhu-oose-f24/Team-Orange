const BASE_URL = "http://localhost:3000/tickets";

const assignTicket = async (id: string, assignedUserId: string | null) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assigneduser_id: assignedUserId, status: "InProgress" }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error assigning ticket:", error);
    throw error;
  }
};

export default assignTicket;