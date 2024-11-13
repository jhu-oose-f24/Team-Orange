const BASE_URL = "http://localhost:3000/tickets";

const editTicket = async (
  id: string,
  updatedTicket: {
    title?: string;
    description?: string;
    category?: string;
    deadline?: string;
    status?: string;
    owner_id?: string;
    assigneduser_id?: string | null;
    payment?: number | null;
    payment_confirmed?: boolean | null;
  },
) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTicket),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error editing ticket:", error);
    throw error;
  }
};

export default editTicket;
