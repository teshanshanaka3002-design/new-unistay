const axios = require('axios');

async function testBooking() {
  try {
    const res = await axios.post('http://localhost:5000/api/bookings', {
      accommodationId: "507f1f77bcf86cd799439011",
      roomType: "Single",
      duration: 6,
      totalPrice: 150000,
      fullName: "Test User",
      university: "SLIIT",
      gender: "Male",
      age: "22",
      studentId: "65f12ab3de45c67890123456",
      nationalId: "123456789V",
      contactNo: "0711234567",
      paymentProof: "base64...",
      status: "Pending"
    });
    console.log(res.data);
  } catch (err) {
    console.error("ERROR DATA:", err.response ? err.response.data : err.message);
  }
}

testBooking();
