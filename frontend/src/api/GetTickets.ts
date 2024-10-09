const BASE_URL = 'http://localhost:3000/tickets';

const getTickets = async () => {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tickets:', error);
        throw error; 
    }
};

export default getTickets;

