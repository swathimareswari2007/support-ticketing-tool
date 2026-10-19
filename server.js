
const express = require("express");

const app = express();
app.use(express.json());

let tickets = [];
let nextId = 1;

const priorities = ["LOW", "MEDIUM", "HIGH"];
const statuses = ["OPEN", "IN_PROGRESS", "CLOSED"];
const categories = ["TECHNICAL", "BILLING", "GENERAL"];

function validateTicket(body) {
  const { title, description, priority, status, category } = body || {};

  if (
    typeof title !== "string" || !title.trim() ||
    typeof description !== "string" || !description.trim() ||
    !priorities.includes(priority) ||
    !statuses.includes(status) ||
    !categories.includes(category)
  ) {
    return "Provide title, description, priority, status and category with valid values.";
  }

  return null;
}

// Create a ticket
app.post("/api/tickets", (req, res) => {
  const error = validateTicket(req.body);
  if (error) return res.status(400).json({ error });

  const ticket = {
    id: nextId++,
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    priority: req.body.priority,
    status: req.body.status,
    category: req.body.category
  };

  tickets.push(ticket);
  res.status(201).json(ticket);
});

// Get all tickets
app.get("/api/tickets", (req, res) => {
  res.status(200).json(tickets);
});

// Get one ticket
app.get("/api/tickets/:id", (req, res) => {
  const ticket = tickets.find(t => t.id === Number(req.params.id));
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }
  res.status(200).json(ticket);
});

// Update a ticket
app.put("/api/tickets/:id", (req, res) => {
  const ticket = tickets.find(t => t.id === Number(req.params.id));
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  const error = validateTicket(req.body);
  if (error) return res.status(400).json({ error });

  Object.assign(ticket, {
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    priority: req.body.priority,
    status: req.body.status,
    category: req.body.category
  });

  res.status(200).json(ticket);
});

// Delete a ticket
app.delete("/api/tickets/:id", (req, res) => {
  const index = tickets.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  tickets.splice(index, 1);
  res.status(204).send();
});

app.use((err, req, res, next) => {
  res.status(400).json({ error: "Invalid JSON or request" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ticket API running on port ${PORT}`);
});
