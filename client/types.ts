
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export enum ToastType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO'
}

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

// Dashboard Types
export type OperationStatus = 'LATE' | 'WAITING' | 'OPERATIONS' | 'DONE';

export interface Operation {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  location: string;
  status: OperationStatus;
  assignedTo?: {
    name: string;
    avatarUrl?: string;
  };
}

export interface DashboardSummary {
  receiptCount: number;
  deliveryCount: number;
  receiptStats: { late: number; waiting: number; total: number };
  deliveryStats: { late: number; waiting: number; total: number };
  validityData: { valid: number; invalid: number; resources: number };
  activityData: number[]; // Simple array for sparklines
}

export interface DashboardFilters {
  dateRange: string;
  product: string;
  profile: string;
}

// Receipt Types
export type ReceiptStatus = 'Ready' | 'Late' | 'Waiting' | 'Draft' | 'Done' | 'Cancelled';

export interface Receipt {
  id: number;
  reference: string;
  from: string;
  to: string;
  contact: string;
  scheduleDate: string;
  status: ReceiptStatus;
}

export interface ReceiptLine {
  id: string;
  productId: string;
  code: string;
  name: string;
  qty: number;
  availableStock: number;
}

export interface ReceiptDetail extends Receipt {
  receiveFrom: string;
  responsible: string;
  operationType: 'IN' | 'RETURN' | 'TRANSFER';
  lines: ReceiptLine[];
}

// Delivery Types
export type DeliveryStatus = 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Late' | 'Cancelled';

export interface Delivery {
  id: number;
  reference: string;
  from: string;
  to: string;
  contact: string;
  scheduleDate: string;
  status: DeliveryStatus;
}

// Delivery Detail Types
export interface Product {
  id: string;
  code: string;
  name: string;
  stock: number;
}

export interface DeliveryLine {
  id: string;
  productId: string;
  code: string;
  name: string;
  qty: number;
  location: string;
  availableStock: number;
}

export interface DeliveryDetail extends Delivery {
  address: string;
  responsible: string;
  operationType: 'OUT' | 'RETURN' | 'TRANSFER';
  lines: DeliveryLine[];
}

// Stock Move History Types
export type MoveType = 'IN' | 'OUT' | 'TRANSFER';
export type MoveStatus = 'Ready' | 'Waiting' | 'Late' | 'Done';

export interface StockMove {
  id: string;
  reference: string;
  date: string;
  contact: string;
  from: string;
  to: string;
  quantity: number;
  productName: string; // Added for list context
  type: MoveType;
  status: MoveStatus;
}

// Stock Items
export interface StockItem {
  id: string;
  name: string;
  cost: number;
  onHand: number;
  freeToUse: number;
}

// Warehouse Settings
export interface Warehouse {
  id: string;
  name: string;
  shortCode: string;
  address: string;
}

export interface Location {
  id: string;
  name: string;
  shortCode: string;
  warehouseId: string;
  warehouseName?: string; // For display convenience
}

// Adjustments
export type AdjustmentType = 'ADD' | 'REMOVE' | 'CORRECTION';
export type AdjustmentStatus = 'Draft' | 'Pending' | 'Applied' | 'Cancelled';

export interface Adjustment {
  id: string;
  reference: string;
  date: string; // ISO string
  warehouseId: string;
  locationId: string;
  productId: string;
  productName: string; // For list display
  productCode: string; // For list display
  currentStock: number; // At time of creation
  type: AdjustmentType;
  quantity: number;
  reason: string;
  note?: string;
  status: AdjustmentStatus;
  createdBy: string;
  createdAt: string;
  appliedBy?: string;
  appliedAt?: string;
  warning?: boolean; // If it causes negative stock
}

export interface AdjustmentFilter {
  dateRange?: string;
  warehouseId?: string;
  locationId?: string;
  type?: AdjustmentType | 'ALL';
  status?: AdjustmentStatus | 'ALL';
}
