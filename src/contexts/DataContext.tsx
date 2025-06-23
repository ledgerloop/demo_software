import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Invoice, Client, TimeEntry } from '../types';

interface DataContextType {
  invoices: Invoice[];
  clients: Client[];
  timeEntries: TimeEntry[];
  loading: boolean;
  refreshData: () => Promise<void>;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addTimeEntry: (entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTimeEntry: (id: string, entry: Partial<TimeEntry>) => Promise<void>;
  deleteTimeEntry: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const refreshData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [invoicesData, clientsData, timeEntriesData] = await Promise.all([
        supabase.from('invoices').select('*').eq('user_id', user.id),
        supabase.from('clients').select('*').eq('user_id', user.id),
        supabase.from('time_entries').select('*').eq('user_id', user.id),
      ]);

      if (invoicesData.error) throw invoicesData.error;
      if (clientsData.error) throw clientsData.error;
      if (timeEntriesData.error) throw timeEntriesData.error;

      setInvoices(invoicesData.data || []);
      setClients(clientsData.data || []);
      setTimeEntries(timeEntriesData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('invoices')
      .insert([{ ...invoice, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    setInvoices(prev => [...prev, data]);
  };

  const updateInvoice = async (id: string, invoice: Partial<Invoice>) => {
    const { data, error } = await supabase
      .from('invoices')
      .update(invoice)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setInvoices(prev => prev.map(inv => inv.id === id ? data : inv));
  };

  const deleteInvoice = async (id: string) => {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('clients')
      .insert([{ ...client, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    setClients(prev => [...prev, data]);
  };

  const updateClient = async (id: string, client: Partial<Client>) => {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setClients(prev => prev.map(c => c.id === id ? data : c));
  };

  const deleteClient = async (id: string) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const addTimeEntry = async (entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('time_entries')
      .insert([{ ...entry, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    setTimeEntries(prev => [...prev, data]);
  };

  const updateTimeEntry = async (id: string, entry: Partial<TimeEntry>) => {
    const { data, error } = await supabase
      .from('time_entries')
      .update(entry)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setTimeEntries(prev => prev.map(e => e.id === id ? data : e));
  };

  const deleteTimeEntry = async (id: string) => {
    const { error } = await supabase
      .from('time_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setTimeEntries(prev => prev.filter(e => e.id !== id));
  };

  const value = {
    invoices,
    clients,
    timeEntries,
    loading,
    refreshData,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addClient,
    updateClient,
    deleteClient,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}