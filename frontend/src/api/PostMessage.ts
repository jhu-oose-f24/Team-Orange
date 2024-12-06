import Message from "../types/Message";

const BASE_URL = "https://chorehop-cc7c0bf7a12c.herokuapp.com/messages";

interface MessageData {
  sending_id: string;
  receiving_id: string;
  ticket_id: string;
  message: string;
}
// Sends a request to the specified API endpoint to post a message
const postMessage = async (data: MessageData) : Promise<Message> => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result as Message;
  } catch (error) {
    console.error("Error posting message:", error);
    throw error;
  }
};

export default postMessage;