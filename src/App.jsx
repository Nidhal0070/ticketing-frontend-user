import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import CreateTicket from "./pages/createticket";
import MyTickets from "./pages/MyTickets";
import TicketChat from "./pages/TicketChat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-ticket" element={<CreateTicket />} />
      <Route path="/my-tickets" element={<MyTickets />} />
      {/* chat section*/}
      <Route path="/ticket-chat/:id" element={<TicketChat />} />
    </Routes>
  );
}

export default App;