import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    unit: string;
    totalStock: number;
    availableStock: number;
    usedToday: number;
    threshold: number;
    supplier: string;
    status?: 'Available' | 'Low Stock'; // Derived property
    expiryDate: string;
    batchNo: string;
}

interface InventoryState {
    items: InventoryItem[];
}

// Initial Mock Data
const initialState: InventoryState = {
    items: [
        { id: 'INV001', name: "Gloves (Sterile)", category: "PPE", unit: "Box", totalStock: 125, availableStock: 162, usedToday: 55, threshold: 50, supplier: 'Medix Distributors', expiryDate: '12 Dec 2025', batchNo: 'BAT001' },
        { id: 'INV002', name: "Surgical Mask", category: "PPE", unit: "Packets", totalStock: 500, availableStock: 450, usedToday: 50, threshold: 100, supplier: 'SafeHands Co', expiryDate: '10 Jan 2026', batchNo: 'BAT002' },
        { id: 'INV003', name: "Syringes (5ml)", category: "Equipment", unit: "Box", totalStock: 300, availableStock: 40, usedToday: 20, threshold: 50, supplier: 'Medix Distributors', expiryDate: '05 Nov 2024', batchNo: 'BAT003' },
    ]
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<InventoryItem>) => {
            state.items.push(action.payload);
        },
        updateStock: (state, action: PayloadAction<{id: string, newStock: number}>) => {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) {
                item.availableStock = action.payload.newStock;
            }
        }
    },
});

export const { addItem, updateStock } = inventorySlice.actions;
export default inventorySlice.reducer;