import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
import Profile from './Home/Profile/Profile';
import PickupSchedule from './Home/PickupSchedule/PickupSchedule';
import Schedules from './Home/Profile/Schedules/Schedules';
import History from './Home/Profile/History/History';
import Rewards from './Home/Profile/Rewards/Rewards';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/pickup-schedule" element={<PickupSchedule />} />
      <Route path="/schedules" element={<Schedules />} />
      <Route path="/history" element={<History />} />
      <Route path="/rewards" element={<Rewards />} />
    </Routes>
  </Router>
);

export default App;
