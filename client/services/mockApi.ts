
import { 
  User, UserRole, AuthResponse, DashboardSummary, Operation, 
  DashboardFilters, Receipt, Delivery, DeliveryDetail, Product, 
  DeliveryLine, ReceiptDetail, StockMove, StockItem, ReceiptLine,
  Warehouse, Location, Adjustment, AdjustmentFilter
} from '../types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Mock Database ---

const users: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@stockmaster.io',
    role: UserRole.ADMIN,
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=FF7A1A&color=fff'
  },
  {
    id: '2',
    username: 'user',
    email: 'user@stockmaster.io',
    role: UserRole.USER,
    avatarUrl: 'https://ui-avatars.com/api/?name=User&background=random'
  }
];

const summaryData: DashboardSummary = {
  receiptCount: 4,
  deliveryCount: 4,
  receiptStats: { late: 1, waiting: 3, total: 10 },
  deliveryStats: { late: 0, waiting: 2, total: 8 },
  validityData: { valid: 65, invalid: 15, resources: 20 },
  activityData: [12, 18, 15, 25, 22, 30, 28, 35, 20, 40, 38, 45]
};

const operationsData: Operation[] = [
  {
    id: '1',
    date: 'Oct 24',
    productName: 'High-Perf Sensor X1',
    quantity: 50,
    location: 'Warehouse A - Shelf 4',
    status: 'LATE',
    assignedTo: { name: 'Alice', avatarUrl: 'https://ui-avatars.com/api/?name=Alice' }
  },
  {
    id: '2',
    date: 'Oct 25',
    productName: 'Hydraulic Pump 2000',
    quantity: 12,
    location: 'Dock B',
    status: 'OPERATIONS',
    assignedTo: { name: 'Bob', avatarUrl: 'https://ui-avatars.com/api/?name=Bob' }
  },
  {
    id: '3',
    date: 'Oct 26',
    productName: 'Circuit Board v2',
    quantity: 1500,
    location: 'Zone C',
    status: 'WAITING',
    assignedTo: { name: 'Charlie', avatarUrl: 'https://ui-avatars.com/api/?name=Charlie' }
  }
];

const receiptsData: Receipt[] = [
  { id: 1, reference: "WH/IN/0001", from: "Vendor A", to: "WH/Stock1", contact: "Azure Interior", scheduleDate: "2024-02-20", status: "Late" },
  { id: 2, reference: "WH/IN/0002", from: "Vendor B", to: "WH/Stock1", contact: "Gemini Tech", scheduleDate: "2025-10-15", status: "Ready" },
  { id: 3, reference: "WH/IN/0003", from: "Global Supplies", to: "WH/Stock2", contact: "Deco Addict", scheduleDate: "2025-11-01", status: "Waiting" },
  { id: 4, reference: "WH/IN/0004", from: "Tech Parts Ltd", to: "WH/Zone A", contact: "Lumber Inc", scheduleDate: "2025-10-20", status: "Ready" }
];

const deliveriesData: Delivery[] = [
  { id: 1, reference: "WH/OUT/0001", from: "WH/Stock1", to: "Cust: Azure Interior", contact: "Azure Interior", scheduleDate: "2025-02-25", status: "Ready" },
  { id: 2, reference: "WH/OUT/0002", from: "WH/Stock1", to: "Cust: Azure Interior", contact: "Azure Interior", scheduleDate: "2024-02-18", status: "Late" },
  { id: 3, reference: "WH/OUT/0003", from: "WH/Stock2", to: "Cust: Acme Corp", contact: "Acme Corp", scheduleDate: "2025-02-27", status: "Waiting" }
];

const products: Product[] = [
  { id: 'p1', code: 'DESK001', name: 'Large Corner Desk', stock: 50 },
  { id: 'p2', code: 'CHAIR002', name: 'Ergonomic Chair', stock: 120 },
  { id: 'p3', code: 'LAMP003', name: 'Desk Lamp LED', stock: 0 },
  { id: 'p4', code: 'MON004', name: 'Monitor Stand', stock: 15 },
];

