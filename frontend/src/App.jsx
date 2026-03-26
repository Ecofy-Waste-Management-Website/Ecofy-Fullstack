import React, { useEffect, useState } from "react";
import Navbar from '../src/Components/Top-Header-Section/navbar/navbar'
import Footer from '../src/Components/Footer/footer'
import Hero from '../src/Components/Hero-Section/Hero'



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
    <Navbar/>
    <Hero/>
    <Footer/>
  </div>
  )
}