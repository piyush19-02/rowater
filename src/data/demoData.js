// ============ MANAGERS ============
export const managers = [
  {
    id: "MGR001",
    name: "Rajesh Kumar",
    phone: "9876543210",
    email: "rajesh@rowater.com",
    password: "123456",
    area: "North Zone",
    status: "active",
  },
  {
    id: "MGR002",
    name: "Priya Singh",
    phone: "9123456789",
    email: "priya@rowater.com",
    password: "123456",
    area: "South Zone",
    status: "active",
  },
  {
    id: "MGR003",
    name: "Vikram Patel",
    phone: "8765432101",
    email: "vikram@rowater.com",
    password: "123456",
    area: "East Zone",
    status: "active",
  },
  {
    id: "MGR004",
    name: "Neha Verma",
    phone: "7654321098",
    email: "neha@rowater.com",
    password: "123456",
    area: "West Zone",
    status: "active",
  },
];

// ============ CUSTOMERS ============
export const  monthlyCustomers= [
  {
    id: "1",
    name: "Ramesh Kirana Store",
    mobile: "9876543210",
    shop: "Main Market", //remove shop
    address: "Huzurganj Road",
    jar: 5,
    liter: 10,
  },
  {
    id: "2",
    name: "Shyam Dairy",
    mobile: "9123456780",
    shop: "Bus Stand Area",
    address: "Near Bus Stand",
    jar: 3,
    liter: 15,
  },
  {
    id: "3",
    name: "Amit General Store",
    mobile: "8765432109",
    shop: "City Center",
    address: "MG Road",
    jar: 4,
    liter: 8,
  },
  {
    id: "4",
    name: "Priya Supermarket",
    mobile: "7654321098",
    shop: "Residential Area",
    address: "Sector 5",
    jar: 6,
    liter: 12,
  },
  {
    id: "5",
    name: "Vikram Provision Store",
    mobile: "6543210987",
    shop: "Market Complex",
    address: "Block A",
    jar: 2,
    liter: 20,
  },
];
export const expenses = [
  {
    id: 1,
    amount: 2500,
    description: "Diesel Expense",
  },

  {
    id: 2,
    amount: 1800,
    description: "Jar Repair",
  },

  {
    id: 3,
    amount: 3200,
    description: "Staff Payment",
  },

  {
    id: 4,
    amount: 1500,
    description: "Vehicle Service",
  },

  {
    id: 5,
    amount: 5000,
    description: "Water Plant Maintenance",
  },
];

export const deliveries = [
  // CUSTOMER 1
  { customer_id: "1", date: "2026-04-18", amount: 500, received: 300, deliveryBoy: "Amit", vehicle: "MP04 AB1234" },
  { customer_id: "1", date: "2026-04-17", amount: 400, received: 0, deliveryBoy: "Amit", vehicle: "MP04 AB1234" },
  { customer_id: "1", date: "2026-04-16", amount: 600, received: 600, deliveryBoy: "Ravi", vehicle: "MP04 XY5678" },
  { customer_id: "1", date: "2026-04-15", amount: 450, received: 200, deliveryBoy: "Ravi", vehicle: "MP04 XY5678" },
  { customer_id: "1", date: "2026-04-14", amount: 300, received: 0, deliveryBoy: "Amit", vehicle: "MP04 AB1234" },
  { customer_id: "1", date: "2026-04-13", amount: 700, received: 500, deliveryBoy: "Ravi", vehicle: "MP04 XY5678" },
  { customer_id: "1", date: "2026-04-12", amount: 550, received: 550, deliveryBoy: "Amit", vehicle: "MP04 AB1234" },

  // PREVIOUS
  { customer_id: "1", date: "2026-03-28", amount: 400, received: 200, deliveryBoy: "Ravi", vehicle: "MP04 XY5678" },
  { customer_id: "1", date: "2026-03-25", amount: 600, received: 600, deliveryBoy: "Amit", vehicle: "MP04 AB1234" },

  // CUSTOMER 2
  { customer_id: "2", date: "2026-04-18", amount: 200, received: 200, deliveryBoy: "Suresh", vehicle: "MP04 CD2222" },
  { customer_id: "2", date: "2026-04-17", amount: 300, received: 100, deliveryBoy: "Suresh", vehicle: "MP04 CD2222" },
  { customer_id: "2", date: "2026-04-16", amount: 250, received: 0, deliveryBoy: "Mukesh", vehicle: "MP04 EF3333" },
];