// Stock Moves
const moveHistoryData: StockMove[] = [
  { id: 'm1', reference: 'WH/IN/0001', date: '2024-02-20', contact: 'Vendor A', from: 'Vendor', to: 'WH/Stock1', quantity: 50, productName: 'Large Corner Desk', type: 'IN', status: 'Done' },
  { id: 'm2', reference: 'WH/OUT/0002', date: '2024-02-21', contact: 'Azure Interior', from: 'WH/Stock1', to: 'Customer', quantity: 10, productName: 'Ergonomic Chair', type: 'OUT', status: 'Done' },
  { id: 'm3', reference: 'WH/INT/0005', date: '2024-02-22', contact: 'Internal', from: 'WH/Stock1', to: 'WH/Stock2', quantity: 5, productName: 'Desk Lamp LED', type: 'TRANSFER', status: 'Ready' },
  { id: 'm4', reference: 'WH/IN/0004', date: '2024-02-23', contact: 'Tech Parts', from: 'Vendor', to: 'WH/Zone A', quantity: 100, productName: 'Monitor Stand', type: 'IN', status: 'Done' },
  { id: 'm5', reference: 'WH/IN/0004', date: '2024-02-23', contact: 'Tech Parts', from: 'Vendor', to: 'WH/Zone A', quantity: 200, productName: 'HDMI Cables', type: 'IN', status: 'Done' }, // Grouped ref example
  { id: 'm6', reference: 'WH/OUT/0008', date: '2024-02-24', contact: 'Deco Addict', from: 'WH/Stock2', to: 'Customer', quantity: 2, productName: 'Large Corner Desk', type: 'OUT', status: 'Done' },
];

// Stock Items
let stockData: StockItem[] = [
  { id: 's1', name: 'Large Corner Desk', cost: 3000, onHand: 50, freeToUse: 45 },
  { id: 's2', name: 'Ergonomic Chair', cost: 1500, onHand: 120, freeToUse: 110 },
  { id: 's3', name: 'Desk Lamp LED', cost: 450, onHand: 0, freeToUse: 0 },
  { id: 's4', name: 'Monitor Stand', cost: 1200, onHand: 15, freeToUse: 15 },
  { id: 's5', name: 'HDMI Cable 2m', cost: 200, onHand: 500, freeToUse: 500 },
];

// Warehouses
let warehouseData: Warehouse[] = [
  { id: 'w1', name: 'Central Depot', shortCode: 'WH/CEN', address: '123 Logistics Way, Industrial Park, NY' },
  { id: 'w2', name: 'Eastside Storage', shortCode: 'WH/EST', address: '45 Harbor View, Boston, MA' },
  { id: 'w3', name: 'Quick Dispatch', shortCode: 'WH/QCK', address: '88 Fast Lane, Austin, TX' }
];

// Locations
let locationData: Location[] = [
  { id: 'l1', name: 'Receiving Area', shortCode: 'REC', warehouseId: 'w1' },
  { id: 'l2', name: 'Bulk Storage A', shortCode: 'BLK-A', warehouseId: 'w1' },
  { id: 'l3', name: 'High Value Cage', shortCode: 'HVC', warehouseId: 'w1' },
  { id: 'l4', name: 'Dock 1', shortCode: 'DK1', warehouseId: 'w2' },
  { id: 'l5', name: 'Shelf 4B', shortCode: 'SH-4B', warehouseId: 'w3' }
];

