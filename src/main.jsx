
import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function App() {
  return (
    <div className="container">
      <h1>Support Ticketing Tool</h1>
      <p>Manage and track support tickets in one place.</p>

      <div className="ticket-card">
        <h2>Create a Support Ticket</h2>
        <form onSubmit={(event) => {
          event.preventDefault();
          alert("Ticket submitted successfully!");
        }}>
          <label htmlFor="title">Ticket Title</label>
          <input id="title" type="text" placeholder="Unable to login" required />

          <label htmlFor="description">Description</label>
          <textarea id="description" placeholder="Describe your issue" required />

          <label htmlFor="priority">Priority</label>
          <select id="priority">
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
          </select>

          <button type="submit">Submit Ticket</button>
        </form>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
