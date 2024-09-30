import React from 'react';
import Feed from './components/Feed.tsx';
import { List } from 'immutable';

const App: React.FC = () => {
    const tickets = List([
        { title: "Ticket 1", description: "This is the first ticket" },
        { title: "Ticket 2", description: "This is the second ticket" },
        { title: "Ticket 3", description: "This is the third ticket" }
    ]);

    return (
        <div className="app">
            <h1>Ticket Feed</h1>
            <Feed tickets={tickets} />
        </div>
    );
};

export default App;
