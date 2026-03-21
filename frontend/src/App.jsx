import React, { useEffect, useState } from "react";
import Navbar from '../src/Components/Top-Header-Section/navbar/navbar'
import Logo from '../src/Components/Top-Header-Section/Logo/logo'
import Signup from '../src/Components/Top-Header-Section/Signup/signup'
import Footer from '../src/Components/Footer/footer'




export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
  <div>
    <Signup/>
    <Navbar/>
    <Logo/>
    <Footer/>
  </div>
  )
}