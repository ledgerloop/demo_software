export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  hourly_rate: number;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  currency: string;
  notes?: string;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  client_id?: string;
  project_name: string;
  description: string;
  start_time: string;
  end_time?: string;
  duration: number; // in minutes
  hourly_rate: number;
  is_billable: boolean;
  is_invoiced: boolean;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  company_name: string;
  company_email: string;
  company_phone?: string;
  company_address?: string;
  company_logo?: string;
  default_currency: string;
  default_tax_rate: number;
  invoice_terms?: string;
  invoice_notes?: string;
}