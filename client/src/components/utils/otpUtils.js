// Store OTPs in memory for demo purposes
const otpStore = new Map();

// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send demo OTP
export const sendDemoOTP = (type, value) => {
  return new Promise((resolve) => {
    const otp = generateOTP();
    otpStore.set(`${type}-${value}`, otp);
    
    // Simulate API delay
    setTimeout(() => {
      alert(`Demo OTP for ${type} ${value}: ${otp}`);
      resolve({ success: true, message: 'OTP sent successfully' });
    }, 1000);
  });
};

// Verify demo OTP
export const verifyDemoOTP = (type, value, otp) => {
  return new Promise((resolve) => {
    const storedOTP = otpStore.get(`${type}-${value}`);
    
    // Simulate API delay
    setTimeout(() => {
      if (storedOTP === otp) {
        otpStore.delete(`${type}-${value}`);
        resolve({ success: true, message: 'OTP verified successfully' });
      } else {
        resolve({ success: false, message: 'Invalid OTP' });
      }
    }, 1000);
  });
}; 