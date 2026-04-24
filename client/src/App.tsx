import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./components/Dashboard";

const Tickets = () => <div>Tickets Page</div>;
const NewTicket = () => <div>New Ticket Page</div>;
const Projects = () => <div>Projects Page</div>;
const Creations = () => <div>Creations Page</div>;

function App() {
  return (
    <Router>
      <Routes>

        {/* Layout Wrapper */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="new-ticket" element={<NewTicket />} />
          <Route path="projects" element={<Projects />} />
          <Route path="creations" element={<Creations />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;