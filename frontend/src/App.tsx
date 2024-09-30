import React from 'react';
import Feed from './components/Feed.tsx';
import './App.css'; 

const App: React.FC = () => {
    return (
        <div className="App"> 
            <header className="App-header"> 
                <h1>ChoreHop</h1>
            </header>
            <Feed />
        </div>
    );
};

export default App;
