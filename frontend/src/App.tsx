import React, {useState} from 'react';
import Feed from './components/Feed';
import AuthorFeed from './components/AuthorFeed';
import './App.css'; 

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState('feed');
    const userId = 1;  // TODO: current author id (need user outhentication )

    const renderNavBar = () => {
        switch (activeTab) {
            case 'feed':
                return <Feed />;
            case 'myfeed':
                return <AuthorFeed userId={userId} />;
        }
    };
    return (
        <div className="App"> 
            <header className="App-header"> 
                <h1>ChoreHop</h1>
                <nav>
                    <button className = "navButton" onClick={() => setActiveTab('feed')}>Feed</button>
                    <button className = "navButton" onClick={() => setActiveTab('myfeed')}>My Feed</button>
                </nav>
            </header>
            <main>
                {renderNavBar()}
            </main>
        </div>
    );
};

export default App;
