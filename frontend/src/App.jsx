import React from "react";
import Navbar from '../src/Components/Top-Header-Section/navbar/navbar'
import Logo from '../src/Components/Top-Header-Section/Logo/logo'
import Signup from '../src/Components/Top-Header-Section/Signup/signup'
import Hero from '../src/Components/Hero-Section/Hero'
import Footer from '../src/Components/Footer/footer'

export default function App() {
  return (
  <div>
    <Signup/>
    <Navbar/>
    <Logo/>
    <Hero/>
    <Footer/>
  </div>
  )
}