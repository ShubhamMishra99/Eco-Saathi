## ♻️ Eco Saathi

**Eco Saathi** is a full-stack waste management platform designed to help users efficiently manage and track waste disposal activities. The platform promotes eco-friendly practices by streamlining organized waste collection, enhancing user engagement, and offering actionable insights into sustainable living habits.

---

## 🌐 Features

- 🗑️ **Waste Tracking**: Monitor household and commercial waste generation and disposal.  
- 📅 **Pickup Scheduling**: Book, manage, and view waste collection appointments.  
- 📊 **Analytics Dashboard**: Visualize waste trends and statistics for better decision-making.  
- 👥 **Authentication System**: Secure login/signup with role-based access for Admins and Users.  
- 🔄 **Real-Time Updates**: Receive timely notifications on waste collection and recycling progress.

---

## 🏗️ Tech Stack

### 🖥️ Frontend
- React.js (Vite)  
- CSS  
- Axios  

### ⚙️ Backend
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  

### 🧰 Tools & Services
- Postman (API testing)  
- Render (Backend Deployment)  
- Vercel (Frontend Deployment)  

---

## 🚀 Installation & Setup

Follow the steps below to set up the project locally:

 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ecosaathi.git
cd ecosaathi
```
2️. Setup the Frontend
```bash
cd client
npm install
npm run dev
```
🌐 Frontend runs at: http://localhost:5173

3️. Setup the Backend
Open a new terminal window and run:

```bash
cd server
npm install
node server.js
```
🛠️ Backend runs at: http://localhost:5001

📌 Ensure MongoDB is running locally or provide a remote MongoDB URI in your .env file.

📁 Project Structure
```bash
EcoSaathi/
│
├── client/           # Frontend (React)
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── server/           # Backend (Node.js + Express)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── .env
│
│
├── README.md
└── .gitignore
```

🌍 Deployment
🔗 Frontend (Vercel): Vercel Live Link

🔗 Backend (Render): Render Live API Link

🤝 Contributing
We welcome contributions to improve the platform!

🛠️ Steps to Contribute:

1.Fork the repository

2.Create a new branch
```bash
git checkout -b feature/YourFeature
```
3.Make your changes and commit
```bash
git commit -m "Add YourFeature"
```
4.Push to your branch
```bash
git push origin feature/YourFeature
```
5.Open a Pull Request from GitHub

## 💚 Built with purpose to make waste management simpler, smarter, and greener.
