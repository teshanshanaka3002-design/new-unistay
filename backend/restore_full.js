const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Models
const User = require("./models/User");
const Accommodation = require("./models/Accommodation");
const Canteen = require("./models/Canteen");
const MenuItem = require("./models/MenuItem");
const Booking = require("./models/Booking");

const restore = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // 1. CLEAR COLLECTIONS
        await User.deleteMany({});
        await Accommodation.deleteMany({});
        await Canteen.deleteMany({});
        await MenuItem.deleteMany({});
        await Booking.deleteMany({});
        console.log("🗑️ Cleared existing data");

        // 2. RESTORE USERS
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        const users = [
            { 
                _id: new mongoose.Types.ObjectId("60b9f0f9bcf86cd799439011"),
                name: "Test Student", 
                email: "student@test.com", 
                password: hashedPassword, 
                role: "STUDENT" 
            },
            { 
                _id: new mongoose.Types.ObjectId("60b9f0f9bcf86cd799439012"),
                name: "Boarding Owner", 
                email: "owner@test.com", 
                password: hashedPassword, 
                role: "BOARDING_OWNER" 
            },
            { 
                _id: new mongoose.Types.ObjectId("60b9f0f9bcf86cd799439013"),
                name: "Cafe Manager", 
                email: "cafe@test.com", 
                password: hashedPassword, 
                role: "RESTAURANT_OWNER" 
            }
        ];
        await User.insertMany(users);
        console.log("👤 Users restored: student@test.com, owner@test.com, cafe@test.com (pass: password123)");

        // 3. RESTORE ACCOMMODATIONS (from JSON)
        const dataPath = path.join(__dirname, "..", "accommodations.json");
        if (fs.existsSync(dataPath)) {
            const rawData = fs.readFileSync(dataPath, "utf-8");
            const parsedData = JSON.parse(rawData);
            const docs = parsedData.value.map((item) => {
                const { _id, __v, ...rest } = item;
                // Assign to our test owner
                rest.ownerId = "60b9f0f9bcf86cd799439012";
                return rest;
            });
            await Accommodation.insertMany(docs);
            console.log(`🏠 ${docs.length} Accommodations restored`);
        }

        // 4. RESTORE CANTEEN & MENU
        const canteen = new Canteen({
            _id: new mongoose.Types.ObjectId("60b9f0f9bcf86cd799439020"),
            ownerId: "60b9f0f9bcf86cd799439013",
            name: "SLIIT Green Cafe",
            location: "SLIIT Main Premises, Malabe",
            university: "SLIIT",
            contactNo: "0112345678",
            rating: 4.8,
            description: "Premium student dining with a focus on healthy and delicious meals.",
            image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1500"
        });
        await canteen.save();

        const menuItems = [
            {
                canteenId: canteen._id,
                name: "Premium Chicken Kottu",
                price: 850,
                category: "Dinner",
                description: "Authentic Sri Lankan shredded bread with spiced chicken and vegetables.",
                image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800",
                isAvailable: true
            },
            {
                canteenId: canteen._id,
                name: "Vegetable Fried Rice",
                price: 650,
                category: "Lunch",
                description: "Classic wok-fried rice with fresh garden vegetables.",
                image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800",
                isAvailable: true
            }
        ];
        await MenuItem.insertMany(menuItems);
        console.log("🍲 Canteen & Menu Items restored");

        // 5. RESTORE TEST BOOKING (for My Bookings feature)
        const firstAcc = await Accommodation.findOne();
        if (firstAcc) {
            const booking = new Booking({
                accommodationId: firstAcc._id,
                roomType: firstAcc.roomType || "Single Room",
                duration: 6,
                totalPrice: (firstAcc.price || 25000) * 6,
                studentId: "60b9f0f9bcf86cd799439011", // Test Student
                fullName: "Test Student",
                university: "SLIIT",
                gender: "Male",
                age: "22",
                nationalId: "123456789V",
                status: "Pending"
            });
            await booking.save();
            console.log("📅 Test Booking restored for student@test.com");
        }

        console.log("\n✨ FULL SYSTEM RESTORE COMPLETE! ✨");
        process.exit(0);
    } catch (err) {
        console.error("❌ Restore failed:", err);
        process.exit(1);
    }
};

restore();
