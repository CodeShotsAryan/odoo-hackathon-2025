import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const apiService = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    },
    requestOtp: async (email: string) => {
      const response = await api.post('/auth/request-otp', { email });
      return response.data;
    },
    verifyOtp: async (email: string, otp: string, newPassword: string) => {
      const response = await api.post('/auth/verify-otp', { 
        email, 
        otp, 
        new_password: newPassword 
      });
      return response.data;
    },
  },

  admin: {
    createUser: async (data: {
      name: string;
      email: string;
      role_id: number;
      temp_password: string;
    }) => {
      const response = await api.post('/admin/users/create', data);
      return response.data;
    },
    listUsers: async () => {
      const response = await api.get('/admin/users/');
      return response.data;
    },
  },

  products: {
    list: async () => {
      const response = await api.get('/products/');
      return response.data;
    },
    getById: async (id: number) => {
      const response = await api.get(`/products/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/products/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.put(`/products/${id}`, data);
      return response.data;
    },
    delete: async (id: number) => {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    },
  },

  operations: {
    receipt: async (data: any) => {
      const response = await api.post('/operations/receipt', data);
      return response.data;
    },
    delivery: async (data: any) => {
      const response = await api.post('/operations/delivery', data);
      return response.data;
    },
    transfer: async (data: any) => {
      const response = await api.post('/operations/transfer', data);
      return response.data;
    },
    adjust: async (data: any) => {
      const response = await api.post('/operations/adjust', data);
      return response.data;
    },
    getReceipts: async () => {
      const response = await api.get('/receipts/');
      return response.data;
    },
    getReceiptById: async (id: number) => {
      const receipts = await api.get('/receipts/');
      const receipt = receipts.data.find((r: any) => r.id === id);
      if (!receipt) throw new Error('Receipt not found');
      return {
        ...receipt,
        receiveFrom: receipt.from,
        responsible: 'Admin User',
        operationType: 'IN',
        lines: []
      };
    },
    validateReceipt: async (id: number) => {
      return { success: true };
    },
    cancelReceipt: async (id: number) => {
      return { success: true };
    },
    getDeliveries: async () => {
      const response = await api.get('/deliveries/');
      return response.data;
    },
    getDeliveryById: async (id: number) => {
      const deliveries = await api.get('/deliveries/');
      const delivery = deliveries.data.find((d: any) => d.id === id);
      if (!delivery) throw new Error('Delivery not found');
      return {
        ...delivery,
        address: '123 Tech Park',
        responsible: 'John Doe',
        operationType: 'OUT',
        lines: []
      };
    },
    validateDelivery: async (id: number) => {
      return { success: true };
    },
    cancelDelivery: async (id: number) => {
      return { success: true };
    },
    searchProducts: async (query: string) => {
      const products = await api.get('/products/');
      return products.data.filter((p: any) => 
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    },
  },

  dashboard: {
    getSummary: async () => {
      const response = await api.get('/dashboard');
      return response.data;
    },
  },

  ledger: {
    list: async (filters?: any) => {
      const params = new URLSearchParams();
      if (filters?.product_id) params.append('product_id', filters.product_id.toString());
      if (filters?.move_type) params.append('move_type', filters.move_type);
      if (filters?.from_date) params.append('from_date', filters.from_date);
      if (filters?.to_date) params.append('to_date', filters.to_date);
      
      const response = await api.get(`/ledger?${params.toString()}`);
      return response.data;
    },
  },

  stock: {
    getStockList: async () => {
      const products = await api.get('/products/');
      const ledger = await api.get('/ledger');
      
      const stockMap: Record<number, number> = {};
      ledger.data.forEach((entry: any) => {
        if (!stockMap[entry.product_id]) stockMap[entry.product_id] = 0;
        stockMap[entry.product_id] += entry.qty_change;
      });
      
      return products.data.map((product: any) => ({
        id: product.id.toString(),
        name: product.name,
        cost: 0,
        onHand: stockMap[product.id] || 0,
        freeToUse: stockMap[product.id] || 0,
      }));
    },
  },

  warehouse: {
    getAll: async () => {
      const response = await api.get('/warehouses/');
      return response.data.map((w: any) => ({
        id: w.id.toString(),
        name: w.name,
        shortCode: `WH-${w.id}`,
        address: w.address || 'No address'
      }));
    },
    create: async (data: any) => {
      const response = await api.post('/warehouses/', {
        name: data.name,
        short_code: data.shortCode,
        address: data.address
      });
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/warehouses/${id}`, {
        name: data.name,
        short_code: data.shortCode,
        address: data.address
      });
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/warehouses/${id}`);
      return response.data;
    },
  },

  locations: {
    getAll: async () => {
      const response = await api.get('/locations/');
      return response.data.map((l: any) => ({
        id: l.id.toString(),
        name: l.name,
        shortCode: `LOC-${l.id}`,
        warehouseId: l.warehouse_id.toString(),
        warehouseName: l.warehouse_name
      }));
    },
    create: async (data: any) => {
      const response = await api.post('/locations/', {
        name: data.name,
        short_code: data.shortCode,
        warehouse_id: parseInt(data.warehouseId)
      });
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/locations/${id}`, {
        name: data.name,
        short_code: data.shortCode,
        warehouse_id: data.warehouseId ? parseInt(data.warehouseId) : undefined
      });
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/locations/${id}`);
      return response.data;
    },
  },

  adjustments: {
    list: async (filters?: any) => {
      const response = await api.get('/adjustments/');
      return response.data;
    },
    getById: async (id: string) => {
      const adjustments = await api.get('/adjustments/');
      return adjustments.data.find((a: any) => a.id === id) || null;
    },
    create: async (data: any) => {
      const response = await api.post('/adjustments/', {
        product_id: parseInt(data.productId),
        warehouse_id: parseInt(data.warehouseId),
        location_id: parseInt(data.locationId),
        adjustment_type: data.type,
        quantity: data.quantity,
        reason: data.reason,
        note: data.note
      });
      return response.data;
    },
    apply: async (id: string) => {
      return { success: true };
    },
    cancel: async (id: string) => {
      return { success: true };
    },
    revert: async (id: string) => {
      return { success: true };
    },
    bulkApply: async (ids: string[]) => {
      return { success: true };
    },
  },

  moves: {
    getMoveHistory: async () => {
      const ledger = await api.get('/ledger');
      return ledger.data.map((entry: any) => ({
        id: entry.id.toString(),
        reference: entry.reference,
        date: new Date(entry.created_at).toLocaleDateString(),
        contact: 'Contact',
        from: entry.location_src_id ? `Location ${entry.location_src_id}` : 'Vendor',
        to: entry.location_dest_id ? `Location ${entry.location_dest_id}` : 'Customer',
        quantity: Math.abs(entry.qty_change),
        productName: 'Product',
        type: entry.move_type === 'receipt' ? 'IN' : entry.move_type === 'delivery' ? 'OUT' : 'TRANSFER',
        status: 'Done'
      }));
    },
  },
};

export default apiService;