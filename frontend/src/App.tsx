import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Feed from './components/Feed';
import NavBar from './components/NavBar';
import CreateTicket from './components/CreateTicket';
import Profile from './components/Profile';
import './App.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>ChoreHop</h1>
                </header>
                <NavBar />
                <Routes>
                    <Route path="/create-ticket" element={<CreateTicket />} />
                    <Route path="/feed" element={
                        <div className="feed-container">
                            <Feed />
                            <Feed />
                            <Feed />
                        </div>
                    } />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/" element={<Feed />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
