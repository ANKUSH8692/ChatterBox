import { BrowserRouter,Routes,Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from './pages/Home'
import Login from './pages/login'
import Signup from './pages/signup'
import ProtectedRoute from "./components/protected_Router.js";
import Loader from "./components/loader.js";
import Profile from "./pages/profile/index.js";
import { useSelector } from "react-redux";

function App() {
  const {loader} =useSelector(state=>state.loaderReducer);
  return (
    
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      {loader && <Loader/>}
      <BrowserRouter>
        <Routes>
          
          {/* Protected Route Example */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
            }
            ></Route>
            <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            }
            ></Route>
          
          <Route path="/login" element= {<Login /> }></Route>
          <Route path="/signup" element= {<Signup/> }></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
