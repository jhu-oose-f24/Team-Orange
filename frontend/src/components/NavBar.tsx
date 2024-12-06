import React from "react";
import { Link } from "react-router-dom";

// this file is not in use
const NavBar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <button>
            <Link to="/create-ticket">Create Ticket</Link>
          </button>
        </li>
        <li>
          <button>
            <Link to="/feed">Feed</Link>
          </button>
        </li>
        <li>
          <button>
            <Link to="/profile">Profile</Link>
          </button>
        </li>
        <li>
          <button>
            <Link to="/devUser">devUser</Link>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
