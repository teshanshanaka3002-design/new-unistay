import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

// --- MongoDB Schemas ---
const accommodationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  city: { type: String, required: true },
  location: { type: String, required: true },
  university: { type: String, required: true },
  image: { type: String, required: true },
  images: [String],
  roomTypes: [String],
  facilities: [String],
  ownerName: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  reviews: [{
    userName: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }]
});

const canteenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  university: { type: String, required: true },
  rating: { type: Number, default: 0 },
  description: { type: String, required: true },
  image: { type: String, required: true }
});

const menuItemSchema = new mongoose.Schema({
  canteenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Canteen', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentUniversity: { type: String, required: true },
  studentYear: { type: String, required: true },
  studentIdNumber: { type: String, required: true },
  studentPhone: { type: String, required: true },
  canteenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Canteen', required: true },
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: String,
    price: Number,
    quantity: Number
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  accommodationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation', required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  moveInDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['STUDENT', 'BOARDING_OWNER', 'RESTAURANT_OWNER', 'ADMIN'],
    default: 'STUDENT',
    required: true
  },
  warning: { type: Number, default: 0 },
  warningNote: { type: String, default: "" }
}, { timestamps: true });

const reportSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  studentIdNumber: { type: String, required: true },
  university: { type: String, required: true },
  contactNumber: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
  replies: [{
    adminName: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const unifiedReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  type: { type: String, enum: ['WEBSITE', 'STAY', 'MEAL'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: false },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  adminReply: { type: String },
  adminName: { type: String },
  replyDate: { type: Date }
}, { timestamps: true });

const Accommodation = mongoose.model('Accommodation', accommodationSchema);
const Canteen = mongoose.model('Canteen', canteenSchema);
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const Order = mongoose.model('Order', orderSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const User = mongoose.model('User', userSchema);
const Report = mongoose.model('Report', reportSchema);
const UnifiedReview = mongoose.model('UnifiedReview', unifiedReviewSchema);

let isMongoConnected = false;

// --- Mock Data for Fallback ---
const MOCK_ACCOMMODATIONS = [
  { 
    _id: 'acc-1',
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
    roomType: 'Single Room',
    propertyType: 'Boarding House',
    facilities: ['WiFi', 'Air Conditioning', 'Attached Bathroom', 'Parking', 'CCTV Security'],
    genderPreference: 'Mixed',
    ownerName: 'Sunil Perera',
    ownerPhone: '+94 77 123 4567',
    reviews: [
      { userName: 'Amali', rating: 5, comment: 'Great place, very close to campus!', date: new Date('2026-02-15') },
      { userName: 'Kasun', rating: 4, comment: 'Clean and quiet, perfect for studying.', date: new Date('2026-03-01') }
    ]
  },
  { 
    _id: 'acc-2',
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
    roomType: 'Shared Room',
    propertyType: 'Hostel',
    facilities: ['WiFi', 'Parking', 'Meals Included', 'Laundry'],
    genderPreference: 'Male',
    ownerName: 'Nimal Silva',
    ownerPhone: '+94 71 987 6543',
    reviews: [
      { userName: 'Dilshan', rating: 4, comment: 'Good value for money.', date: new Date('2026-01-20') }
    ]
  },
  { 
    _id: 'acc-3',
    name: 'NSBM Premium Annex', 
    description: 'High-end annex for NSBM students. Features premium furniture, private kitchen, and high-speed fiber internet. Located in a quiet residential area of Pitipana.',
    price: 45000, 
    rating: 4.9, 
    city: 'Homagama', 
    location: 'Pitipana North',
    university: 'NSBM',
    image: 'https://picsum.photos/seed/acc3/800/600',
    images: [
      'https://picsum.photos/seed/acc3/800/600',
      'https://picsum.photos/seed/room3/800/600'
    ],
    roomType: 'Single Room',
    propertyType: 'Annex',
    facilities: ['WiFi', 'Air Conditioning', 'Attached Bathroom', 'Kitchen Access', '24/7 Water & Electricity'],
    genderPreference: 'Female',
    ownerName: 'Kamala Devi',
    ownerPhone: '+94 77 555 1234',
    reviews: [
      { userName: 'Sithmi', rating: 5, comment: 'Very safe and comfortable.', date: new Date('2026-03-10') }
    ]
  },
  { 
    _id: 'acc-4',
    name: 'Moratuwa Scholars Hostel', 
    description: 'Standard hostel for UoM students. Walking distance to the university. Great for those who want to be close to campus activities.',
    price: 12000, 
    rating: 4.2, 
    city: 'Moratuwa', 
    location: 'Katubedda',
    university: 'University of Moratuwa',
    image: 'https://picsum.photos/seed/acc4/800/600',
    images: [
      'https://picsum.photos/seed/acc4/800/600'
    ],
    roomType: 'Shared Room',
    propertyType: 'Hostel',
    facilities: ['WiFi', 'Study Desk', '24/7 Water & Electricity'],
    genderPreference: 'Mixed',
    ownerName: 'Bandara',
    ownerPhone: '+94 71 222 3333',
    reviews: []
  }
];

const MOCK_CANTEENS = [
  {
    _id: 'cant-1',
    name: 'P&S Cafe',
    location: 'Block A, Ground Floor',
    university: 'SLIIT',
    rating: 4.8,
    description: 'Fresh pastries, sandwiches, and premium coffee for SLIIT students.',
    image: 'https://picsum.photos/seed/pscafe/800/600'
  },
  {
    _id: 'cant-2',
    name: 'Basement Canteen',
    location: 'Main Building, Basement',
    university: 'SLIIT',
    rating: 4.2,
    description: 'Affordable and hearty local meals, perfect for a quick lunch break.',
    image: 'https://picsum.photos/seed/basement/800/600'
  },
  {
    _id: 'cant-3',
    name: 'NSBM Food Court',
    location: 'NSBM Green University, Level 1',
    university: 'NSBM',
    rating: 4.5,
    description: 'A wide variety of cuisines from around the world in a modern setting.',
    image: 'https://picsum.photos/seed/nsbmfood/800/600'
  },
  {
    _id: 'cant-4',
    name: 'IIT Hub',
    location: 'IIT Campus, Level 3',
    university: 'IIT',
    rating: 4.6,
    description: 'The central hub for food and socializing at IIT.',
    image: 'https://picsum.photos/seed/iithub/800/600'
  },
  {
    _id: 'cant-5',
    name: 'CINEC Galley',
    location: 'CINEC Campus, Ground Floor',
    university: 'CINEC',
    rating: 4.3,
    description: 'Quality meals for maritime and engineering students.',
    image: 'https://picsum.photos/seed/cinecgalley/800/600'
  }
];

const MOCK_MENU_ITEMS = [
  // SLIIT P&S Cafe
  { _id: 'm1', canteenId: 'cant-1', name: 'Chicken Puff', description: 'Flaky pastry filled with spicy chicken.', price: 120, category: 'Snacks', image: 'https://picsum.photos/seed/puff/400/300' },
  { _id: 'm2', canteenId: 'cant-1', name: 'Iced Coffee', description: 'Chilled premium coffee with milk.', price: 250, category: 'Beverages', image: 'https://picsum.photos/seed/icedcoffee/400/300' },
  { _id: 'm3', canteenId: 'cant-1', name: 'Club Sandwich', description: 'Classic club sandwich with fries.', price: 450, category: 'Fast Food', image: 'https://picsum.photos/seed/clubsandwich/400/300' },
  
  // SLIIT Basement Canteen
  { _id: 'm4', canteenId: 'cant-2', name: 'Chicken Rice & Curry', description: 'Traditional Sri Lankan rice and curry.', price: 350, category: 'Rice & Curry', image: 'https://picsum.photos/seed/ricecurry/400/300' },
  { _id: 'm5', canteenId: 'cant-2', name: 'Egg Kottu', description: 'Popular Sri Lankan street food.', price: 400, category: 'Fast Food', image: 'https://picsum.photos/seed/kottu/400/300' },
  
  // NSBM Food Court
  { _id: 'm6', canteenId: 'cant-3', name: 'Beef Burger', description: 'Juicy beef patty with cheese and veggies.', price: 650, category: 'Fast Food', image: 'https://picsum.photos/seed/burger/400/300' },
  { _id: 'm7', canteenId: 'cant-3', name: 'Mixed Fried Rice', description: 'Fried rice with chicken, beef, and prawns.', price: 550, category: 'Rice & Curry', image: 'https://picsum.photos/seed/friedrice/400/300' },
  { _id: 'm8', canteenId: 'cant-3', name: 'Fruit Juice', description: 'Freshly squeezed seasonal fruit juice.', price: 200, category: 'Beverages', image: 'https://picsum.photos/seed/juice/400/300' }
];

let MOCK_ORDERS: any[] = [];
let MOCK_BOOKINGS: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/unistay";
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB");
    isMongoConnected = true;

    // Seed data if empty
    const accCount = await Accommodation.countDocuments();
    if (accCount === 0) {
      await Accommodation.insertMany(MOCK_ACCOMMODATIONS.map(a => {
        const { _id, ...rest } = a;
        return rest;
      }));

      const savedCanteens = await Canteen.insertMany(MOCK_CANTEENS.map(c => {
        const { _id, ...rest } = c;
        return rest;
      }));

      const initialMenuItems = [
        // SLIIT P&S Cafe
        { canteenId: savedCanteens[0]._id, name: 'Chicken Puff', description: 'Flaky pastry filled with spicy chicken.', price: 120, category: 'Snacks', image: 'https://picsum.photos/seed/puff/400/300' },
        { canteenId: savedCanteens[0]._id, name: 'Iced Coffee', description: 'Chilled premium coffee with milk.', price: 250, category: 'Beverages', image: 'https://picsum.photos/seed/icedcoffee/400/300' },
        { canteenId: savedCanteens[0]._id, name: 'Club Sandwich', description: 'Classic club sandwich with fries.', price: 450, category: 'Fast Food', image: 'https://picsum.photos/seed/clubsandwich/400/300' },
        
        // SLIIT Basement Canteen
        { canteenId: savedCanteens[1]._id, name: 'Chicken Rice & Curry', description: 'Traditional Sri Lankan rice and curry.', price: 350, category: 'Rice & Curry', image: 'https://picsum.photos/seed/ricecurry/400/300' },
        { canteenId: savedCanteens[1]._id, name: 'Egg Kottu', description: 'Popular Sri Lankan street food.', price: 400, category: 'Fast Food', image: 'https://picsum.photos/seed/kottu/400/300' },
        
        // NSBM Food Court
        { canteenId: savedCanteens[2]._id, name: 'Beef Burger', description: 'Juicy beef patty with cheese and veggies.', price: 650, category: 'Fast Food', image: 'https://picsum.photos/seed/burger/400/300' },
        { canteenId: savedCanteens[2]._id, name: 'Mixed Fried Rice', description: 'Fried rice with chicken, beef, and prawns.', price: 550, category: 'Rice & Curry', image: 'https://picsum.photos/seed/friedrice/400/300' },
        { canteenId: savedCanteens[2]._id, name: 'Fruit Juice', description: 'Freshly squeezed seasonal fruit juice.', price: 200, category: 'Beverages', image: 'https://picsum.photos/seed/juice/400/300' }
      ];
      await MenuItem.insertMany(initialMenuItems);
    }
  } catch (err) {
    console.error("MongoDB connection error (falling back to mock data):", err);
    isMongoConnected = false;
  }

  // Ensure default admin exists and has correct credentials
  const initializeAdmin = async () => {
    try {
      const adminEmail = "admin@unistay.com";
      const hashedPassword = await bcrypt.hash("admin@password123", 10);
      
      await User.findOneAndUpdate(
        { email: adminEmail },
        { 
          name: "System Admin",
          password: hashedPassword,
          role: "ADMIN"
        },
        { upsert: true, new: true }
      );
      
      console.log("✅ Admin account synchronized: admin@unistay.com / admin@password123");
    } catch (err: any) {
      console.error("❌ Error initializing admin:", err.message);
    }
  };

  if (isMongoConnected) {
    await initializeAdmin();
  }

  // --- AUTH ROUTES ---
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ error: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, role: role || 'STUDENT' });
      await newUser.save();
      res.status(201).json({ message: "Registered successfully" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET || "fallback_secret", 
        { expiresIn: "1d" }
      );

      res.json({ 
        token, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          warning: user.warning || 0,
          warningNote: user.warningNote || ""
        } 
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- REVIEW ROUTES ---
  app.get("/api/reviews/admin/all", async (req, res) => {
    try {
      const reviews = await UnifiedReview.find().sort({ createdAt: -1 });
      res.json(reviews);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const review = new UnifiedReview(req.body);
      await review.save();
      res.json(review);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get(["/api/reviews/target/:type", "/api/reviews/target/:type/:id"], async (req, res) => {
    try {
      const { type, id } = req.params;
      const query: any = { type };
      if (id) query.targetId = id;
      const reviews = await UnifiedReview.find(query).sort({ createdAt: -1 });
      res.json(reviews);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/reviews/admin/reply/:id", async (req, res) => {
    try {
      const { message } = req.body;
      const review = await UnifiedReview.findByIdAndUpdate(req.params.id, {
        adminReply: message,
        adminName: "Admin",
        replyDate: new Date()
      }, { new: true });
      res.json(review);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/reviews/admin/:id", async (req, res) => {
    try {
      await UnifiedReview.findByIdAndDelete(req.params.id);
      res.json({ message: "Review deleted" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- REPORT ROUTES ---
  app.post("/api/reports/submit", async (req, res) => {
    try {
      const report = new Report(req.body);
      await report.save();
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/reports/my-reports", async (req, res) => {
    // Note: In real app, we'd get studentId from JWT. For now, we'll assume it's passed or filtered.
    try {
      const reports = await Report.find();
      res.json(reports);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/reports/admin/all", async (req, res) => {
    try {
      const reports = await Report.find().sort({ createdAt: -1 });
      res.json(reports);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/reports/:id/reply", async (req, res) => {
    try {
      const { message, status } = req.body;
      const update: any = { $push: { replies: { adminName: "Admin", message, createdAt: new Date() } } };
      if (status) update.status = status;
      const report = await Report.findByIdAndUpdate(req.params.id, update, { new: true });
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Routes
  app.get("/api/accommodations", async (req, res) => {
    const { location, university, roomType, minPrice, maxPrice, facilities } = req.query;
    
    try {
      if (isMongoConnected) {
        let query: any = {};
        if (location) query.city = { $regex: location as string, $options: 'i' };
        if (university) query.university = university;
        if (minPrice || maxPrice) {
          query.price = {};
          if (minPrice) query.price.$gte = Number(minPrice);
          if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (roomType) query.roomTypes = { $in: (roomType as string).split(',') };
        if (facilities) query.facilities = { $all: (facilities as string).split(',') };

        const accs = await Accommodation.find(query);
        res.json(accs);
      } else {
        let filtered = [...MOCK_ACCOMMODATIONS];
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
          filtered = filtered.filter(a => types.includes(a.roomType));
        }
        if (facilities) {
          const facs = (facilities as string).split(',');
          filtered = filtered.filter(a => facs.every(f => a.facilities.includes(f)));
        }
        res.json(filtered);
      }
    } catch (err) {
      console.error("Fetch accommodations error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/accommodations/:id", async (req, res) => {
    try {
      if (isMongoConnected) {
        const acc = await Accommodation.findById(req.params.id);
        if (acc) res.json(acc);
        else res.status(404).json({ error: "Not found" });
      } else {
        const acc = MOCK_ACCOMMODATIONS.find(a => a._id === req.params.id);
        if (acc) res.json(acc);
        else res.status(404).json({ error: "Not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      if (isMongoConnected) {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json(booking);
      } else {
        const booking = { ...req.body, _id: `book-${Date.now()}`, createdAt: new Date() };
        MOCK_BOOKINGS.push(booking);
        res.status(201).json(booking);
      }
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Canteen Routes
  app.get("/api/canteens", async (req, res) => {
    try {
      if (isMongoConnected) {
        const canteens = await Canteen.find();
        res.json(canteens);
      } else {
        res.json(MOCK_CANTEENS);
      }
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/canteens/:id/menu", async (req, res) => {
    try {
      if (isMongoConnected) {
        const menu = await MenuItem.find({ canteenId: req.params.id });
        res.json(menu);
      } else {
        const menu = MOCK_MENU_ITEMS.filter(m => m.canteenId === req.params.id);
        res.json(menu);
      }
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    const { studentId, canteenId } = req.query;
    try {
      if (isMongoConnected) {
        let query: any = {};
        if (studentId) query.studentId = studentId;
        if (canteenId) query.canteenId = canteenId;
        const orders = await Order.find(query).populate('canteenId');
        res.json(orders);
      } else {
        let filtered = [...MOCK_ORDERS];
        if (studentId) filtered = filtered.filter(o => o.studentId === studentId);
        if (canteenId) filtered = filtered.filter(o => o.canteenId === canteenId);
        
        // Mock population
        const populated = filtered.map(o => ({
          ...o,
          canteenId: MOCK_CANTEENS.find(c => c._id === o.canteenId) || o.canteenId
        }));
        res.json(populated);
      }
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      if (isMongoConnected) {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
      } else {
        const order = { 
          ...req.body, 
          _id: `ord-${Date.now()}`, 
          status: 'Pending',
          createdAt: new Date() 
        };
        MOCK_ORDERS.push(order);
        res.status(201).json(order);
      }
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    const { status } = req.body;
    try {
      if (isMongoConnected) {
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (order) res.json(order);
        else res.status(404).json({ error: "Order not found" });
      } else {
        const index = MOCK_ORDERS.findIndex(o => o._id === req.params.id);
        if (index !== -1) {
          MOCK_ORDERS[index].status = status;
          res.json(MOCK_ORDERS[index]);
        } else {
          res.status(404).json({ error: "Order not found" });
        }
      }
    } catch (err) {
      res.status(500).json({ error: "Server error" });
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
