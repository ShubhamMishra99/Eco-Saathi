// utils/otpUtils.js

export const sendDemoOTP = async (type, contact) => {
  try {
    const res = await fetch('http://localhost:5001/api/riders/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, contact }),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};

export const verifyDemoOTP = async (type, contact, otp) => {
  try {
    const res = await fetch('http://localhost:5001/api/riders/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, contact, otp }),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};
