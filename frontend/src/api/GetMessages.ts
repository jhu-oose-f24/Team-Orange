const BASE_URL = "https://chorehop-cc7c0bf7a12c.herokuapp.com/messages";


const getMessages = async (ticketId: string) => {
    try {
        const response = await fetch(`${BASE_URL}/${ticketId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  };
  
  export default getMessages;