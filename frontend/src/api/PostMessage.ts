import Message from "../types/Message";

const BASE_URL = "http://localhost:3000/messages";

interface MessageData {
  sending_id: string;
  receiving_id: string;
  ticket_id: string;
  message: string;
}

const postMessage = async (data: MessageData) : Promise<Message> => {
  console.log("Posting message:", data);
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
    console.log("Message posted:", result);
    return result as Message;
  } catch (error) {
    console.error("Error posting message:", error);
    throw error;
  }
};

export default postMessage;