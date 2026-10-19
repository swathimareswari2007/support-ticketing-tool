
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const API_URL = "https://ticketing-tool-api-1.onrender.com/api/tickets";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [category, setCategory] = useState("GENERAL");
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTickets() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load tickets");
      const data = await response.json();
      setTickets(data);
    } catch {
      setMessage("Could not load tickets. Please try again.");
    }
  }

  async function submitTicket(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          status: "OPEN",
          category
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ticket submission failed");
      }

      setMessage("Ticket created successfully!");
      setTitle("");
      setDescription("");
      setPriority("LOW");
      setCategory("GENERAL");
      await loadTickets();
    } catch (error) {
      setMessage(error.message || "Could not connect to the API.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div className="container">
      <h1>Support Ticketing Tool</h1>
      <p>Manage and track support tickets in one place.</p>

      <div className="ticket-card">
        <h2>Create a Support Ticket</h2>

        <form onSubmit={submitTicket}>
          <label htmlFor="title">Ticket Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Unable to login"
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your issue"
            required
          />

          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
          </select>

          <label htmlFor="category">Category</label>
          <input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>

        {message && <p role="status">{message}</p>}
      </div>

      <div className="ticket-card">
        <h2>Existing Tickets</h2>
        <button type="button" onClick={loadTickets}>
          Refresh Tickets
        </button>

        {tickets.length === 0 ? (
          <p>No tickets to display.</p>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
              <p>
                Priority: {ticket.priority} | Status: {ticket.status}
              </p>
              <p>Category: {ticket.category}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

