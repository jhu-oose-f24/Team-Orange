const BASE_URL = "http://localhost:3000/messages";

const createMesssage = async (message: {
  sending_id: string;
  receiving_id: string;
  ticket_id: string;
  message: string;
}) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
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

export default createMesssage;