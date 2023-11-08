import "./App.css";
import Forgotpassword from "./components/Forgotpassword";
import Home from "./components/Home";
import Loginpage from "./components/Loginpage";
import Signuppage from "./components/Signuppage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element, path }) => {
  const user = localStorage.getItem("user");
  return user ? element : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/signup" element={<Signuppage />} />
        <Route exact path="/forgotpassword" element={<Forgotpassword />} />
        <Route
          exact
          path="/home"
          element={<PrivateRoute element={<Home />} />}
        />
        <Route
          exact
          path="/"
          element={<Loginpage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
