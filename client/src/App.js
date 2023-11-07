import "./App.css";
import Forgotpassword from "./components/Forgotpassword";
import Home from "./components/Home"
import Loginpage from "./components/Loginpage";
import Signuppage from "./components/Signuppage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/signup" element={<Signuppage/>} />
        <Route exact path="/forgotpassword" element={<Forgotpassword />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/" element={<Loginpage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
