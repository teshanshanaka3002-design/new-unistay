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

const MOCK_MENU_ITEMS: any[] = [];
const MOCK_CANTEENS: any[] = [];
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
    console.log("✅ MongoDB Connected");
    isMongoConnected = true;
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
        res.json([]);
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
        res.status(404).json({ error: "Not found" });
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