// Adjustments
let adjustmentData: Adjustment[] = [
  {
    id: 'adj1',
    reference: 'WH/ADJ/0001',
    date: '2024-03-01',
    warehouseId: 'w1',
    locationId: 'l2',
    productId: 'p1',
    productCode: 'DESK001',
    productName: 'Large Corner Desk',
    currentStock: 45,
    type: 'ADD',
    quantity: 5,
    reason: 'Count Correction',
    status: 'Applied',
    createdBy: 'Admin',
    createdAt: '2024-03-01T10:00:00Z',
    appliedBy: 'Admin',
    appliedAt: '2024-03-01T10:05:00Z'
  },
  {
    id: 'adj2',
    reference: 'WH/ADJ/0002',
    date: '2024-03-02',
    warehouseId: 'w1',
    locationId: 'l2',
    productId: 'p2',
    productCode: 'CHAIR002',
    productName: 'Ergonomic Chair',
    currentStock: 120,
    type: 'REMOVE',
    quantity: 2,
    reason: 'Damaged',
    note: 'Leg broken during transit',
    status: 'Applied',
    createdBy: 'Admin',
    createdAt: '2024-03-02T14:20:00Z',
    appliedBy: 'Admin',
    appliedAt: '2024-03-02T14:25:00Z'
  },
  {
    id: 'adj3',
    reference: 'WH/ADJ/0003',
    date: '2024-03-05',
    warehouseId: 'w2',
    locationId: 'l4',
    productId: 'p3',
    productCode: 'LAMP003',
    productName: 'Desk Lamp LED',
    currentStock: 10,
    type: 'CORRECTION',
    quantity: 5,
    reason: 'Audit',
    status: 'Draft',
    createdBy: 'User',
    createdAt: '2024-03-05T09:00:00Z'
  },
  {
    id: 'adj4',
    reference: 'WH/ADJ/0004',
    date: '2024-03-06',
    warehouseId: 'w3',
    locationId: 'l5',
    productId: 'p4',
    productCode: 'MON004',
    productName: 'Monitor Stand',
    currentStock: 20,
    type: 'REMOVE',
    quantity: 50, // Intentionally creating negative stock scenario
    reason: 'Theft',
    status: 'Pending',
    createdBy: 'User',
    createdAt: '2024-03-06T16:45:00Z',
    warning: true
  },
  {
    id: 'adj5',
    reference: 'WH/ADJ/0005',
    date: '2024-03-07',
    warehouseId: 'w1',
    locationId: 'l1',
    productId: 'p2',
    productCode: 'CHAIR002',
    productName: 'Ergonomic Chair',
    currentStock: 118,
    type: 'ADD',
    quantity: 10,
    reason: 'Found in Warehouse',
    status: 'Cancelled',
    createdBy: 'Admin',
    createdAt: '2024-03-07T11:30:00Z'
  },
  {
    id: 'adj6',
    reference: 'WH/ADJ/0006',
    date: '2024-03-08',
    warehouseId: 'w2',
    locationId: 'l4',
    productId: 'p1',
    productCode: 'DESK001',
    productName: 'Large Corner Desk',
    currentStock: 50,
    type: 'CORRECTION',
    quantity: 1,
    reason: 'Count Correction',
    status: 'Draft',
    createdBy: 'User',
    createdAt: '2024-03-08T13:15:00Z'
  }
];

// --- Mock API Export ---

