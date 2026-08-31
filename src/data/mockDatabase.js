// Mock Database & Multi-Tab Real-Time Sync Engine for Garpoo Cafe
import { MENU_ITEMS, CAFE_INFO } from './garpooMenu.js';

const STORAGE_KEYS = {
  TABLE_SESSIONS: 'garpoo_table_sessions_v1',
  MENU_STOCK: 'garpoo_menu_stock_v1',
  ORDER_HISTORY: 'garpoo_order_history_v1',
  CURRENT_TABLE: 'garpoo_active_table_v1',
  CART: 'garpoo_cart_v1'
};

// Initial state for 20 tables in Garpoo Cafe Medan
const INITIAL_TABLES = Array.from({ length: 20 }, (_, i) => {
  const tableNum = (i + 1).toString().padStart(2, '0');
  return {
    id: `table-${tableNum}`,
    number: tableNum,
    name: `Meja ${tableNum}`,
    capacity: i < 6 ? 2 : i < 14 ? 4 : 6,
    status: 'idle', // 'idle' | 'ordering' | 'cooking' | 'served' | 'unpaid' | 'completed'
    activeSessionId: null,
    customerName: null,
    customerPhone: null,
    orders: [], // List of order rounds
    totalBill: 0,
    totalItems: 0,
    paymentStatus: 'unpaid', // 'unpaid' | 'paid_qris' | 'paid_cash' | 'paid_ewallet'
    paymentMethod: null,
    paidAt: null,
    waiterCallTime: null,
    createdAt: null
  };
});

// BroadcastChannel for instant cross-tab real-time sync
let syncChannel = null;
try {
  syncChannel = new BroadcastChannel('garpoo_realtime_sync');
} catch (e) {
  console.warn('BroadcastChannel not supported, falling back to storage events');
}

export function broadcastEvent(type, payload = {}) {
  const message = { type, payload, timestamp: Date.now() };
  if (syncChannel) {
    syncChannel.postMessage(message);
  }
  // Trigger custom window event for local listeners
  window.dispatchEvent(new CustomEvent('garpoo_sync', { detail: message }));
}

export function subscribeToEvents(callback) {
  const channelHandler = (event) => callback(event.data);
  const customHandler = (event) => callback(event.detail);
  const storageHandler = (e) => {
    if (e.key && e.key.startsWith('garpoo_')) {
      callback({ type: 'STORAGE_UPDATE', key: e.key, timestamp: Date.now() });
    }
  };

  if (syncChannel) syncChannel.addEventListener('message', channelHandler);
  window.addEventListener('garpoo_sync', customHandler);
  window.addEventListener('storage', storageHandler);

  return () => {
    if (syncChannel) syncChannel.removeEventListener('message', channelHandler);
    window.removeEventListener('garpoo_sync', customHandler);
    window.removeEventListener('storage', storageHandler);
  };
}

export function getTables() {
  const data = localStorage.getItem(STORAGE_KEYS.TABLE_SESSIONS);
  if (!data) {
    // Populate with 2 initial sample active tables for realistic demo
    const sampleTables = [...INITIAL_TABLES];
    
    // Sample active order on Table 03
    sampleTables[2] = {
      ...sampleTables[2],
      status: 'cooking',
      activeSessionId: 'SES-03-9821',
      customerName: 'Kak Rina & Teman',
      orders: [
        {
          roundId: 'RND-01',
          roundNumber: 1,
          timestamp: Date.now() - 15 * 60 * 1000,
          status: 'cooking',
          items: [
            {
              id: 'nb-01',
              name: 'Nasi Goreng Rempah Garpoo',
              price: 44000,
              qty: 2,
              variants: { spiciness: 'Level 2 (Pedas Garpoo)', eggOption: 'Telur Mata Sapi' },
              toppings: [{ name: 'Ekstra Telur', price: 5000 }],
              itemTotal: 49000 * 2,
              notes: 'Jangan terlalu asin kak'
            },
            {
              id: 'kp-01',
              name: 'Kopi Sanger Khas Medan',
              price: 47000,
              qty: 2,
              variants: { temperature: 'Dingin (Es Sanger)', sweetness: 'Manis Normal' },
              toppings: [],
              itemTotal: 47000 * 2,
              notes: ''
            }
          ],
          subtotal: 192000,
          tax: 19200,
          total: 211200
        }
      ],
      totalBill: 211200,
      totalItems: 4,
      paymentStatus: 'unpaid',
      createdAt: Date.now() - 15 * 60 * 1000
    };

    // Sample active order on Table 07
    sampleTables[6] = {
      ...sampleTables[6],
      status: 'served',
      activeSessionId: 'SES-07-4311',
      customerName: 'Bang Kevin',
      orders: [
        {
          roundId: 'RND-01',
          roundNumber: 1,
          timestamp: Date.now() - 35 * 60 * 1000,
          status: 'served',
          items: [
            {
              id: 'sn-01',
              name: 'Sate Taichan Garpoo (10 Tusuk)',
              price: 43000,
              qty: 1,
              variants: { spiciness: 'Sambal Pedas Nampol' },
              toppings: [{ name: 'Lontong Pulen', price: 6000 }],
              itemTotal: 49000,
              notes: 'Jeruk nipis banyakin ya'
            },
            {
              id: 'dr-01',
              name: 'Es Pokat Kocok Medan',
              price: 53000,
              qty: 1,
              variants: { sweetness: 'Manis Pas' },
              toppings: [],
              itemTotal: 53000,
              notes: ''
            }
          ],
          subtotal: 102000,
          tax: 10200,
          total: 112200
        }
      ],
      totalBill: 112200,
      totalItems: 2,
      paymentStatus: 'unpaid',
      createdAt: Date.now() - 35 * 60 * 1000
    };

    localStorage.setItem(STORAGE_KEYS.TABLE_SESSIONS, JSON.stringify(sampleTables));
    return sampleTables;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_TABLES;
  }
}

