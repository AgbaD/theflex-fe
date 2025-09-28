"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "@/css/reviews.scss";
import Image from "next/image";
import Avatar from "@/images/avatar.svg";
import { fetchPublishedReviews } from "@/lib/apiHelper";

type Review = {
  id: number;
  guestName: string;
  listingName: string;
  publicReview: string;
  rating: number;
  status: "PUBLISHED" | "UNPUBLISHED";
  image?: string;
};

const ReviewsCarousel = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [index, setIndex] = useState(0);
    const [tableText, setTableText] = useState("Loading reviews...");

  const next = () => setIndex((prev) => (prev + 1) % reviews.length);
  const prev = () => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchPublishedReviews();
        if (res.success) {
          setReviews(res.data || []);
          setTableText("No published reviews found");
        }
      } catch (err) {
        setTableText("Error fetching reviews");
        console.error("Error fetching reviews:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [reviews, next]);

  if (reviews.length === 0) {
    return <p className="loading">{tableText}</p>;
  }

  return (
    <div className="carousel">
      <div className="carousel-container">
        <button onClick={prev} className="nav-btn left">
          <FiChevronLeft size={24} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={reviews[index].id}
            className="review-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={reviews[index].image || Avatar}
              alt={reviews[index].guestName}
              width={60}
              height={60}
              className="avatar"
            />
            <div className="stars">
              {"★".repeat(Math.round(reviews[index].rating))}
              {"☆".repeat(10 - Math.round(reviews[index].rating))}
            </div>
            <p className="text">&quot;{reviews[index].publicReview}&quot;</p>
            <h4>- {reviews[index].guestName}</h4>
          </motion.div>
        </AnimatePresence>

        <button onClick={next} className="nav-btn right">
          <FiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default ReviewsCarousel;
