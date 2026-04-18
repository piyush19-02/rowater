export const customers = [
  {
    id: "1",
    name: "Ramesh Kirana Store",
    mobile: "9876543210",
    shop: "Main Market",
    address: "Huzurganj Road",
  },
  {
    id: "2",
    name: "Shyam Dairy",
    mobile: "9123456780",
    shop: "Bus Stand Area",
    address: "Near Bus Stand",
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