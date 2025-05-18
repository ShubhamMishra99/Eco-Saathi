import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import PickupSchedule from './Home/PickupSchedule/PickupSchedule'; // Adjust path if different

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pickup-schedule" element={<PickupSchedule />} />
      </Routes>
    </Router>
  );
}

export default App;
