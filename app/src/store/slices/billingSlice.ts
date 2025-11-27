import { createSlice } from '@reduxjs/toolkit';
import type{PayloadAction } from '@reduxjs/toolkit';

export interface InvoiceItem {
    id: string;
    description: string;
    qty: number;
    unitPrice: number;
}

export interface Invoice {
    id: string;
    patientId: string;
    patientName: string;
    email: string;
    date: string;
    dueDate: string;
    items: InvoiceItem[];
    subtotal: number;
    taxPercent: number;
    discount: number;
    total: number;
    status: 'Paid' | 'Pending' | 'Overdue';
}

const initialState: { invoices: Invoice[] } = {
    invoices: [
        {
            id: 'INV-2034',
            patientId: 'P001',
            patientName: 'John Smith',
            email: 'john.smith@gmail.com',
            date: '12 Sep 2025',
            dueDate: '19 Sep 2025',
            items: [{ id: '1', description: 'OPD Consultation', qty: 1, unitPrice: 5800 }],
            subtotal: 5800,
            taxPercent: 0,
            discount: 0,
            total: 5800,
            status: 'Paid'
        },
        {
            id: 'INV-2035',
            patientId: 'P001',
            patientName: 'John Smith',
            email: 'john.smith@gmail.com',
            date: '12 Sep 2025',
            dueDate: '19 Sep 2025',
            items: [{ id: '1', description: 'Blood Test', qty: 1, unitPrice: 5800 }],
            subtotal: 5800,
            taxPercent: 0,
            discount: 0,
            total: 5800,
            status: 'Pending'
        },
        {
            id: 'INV-2036',
            patientId: 'P001',
            patientName: 'John Smith',
            email: 'john.smith@gmail.com',
            date: '12 Sep 2025',
            dueDate: '01 Sep 2025',
            items: [{ id: '1', description: 'X-Ray', qty: 1, unitPrice: 5800 }],
            subtotal: 5800,
            taxPercent: 0,
            discount: 0,
            total: 5800,
            status: 'Overdue'
        },
        {
            id: 'INV-2037',
            patientId: 'P001',
            patientName: 'John Smith',
            email: 'john.smith@gmail.com',
            date: '12 Sep 2025',
            dueDate: '19 Sep 2025',
            items: [{ id: '1', description: 'Checkup', qty: 1, unitPrice: 5800 }],
            subtotal: 5800,
            taxPercent: 0,
            discount: 0,
            total: 5800,
            status: 'Paid'
        }
    ]
};

const billingSlice = createSlice({
    name: 'billing',
    initialState,
    reducers: {
        addInvoice: (state, action: PayloadAction<Invoice>) => {
            state.invoices.unshift(action.payload); // Add to top
        }
    }
});

export const { addInvoice } = billingSlice.actions;
export default billingSlice.reducer;