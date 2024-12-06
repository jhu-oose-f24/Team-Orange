// message type
interface Message {
    id: string;
    sending_id: string;
    receiving_id: string;
    ticket_id: string;
    message: string;
    create_time: string;
};

export default Message;