export const apiMock = {
  // Auth
  login: async (username: string): Promise<AuthResponse> => {
    await delay(600);
    const user = users.find(u => u.username === username.toLowerCase()) || users[1]; 
    return {
      token: 'mock-jwt-token-123',
      user
    };
  },
  requestPasswordReset: async (email: string) => {
    await delay(500);
    return { success: true };
  },
  verifyOtp: async (otp: string) => {
    await delay(500);
    if (otp === '123456') return { success: true };
    throw new Error('Invalid OTP');
  },
  resetPassword: async () => {
    await delay(800);
    return { success: true };
  },
  adminCreateUser: async (data: any) => {
    await delay(600);
    return { success: true };
  },

  // Dashboard
  dashboard: {
    getSummary: async () => {
      await delay(400);
      return summaryData;
    }
  },

  // Operations
  operations: {
    list: async (filters?: DashboardFilters) => {
      await delay(400);
      return operationsData;
    },
    // Receipts
    getReceipts: async () => {
      await delay(300);
      return receiptsData;
    },
    getReceiptById: async (id: number): Promise<ReceiptDetail> => {
      await delay(300);
      const base = receiptsData.find(r => r.id === id) || receiptsData[0];
      return {
        ...base,
        receiveFrom: base.from,
        responsible: 'Admin User',
        operationType: 'IN',
        lines: [
          { id: 'l1', productId: 'p1', code: 'DESK001', name: 'Large Corner Desk', qty: 6, availableStock: 50 },
          { id: 'l2', productId: 'p2', code: 'CHAIR002', name: 'Ergonomic Chair', qty: 20, availableStock: 12 }, 
        ]
      };
    },
    validateReceipt: async (id: number) => {
      await delay(500);
      return { success: true };
    },
    cancelReceipt: async (id: number) => {
      await delay(300);
      return { success: true };
    },

    // Deliveries
    getDeliveries: async () => {
      await delay(300);
      return deliveriesData;
    },
    getDeliveryById: async (id: number): Promise<DeliveryDetail> => {
      await delay(300);
      const base = deliveriesData.find(d => d.id === id) || deliveriesData[0];
      return {
        ...base,
        address: '123 Tech Park, Silicon Valley, CA',
        responsible: 'John Doe',
        operationType: 'OUT',
        lines: [
          { id: 'dl1', productId: 'p1', code: 'DESK001', name: 'Large Corner Desk', qty: 2, location: 'WH/Stock1', availableStock: 50 },
          { id: 'dl2', productId: 'p3', code: 'LAMP003', name: 'Desk Lamp LED', qty: 5, location: 'WH/Stock1', availableStock: 0 },
        ]
      };
    },
    validateDelivery: async (id: number) => {
      await delay(500);
      return { success: true };
    },
    cancelDelivery: async (id: number) => {
      await delay(300);
      return { success: true };
    },

    // Products Helper
    searchProducts: async (query: string): Promise<Product[]> => {
      await delay(200);
      return products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }
  },

  // Move History
  moves: {
    getMoveHistory: async () => {
      await delay(400);
      return moveHistoryData;
    }
  },

  // Stock
  stock: {
    getStockList: async () => {
      await delay(300);
      return stockData;
    },
    updateStock: async (id: string, updates: Partial<StockItem>) => {
      await delay(400);
      stockData = stockData.map(s => s.id === id ? { ...s, ...updates } : s);
      return { success: true };
    }
  },

  // Products Helper for Adjustments
  products: {
    getList: async () => {
      await delay(200);
      return products;
    },
    getStock: async (productId: string, locationId: string) => {
      await delay(200);
      // Mock logic: find product in stockData or products list
      const prod = products.find(p => p.id === productId);
      return prod ? prod.stock : 0;
    },
    updateStock: async (productId: string, locationId: string, newQty: number) => {
      await delay(300);
      const prodIndex = products.findIndex(p => p.id === productId);
      if (prodIndex !== -1) {
        products[prodIndex].stock = newQty;
      }
      return { success: true };
    }
  },

  // Adjustments
  adjustments: {
    list: async (filters?: AdjustmentFilter) => {
      await delay(400);
      let data = [...adjustmentData];
      if (filters) {
         if (filters.type && filters.type !== 'ALL') {
            data = data.filter(a => a.type === filters.type);
         }
         if (filters.status && filters.status !== 'ALL') {
            data = data.filter(a => a.status === filters.status);
         }
         if (filters.warehouseId) {
            data = data.filter(a => a.warehouseId === filters.warehouseId);
         }
      }
      return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    getById: async (id: string) => {
      await delay(300);
      return adjustmentData.find(a => a.id === id) || null;
    },
    create: async (data: Omit<Adjustment, 'id' | 'reference' | 'createdAt' | 'createdBy'>) => {
      await delay(400);
      const newId = `adj${Date.now()}`;
      const ref = `WH/ADJ/${String(adjustmentData.length + 1).padStart(4, '0')}`;
      const newAdj: Adjustment = {
        ...data,
        id: newId,
        reference: ref,
        createdAt: new Date().toISOString(),
        createdBy: 'Current User', // Mocked
        status: 'Draft'
      };
      adjustmentData = [newAdj, ...adjustmentData];
      return newAdj;
    },
    update: async (id: string, data: Partial<Adjustment>) => {
      await delay(300);
      adjustmentData = adjustmentData.map(a => a.id === id ? { ...a, ...data } : a);
      return adjustmentData.find(a => a.id === id);
    },
    apply: async (id: string) => {
      await delay(500);
      const adj = adjustmentData.find(a => a.id === id);
      if (!adj) throw new Error('Adjustment not found');
      
      // Update product stock logic (mock)
      const prod = products.find(p => p.id === adj.productId);
      if (prod) {
        if (adj.type === 'ADD') prod.stock += adj.quantity;
        if (adj.type === 'REMOVE') prod.stock -= adj.quantity;
        if (adj.type === 'CORRECTION') prod.stock = adj.quantity;
      }

      const updated: Adjustment = {
        ...adj,
        status: 'Applied',
        appliedBy: 'Current User',
        appliedAt: new Date().toISOString()
      };
      
      adjustmentData = adjustmentData.map(a => a.id === id ? updated : a);
      return updated;
    },
    cancel: async (id: string) => {
      await delay(300);
      adjustmentData = adjustmentData.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a);
      return { success: true };
    },
    revert: async (id: string) => {
      await delay(500);
      const original = adjustmentData.find(a => a.id === id);
      if (!original || original.status !== 'Applied') throw new Error('Cannot revert');
      
      // Create compensating adjustment
      const newId = `adj${Date.now()}`;
      const ref = `WH/ADJ/${String(adjustmentData.length + 1).padStart(4, '0')}`;
      
      let revertType: any = 'CORRECTION';
      let revertQty = original.quantity;
      
      if (original.type === 'ADD') revertType = 'REMOVE';
      if (original.type === 'REMOVE') revertType = 'ADD';
      // For correction, we'd need the original stock before correction, keeping simple for mock
      
      const revertAdj: Adjustment = {
        ...original,
        id: newId,
        reference: ref,
        type: revertType,
        quantity: revertQty,
        reason: `Revert of ${original.reference}`,
        status: 'Applied', // Auto apply revert
        createdAt: new Date().toISOString(),
        createdBy: 'System',
        appliedAt: new Date().toISOString(),
        appliedBy: 'System'
      };
      
      // Update stock back
      const prod = products.find(p => p.id === original.productId);
      if (prod) {
        if (revertType === 'ADD') prod.stock += revertQty;
        if (revertType === 'REMOVE') prod.stock -= revertQty;
      }

      adjustmentData = [revertAdj, ...adjustmentData];
      return revertAdj;
    },
    bulkApply: async (ids: string[]) => {
       await delay(800);
       // Simple loop apply for mock
       for (const id of ids) {
          const adj = adjustmentData.find(a => a.id === id);
          if (adj && adj.status === 'Draft') {
             // Update product stock logic
            const prod = products.find(p => p.id === adj.productId);
            if (prod) {
              if (adj.type === 'ADD') prod.stock += adj.quantity;
              if (adj.type === 'REMOVE') prod.stock -= adj.quantity;
              if (adj.type === 'CORRECTION') prod.stock = adj.quantity;
            }
            adj.status = 'Applied';
            adj.appliedBy = 'Bulk Action';
            adj.appliedAt = new Date().toISOString();
          }
       }
       return { success: true };
    }
  },

  // Settings - Warehouse
  warehouse: {
    getAll: async () => {
      await delay(300);
      return warehouseData;
    },
    create: async (data: Omit<Warehouse, 'id'>) => {
      await delay(400);
      if (warehouseData.some(w => w.shortCode === data.shortCode)) {
        throw new Error('Short code already exists');
      }
      const newWh = { ...data, id: `w${Date.now()}` };
      warehouseData = [...warehouseData, newWh];
      return newWh;
    },
    update: async (id: string, data: Partial<Warehouse>) => {
      await delay(400);
      // Check duplicate short code if being updated
      if (data.shortCode && warehouseData.some(w => w.shortCode === data.shortCode && w.id !== id)) {
        throw new Error('Short code already exists');
      }
      warehouseData = warehouseData.map(w => w.id === id ? { ...w, ...data } : w);
      return { success: true };
    },
    delete: async (id: string) => {
      await delay(300);
      warehouseData = warehouseData.filter(w => w.id !== id);
      return { success: true };
    }
  },

  // Settings - Locations
  locations: {
    getAll: async () => {
      await delay(300);
      // Join with warehouse data for display
      return locationData.map(loc => ({
        ...loc,
        warehouseName: warehouseData.find(w => w.id === loc.warehouseId)?.name || 'Unknown'
      }));
    },
    create: async (data: Omit<Location, 'id'>) => {
      await delay(400);
      if (locationData.some(l => l.shortCode === data.shortCode && l.warehouseId === data.warehouseId)) {
         throw new Error('Short code already exists in this warehouse');
      }
      const newLoc = { ...data, id: `l${Date.now()}` };
      locationData = [...locationData, newLoc];
      return newLoc;
    },
    update: async (id: string, data: Partial<Location>) => {
      await delay(400);
      // Check duplicate short code logic
      if (data.shortCode && locationData.some(l => l.shortCode === data.shortCode && l.warehouseId === (data.warehouseId || l.warehouseId) && l.id !== id)) {
        throw new Error('Short code already exists');
      }
      locationData = locationData.map(l => l.id === id ? { ...l, ...data } : l);
      return { success: true };
    },
    delete: async (id: string) => {
      await delay(300);
      locationData = locationData.filter(l => l.id !== id);
      return { success: true };
    }
  }
};
