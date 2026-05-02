import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TicketProvider } from "./context/TicketContext";
import Layout from "./layout/Layout";
import Dashboard from "./components/Dashboard";
import TicketHub from "./components/TicketHub";
import TicketDetail from "./components/TicketDetail";
import KanbanBoard from "./components/KanbanBoard";
import ProjectDirectory from "./components/ProjectDirectory";
import ProjectDetail from "./components/ProjectDetail";
import CreationsPanel from "./components/CreationsPanel";

const NewTicket = () => <div>New Ticket Page</div>;

function App() {
  return (
    <TicketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tickets" element={<TicketHub />} />
            <Route path="tickets/:id" element={<TicketDetail />} />
            <Route path="kanban" element={<KanbanBoard />} />
            <Route path="new-ticket" element={<NewTicket />} />
            <Route path="projects" element={<ProjectDirectory />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="creations" element={<CreationsPanel />} />
          </Route>
        </Routes>
      </Router>
    </TicketProvider>
  );
}

export default App;
