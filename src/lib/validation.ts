
export const validatePhone = (phone: string) => {
  if (!phone) return "Phone number is required";
  if (!/^\d+$/.test(phone)) return "Only numeric values allowed";
  if (phone.length !== 10) return "Phone number must be exactly 10 digits";
  return "";
};

export const validateFullName = (name: string) => {
  if (!name) return "Full name is required";
  if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters";
  if (name.length < 3) return "Must be at least 3 characters";
  return "";
};

export const validateDate = (date: string) => {
  if (!date) return "Date is required";
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) return "Date cannot be in the past";
  return "";
};

export const validateAge = (age: string | number) => {
  if (!age) return "Age is required";
  const ageNum = Number(age);
  if (isNaN(ageNum)) return "Age must be a number";
  if (ageNum < 15) return "Age must be at least 15";
  return "";
};

export const getMinDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};
