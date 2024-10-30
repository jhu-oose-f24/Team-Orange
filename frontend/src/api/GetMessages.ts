const BASE_URL = "http://localhost:3000/messages/:ticket_id";


async function getMessages(ticketId : string) {
    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(ticketId)) {
        throw new Error("Invalid ticket_id format");
    }
    try {
        const response = await fetch(BASE_URL);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "An error occurred while fetching messages");
        }
        const messages = await response.json();
        return messages;
    } catch (error) {
        console.error("Error fetching messages", error);
        throw error;
    }
};
  
export default getMessages;