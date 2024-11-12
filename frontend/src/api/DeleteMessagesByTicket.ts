const BASE_URL = "http://localhost:3000/messages";

const deleteMessagesByTicket = async (ticketId: string) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticket_id: ticketId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete messages");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting messages:", error);
    throw error;
  }
};

export default deleteMessagesByTicket;
