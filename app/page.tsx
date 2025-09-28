"use client";

import React from "react";
import "@/css/home.scss";
import ReviewsCarousel from "@/components/ReviewCarousel";
import Image from "next/image";
import TheFlexLogo from "@/images/logo.svg";

export default function Home() {
  return (
    <div className="landing">
      <nav className="navbar">
        <div className="logo">
          <Image src={TheFlexLogo} alt="The Flex" width={120} height={28} />
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#reviews">Reviews</a>
          <a href="/login">Login</a>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-content">
          <h1>
            Book <br /> Beautiful Stays
          </h1>
          <p>Your perfect getaway is just a few clicks away.</p>
        </div>
      </section>

      <section id="reviews" className="reviews">
        <h2>What Our Guests Are Saying</h2>
        <p className="subtitle">Real feedback from guests who’ve stayed with us</p>
        <ReviewsCarousel />
      </section>
    </div>
  );
}
