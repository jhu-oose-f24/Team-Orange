const BASE_URL = 'http://localhost:3000/tickets';

const createTicket = async (ticket: { title: string; description: string }) => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticket),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating ticket:', error);
        throw error;
    }
};

export default createTicket;