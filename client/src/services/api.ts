import axios from "axios";

const API = axios.create({
  // In development: baseURL is "/api/v1" — Vite proxy forwards to localhost:3001
  // In production:  baseURL is the full backend URL from VITE_API_URL env var
  baseURL: import.meta.env.VITE_API_URL ?? "/api/v1",
});

// ─── Types ─────────────────────────────────────────────

export interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  review: number;
  closed: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  platform: string;
  techStack: string[];
  createdAt: string;
  _count: { tickets: number; members: number };
  members: { id: number; name: string; role: string }[];
}

// ProjectDetail includes full ticket list (returned by GET /projects/:id)
export interface ProjectDetail extends Project {
  tickets: Ticket[];
}

export interface Ticket {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  type: string;
  platform: string;
  projectId: number;
  creatorId: number;
  assignedToId: number | null;
  createdAt: string;
  project: Project;
  creator: User;
  assignedTo: User | null;
}

export interface Comment {
  id: number;
  text: string;
  ticketId: number;
  authorId: number;
  createdAt: string;
  author: { id: number; name: string; role: string };
}

// TicketDetail includes comments (returned by GET /tickets/:id)
export interface TicketDetail extends Ticket {
  comments: Comment[];
}

export interface UpdateTicketPayload {
  status?: string;
  priority?: string;
  assignedToId?: number | null;
}

export interface CreateCommentPayload {
  text: string;
  ticketId: number;
  authorId: number;
}

export interface CreateTicketPayload {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  type?: string;
  platform?: string;
  projectId: number;
  creatorId: number;
  assignedToId?: number;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  platform?: string;
  techStack?: string; // comma-separated string from the form
}

// ─── API Functions ─────────────────────────────────────

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await API.get("/stats");
  return data.data;
};

export const getTickets = async (): Promise<Ticket[]> => {
  const { data } = await API.get("/tickets");
  return data.data;
};

export const getTicketById = async (id: number): Promise<TicketDetail> => {
  const { data } = await API.get(`/tickets/${id}`);
  return data.data;
};

export const updateTicket = async (id: number, payload: UpdateTicketPayload): Promise<TicketDetail> => {
  const { data } = await API.patch(`/tickets/${id}`, payload);
  return data.data;
};

export const createComment = async (payload: CreateCommentPayload): Promise<Comment> => {
  const { data } = await API.post("/comments", payload);
  return data.data;
};

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await API.get("/projects");
  return data.data;
};

export const getProjectById = async (id: number): Promise<ProjectDetail> => {
  const { data } = await API.get(`/projects/${id}`);
  return data.data;
};

export const getUsers = async (): Promise<User[]> => {
  const { data } = await API.get("/users");
  return data.data;
};

export const createTicket = async (payload: CreateTicketPayload): Promise<Ticket> => {
  const { data } = await API.post("/tickets", payload);
  return data.data;
};

export const createProject = async (payload: CreateProjectPayload): Promise<Project> => {
  const { data } = await API.post("/projects", payload);
  return data.data;
};

export default API;