export function saveTables(tables) {
  localStorage.setItem(STORAGE_KEYS.TABLE_SESSIONS, JSON.stringify(tables));
  broadcastEvent('TABLES_UPDATED', { count: tables.length });
}

export function getTable(tableNumber) {
  const padNum = tableNumber.toString().padStart(2, '0');
  const tables = getTables();
  return tables.find(t => t.number === padNum) || null;
}

export function getActiveTableSession(tableNumber) {
  const table = getTable(tableNumber);
  if (!table) return null;
  return table;
}

// Add new order (or Add-on Round) to table session
export function submitOrderToTable({ tableNumber, customerName = '', customerPhone = '', items = [], paymentMethod = 'QRIS', voucher = null }) {
  const tables = getTables();
  const padNum = tableNumber.toString().padStart(2, '0');
  const tableIdx = tables.findIndex(t => t.number === padNum);

  if (tableIdx === -1) {
    throw new Error(`Meja ${padNum} tidak ditemukan`);
  }

  const table = tables[tableIdx];
  const now = Date.now();

  // Calculate order items subtotal
  let rawSubtotal = 0;
  const processedItems = items.map(item => {
    let itemPrice = item.price;
    const toppingTotal = (item.selectedToppings || []).reduce((acc, top) => acc + (top.price || 0), 0);
    const singleTotal = itemPrice + toppingTotal;
    const itemTotal = singleTotal * item.qty;
    rawSubtotal += itemTotal;

    return {
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image,
      variants: item.selectedVariants || {},
      toppings: item.selectedToppings || [],
      notes: item.notes || '',
      itemTotal
    };
  });

  // Calculate discount if any
  let discount = 0;
  if (voucher) {
    if (voucher.discountPercent) {
      discount = Math.min((rawSubtotal * voucher.discountPercent) / 100, voucher.maxDiscount || 999999);
    } else if (voucher.discountAmount) {
      discount = voucher.discountAmount;
    }
  }

  const taxableAmount = Math.max(0, rawSubtotal - discount);
  const tax = Math.round(taxableAmount * CAFE_INFO.taxRate);
  const roundTotal = taxableAmount + tax;

  // Check if this is a new session or an add-on round
  const isAddonRound = table.orders && table.orders.length > 0 && table.status !== 'completed' && table.status !== 'idle';
  const roundNumber = isAddonRound ? table.orders.length + 1 : 1;
  const roundId = `RND-${padNum}-${roundNumber}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newRound = {
    roundId,
    roundNumber,
    timestamp: now,
    status: 'cooking', // Initial kitchen status for the new round
    items: processedItems,
    subtotal: rawSubtotal,
    discount,
    voucherCode: voucher ? voucher.code : null,
    tax,
    total: roundTotal,
    paymentMethod
  };

  const updatedOrders = isAddonRound ? [...table.orders, newRound] : [newRound];
  const totalBill = updatedOrders.reduce((sum, r) => sum + r.total, 0);
  const totalItems = updatedOrders.reduce((sum, r) => sum + r.items.reduce((iSum, i) => iSum + i.qty, 0), 0);

  const updatedTable = {
    ...table,
    status: 'cooking',
    activeSessionId: table.activeSessionId || `SES-${padNum}-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: customerName || table.customerName || `Pelanggan Meja ${padNum}`,
    customerPhone: customerPhone || table.customerPhone || '',
    orders: updatedOrders,
    totalBill,
    totalItems,
    paymentStatus: paymentMethod === 'QRIS' ? 'paid_qris' : 'unpaid',
    paymentMethod,
    paidAt: paymentMethod === 'QRIS' ? now : null,
    createdAt: table.createdAt || now
  };

  tables[tableIdx] = updatedTable;
  saveTables(tables);

  // Save to history archive
  saveOrderToHistory(updatedTable, newRound);

  // Broadcast new order notification for Admin POS & Kitchen
  broadcastEvent('NEW_ORDER', {
    tableNumber: padNum,
    roundNumber,
    isAddon: isAddonRound,
    total: roundTotal,
    itemCount: processedItems.length,
    customerName: updatedTable.customerName
  });

  return { table: updatedTable, round: newRound };
}

