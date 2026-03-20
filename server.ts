import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data
  const accommodations = [
    { 
      id: '1', 
      name: 'SLIIT Green Residence', 
      description: 'Modern student housing located just minutes away from SLIIT campus. Features high-speed internet, 24/7 security, and a vibrant student community. Perfect for those looking for a balanced study-life environment.',
      price: 25000, 
      rating: 4.8, 
      city: 'Malabe', 
      location: '123 University Ave',
      university: 'SLIIT',
      image: 'https://picsum.photos/seed/acc1/800/600',
      images: [
        'https://picsum.photos/seed/acc1/800/600',
        'https://picsum.photos/seed/room1/800/600',
        'https://picsum.photos/seed/bath1/800/600'
      ],
      roomTypes: ['Single', 'Double'],
      facilities: ['WiFi', 'AC', 'Attached Bathroom', 'Parking'],
      ownerName: 'Sunil Perera',
      ownerPhone: '+94 77 123 4567',
      reviews: [
        { id: 'r1', userName: 'Amali', rating: 5, comment: 'Great place, very close to campus!', date: '2026-02-15' },
        { id: 'r2', userName: 'Kasun', rating: 4, comment: 'Clean and quiet, perfect for studying.', date: '2026-03-01' }
      ]
    },
    { 
      id: '2', 
      name: 'Kaduwela Student Inn', 
      description: 'Affordable and cozy shared rooms in the heart of Kaduwela. Ideal for students on a budget who still want quality living conditions. Includes basic utilities and common study areas.',
      price: 18500, 
      rating: 4.5, 
      city: 'Kaduwela', 
      location: '45 Main St',
      university: 'SAITM',
      image: 'https://picsum.photos/seed/acc2/800/600',
      images: [
        'https://picsum.photos/seed/acc2/800/600',
        'https://picsum.photos/seed/room2/800/600'
      ],
      roomTypes: ['Shared'],
      facilities: ['WiFi', 'Parking', 'Meals'],
      ownerName: 'Nimal Silva',
      ownerPhone: '+94 71 987 6543',
      reviews: [
        { id: 'r3', userName: 'Dilshan', rating: 4, comment: 'Good value for money.', date: '2026-01-20' }
      ]
    },
    { 
      id: '3', 
      name: 'Pittugala Luxury Boarding', 
      description: 'Experience luxury student living at its finest. Our suites offer private balconies, premium furniture, and all-inclusive services including laundry and daily meals.',
      price: 35000, 
      rating: 4.9, 
      city: 'Pittugala', 
      location: '88 Luxury Lane',
      university: 'SLIIT',
      image: 'https://picsum.photos/seed/acc3/800/600',
      images: [
        'https://picsum.photos/seed/acc3/800/600',
        'https://picsum.photos/seed/room3/800/600',
        'https://picsum.photos/seed/pool1/800/600'
      ],
      roomTypes: ['Single'],
      facilities: ['WiFi', 'AC', 'Attached Bathroom', 'Parking', 'Meals'],
      ownerName: 'Kamal Gunaratne',
      ownerPhone: '+94 76 555 1234',
      reviews: [
        { id: 'r4', userName: 'Ishara', rating: 5, comment: 'The best boarding in Malabe!', date: '2026-03-10' }
      ]
    }
  ];

  const bookings: any[] = [];

  const canteens = [
    {
      id: 'c1',
      name: 'Main Canteen',
      location: 'Block A, Ground Floor',
      rating: 4.2,
      description: 'The largest canteen on campus serving a variety of local and international dishes.',
      image: 'https://picsum.photos/seed/canteen1/800/600'
    },
    {
      id: 'c2',
      name: 'Engineering Cafe',
      location: 'Engineering Faculty, Level 2',
      rating: 4.5,
      description: 'Quick snacks, coffee, and light meals for busy engineering students.',
      image: 'https://picsum.photos/seed/cafe1/800/600'
    },
    {
      id: 'c3',
      name: 'Business Lounge Cafe',
      location: 'Business School, Entrance Hall',
      rating: 4.7,
      description: 'Premium coffee and gourmet sandwiches in a relaxed atmosphere.',
      image: 'https://picsum.photos/seed/cafe2/800/600'
    }
  ];

  const menuItems = [
    { id: 'm1', canteenId: 'c1', name: 'Chicken Fried Rice', description: 'Classic fried rice with seasoned chicken and veggies.', price: 450, category: 'Main', image: 'https://picsum.photos/seed/food1/400/300' },
    { id: 'm2', canteenId: 'c1', name: 'Veggie Pasta', description: 'Creamy pasta with fresh seasonal vegetables.', price: 380, category: 'Main', image: 'https://picsum.photos/seed/food2/400/300' },
    { id: 'm3', canteenId: 'c1', name: 'Fruit Salad', description: 'Freshly cut seasonal fruits.', price: 150, category: 'Dessert', image: 'https://picsum.photos/seed/food3/400/300' },
    { id: 'm4', canteenId: 'c2', name: 'Club Sandwich', description: 'Triple-decker sandwich with chicken, egg, and cheese.', price: 320, category: 'Snack', image: 'https://picsum.photos/seed/food4/400/300' },
    { id: 'm5', canteenId: 'c2', name: 'Iced Coffee', description: 'Chilled coffee with a hint of vanilla.', price: 200, category: 'Beverage', image: 'https://picsum.photos/seed/food5/400/300' },
    { id: 'm6', canteenId: 'c3', name: 'Beef Burger', description: 'Juicy beef patty with caramelized onions and special sauce.', price: 550, category: 'Main', image: 'https://picsum.photos/seed/food6/400/300' }
  ];

  const orders: any[] = [];

  // API Routes
  app.get("/api/accommodations", (req, res) => {
    const { location, university, roomType, minPrice, maxPrice, facilities } = req.query;
    
    let filtered = [...accommodations];

    if (location) {
      filtered = filtered.filter(a => a.city.toLowerCase().includes((location as string).toLowerCase()));
    }
    if (university) {
      filtered = filtered.filter(a => a.university === university);
    }
    if (minPrice) {
      filtered = filtered.filter(a => a.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(a => a.price <= Number(maxPrice));
    }
    if (roomType) {
      const types = (roomType as string).split(',');
      filtered = filtered.filter(a => a.roomTypes.some(t => types.includes(t)));
    }
    if (facilities) {
      const facs = (facilities as string).split(',');
      filtered = filtered.filter(a => facs.every(f => a.facilities.includes(f)));
    }

    res.json(filtered);
  });

  app.get("/api/accommodations/:id", (req, res) => {
    const acc = accommodations.find(a => a.id === req.params.id);
    if (acc) {
      res.json(acc);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.post("/api/bookings", (req, res) => {
    const booking = { ...req.body, id: Date.now().toString(), status: 'Pending' };
    bookings.push(booking);
    res.status(201).json(booking);
  });

  // Canteen Routes
  app.get("/api/canteens", (req, res) => {
    res.json(canteens);
  });

  app.get("/api/canteens/:id/menu", (req, res) => {
    const menu = menuItems.filter(m => m.canteenId === req.params.id);
    res.json(menu);
  });

  app.get("/api/orders", (req, res) => {
    const { studentId, canteenId } = req.query;
    let filtered = [...orders];
    if (studentId) {
      filtered = filtered.filter(o => o.studentId === studentId);
    }
    if (canteenId) {
      filtered = filtered.filter(o => o.canteenId === canteenId);
    }
    res.json(filtered);
  });

  app.post("/api/orders", (req, res) => {
    const order = { 
      ...req.body, 
      id: `ord-${Date.now()}`, 
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    orders.push(order);
    res.status(201).json(order);
  });

  app.patch("/api/orders/:id/status", (req, res) => {
    const { status } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (order) {
      order.status = status;
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
