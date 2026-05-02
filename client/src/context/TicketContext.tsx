import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { getTickets, updateTicket, createTicket, type Ticket, type CreateTicketPayload, type UpdateTicketPayload } from "../services/api";

// ─── Shape ────────────────────────────────────────────────

interface TicketContextValue {
  tickets: Ticket[];
  loading: boolean;
  refresh: () => Promise<void>;
  addTicket: (ticket: Ticket) => void;
  patchTicket: (id: number, payload: UpdateTicketPayload) => Promise<void>;
  submitTicket: (payload: CreateTicketPayload) => Promise<Ticket>;
}

// ─── Context ──────────────────────────────────────────────

const TicketContext = createContext<TicketContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Optimistically prepend a newly created ticket
  const addTicket = (ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  // PATCH a ticket and update it in the local list
  const patchTicket = async (id: number, payload: UpdateTicketPayload) => {
    const updated = await updateTicket(id, payload);
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  // POST a new ticket, add it to the list, and return it
  const submitTicket = async (payload: CreateTicketPayload): Promise<Ticket> => {
    const ticket = await createTicket(payload);
    addTicket(ticket);
    return ticket;
  };

  return (
    <TicketContext.Provider value={{ tickets, loading, refresh, addTicket, patchTicket, submitTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────

export const useTickets = (): TicketContextValue => {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTickets must be used inside <TicketProvider>");
  return ctx;
};