// Call waiter for table
export function callWaiter(tableNumber, requestType = 'Panggil Pelayan') {
  const tables = getTables();
  const padNum = tableNumber.toString().padStart(2, '0');
  const tableIdx = tables.findIndex(t => t.number === padNum);

  if (tableIdx !== -1) {
    tables[tableIdx].waiterCallTime = Date.now();
    tables[tableIdx].waiterCallType = requestType;
    saveTables(tables);

    broadcastEvent('WAITER_CALLED', {
      tableNumber: padNum,
      requestType,
      timestamp: Date.now()
    });
    return true;
  }
  return false;
}

// Dismiss waiter call
export function dismissWaiterCall(tableNumber) {
  const tables = getTables();
  const padNum = tableNumber.toString().padStart(2, '0');
  const tableIdx = tables.findIndex(t => t.number === padNum);

  if (tableIdx !== -1) {
    tables[tableIdx].waiterCallTime = null;
    tables[tableIdx].waiterCallType = null;
    saveTables(tables);
    broadcastEvent('WAITER_DISMISSED', { tableNumber: padNum });
    return true;
  }
  return false;
}

// Update table order status (e.g. from POS / Kitchen)
export function updateTableOrderStatus(tableNumber, roundIndex, newStatus) {
  const tables = getTables();
  const padNum = tableNumber.toString().padStart(2, '0');
  const tableIdx = tables.findIndex(t => t.number === padNum);

  if (tableIdx !== -1) {
    const table = tables[tableIdx];
    if (table.orders && table.orders[roundIndex]) {
      table.orders[roundIndex].status = newStatus;
      
      // Determine overall table status
      const allStatuses = table.orders.map(o => o.status);
      if (allStatuses.every(s => s === 'served')) {
        table.status = table.paymentStatus === 'unpaid' ? 'unpaid' : 'served';
      } else if (allStatuses.some(s => s === 'cooking')) {
        table.status = 'cooking';
      }
      
      saveTables(tables);
      broadcastEvent('ORDER_STATUS_CHANGED', { tableNumber: padNum, roundIndex, newStatus });
      return true;
    }
  }
  return false;
}

// Mark table as paid and clear session (from POS)
export function completeTableSession(tableNumber, paymentMethod = 'Kasir Tunai') {
  const tables = getTables();
  const padNum = tableNumber.toString().padStart(2, '0');
  const tableIdx = tables.findIndex(t => t.number === padNum);

  if (tableIdx !== -1) {
    const table = tables[tableIdx];
    
    // Archive to completed history
    saveCompletedSession(table, paymentMethod);

    // Reset table to idle state
    tables[tableIdx] = {
      ...INITIAL_TABLES[tableIdx],
      number: padNum,
      id: `table-${padNum}`,
      name: `Meja ${padNum}`,
      status: 'idle',
      orders: [],
      totalBill: 0,
      totalItems: 0,
      paymentStatus: 'unpaid',
      customerName: null,
      activeSessionId: null
    };

    saveTables(tables);
    broadcastEvent('TABLE_COMPLETED', { tableNumber: padNum });
    return true;
  }
  return false;
}

// Menu Stock Override helpers
export function getMenuStock() {
  const data = localStorage.getItem(STORAGE_KEYS.MENU_STOCK);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

export function toggleMenuItemStock(itemId, isAvailable) {
  const stock = getMenuStock();
  stock[itemId] = { ...stock[itemId], isAvailable };
  localStorage.setItem(STORAGE_KEYS.MENU_STOCK, JSON.stringify(stock));
  broadcastEvent('MENU_STOCK_UPDATED', { itemId, isAvailable });
}

export function getFullMenuWithOverrides() {
  const stock = getMenuStock();
  return MENU_ITEMS.map(item => {
    const override = stock[item.id] || {};
    return {
      ...item,
      isAvailable: override.isAvailable !== undefined ? override.isAvailable : true,
      price: override.price !== undefined ? override.price : item.price
    };
  });
}

// Order history helpers
function saveOrderToHistory(table, round) {
  try {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY) || '[]');
    history.unshift({
      id: round.roundId,
      sessionId: table.activeSessionId,
      tableNumber: table.number,
      customerName: table.customerName,
      timestamp: round.timestamp,
      items: round.items,
      total: round.total,
      paymentMethod: round.paymentMethod
    });
    // Keep last 100 orders
    localStorage.setItem(STORAGE_KEYS.ORDER_HISTORY, JSON.stringify(history.slice(0, 100)));
  } catch (e) {}
}

function saveCompletedSession(table, paymentMethod) {
  try {
    const history = JSON.parse(localStorage.getItem('garpoo_completed_sessions_v1') || '[]');
    history.unshift({
      sessionId: table.activeSessionId,
      tableNumber: table.number,
      customerName: table.customerName,
      totalBill: table.totalBill,
      totalItems: table.totalItems,
      orders: table.orders,
      paymentMethod,
      completedAt: Date.now()
    });
    localStorage.setItem('garpoo_completed_sessions_v1', JSON.stringify(history.slice(0, 100)));
  } catch (e) {}
}

export function getCompletedSessions() {
  try {
    return JSON.parse(localStorage.getItem('garpoo_completed_sessions_v1') || '[]');
  } catch (e) {
    return [];
  }
}
