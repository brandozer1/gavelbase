import logo from './logo.svg';
import './App.css';
import "primereact/resources/themes/tailwind-light/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
// react router dom
import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom';
import Dashboardpage from './Pages/Dashboardpage/Dashboardpage';
import Auctionpage from './Pages/Auctionpage/Auctionpage';
import Lotpage from './Pages/Lotpage/Lotpage';
import Loginpage from './Pages/Loginpage/Loginpage';
import Landingpage from './Pages/Landingpage/Landingpage';
import Createauctionpage from './Pages/Createauctionpage/Createauctionpage';
import Createlotpage from './Pages/Createlotpage/Createlotpage';
import Nav from './Components/Nav/Nav';

import Fasttrackpage from './Pages/Fasttrackpage/Fasttrackpage';
import Aucitionassemblypage from './Pages/Auctionassemblypage/Aucitionassemblypage';

function App() {
  return (
    <div className='flex w-screen'>
      <Router >
        
        <Routes>
            <Route path='/Createlot' element={<><Nav /><Createlotpage/></>} />
            <Route path='/Createauction' element={<><Nav /><Createauctionpage/></>} />
            <Route path='/Fasttrack' element={<Fasttrackpage/>} />
            <Route path='/Auctionassembly' element={<Aucitionassemblypage/>} />
            <Route path='/Login' element={<Loginpage/>} />
            <Route path='/Lots' element={<><Nav /><Lotpage/></>} />
            <Route path='/Auctions' element={<><Nav /><Auctionpage/></>} />
            <Route path='/Dashboard' element={<><Nav /><Dashboardpage/></>} />
            <Route path='/' element={<Landingpage/>} />
        </Routes>

      </Router>
      
    </div>
  );
}

export default App;
