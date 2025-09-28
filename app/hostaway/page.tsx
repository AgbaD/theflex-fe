"use client";

import React, { useEffect, useState } from "react";
import "@/css/dashboard.scss";
import Image from "next/image";
import TheFlexLogo from "@/images/logo.svg";
import { MdHome, MdLogout, MdSpaceDashboard, MdWeb } from "react-icons/md";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { fetchHostawayReviews } from "@/lib/apiHelper";
import { LiaStarSolid } from "react-icons/lia";
import { logout } from "@/lib/auth";
import Link from "next/link";

type ReviewRow = {
  id: number;
  guestName: string;
  listingName: string;
  publicReview: string;
  rating: number;
  status: "PUBLISHED" | "UNPUBLISHED";
};

const Hostaway = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [name, setName] = useState("User");
  const [tableText, setTableText] = useState("Loading reviews...");
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      router.push("/login");
      return;
    }

    const { token, user } = JSON.parse(auth);
    if (user?.firstname) setName(user.firstname);

    (async () => {
      try {
        const res = await fetchHostawayReviews(token);
        if (res.success) {
          setRows(res.data || []);
        }
        if (rows.length === 0) {
          setTableText("No reviews found");
        }
      } catch (err) {
        setTableText("No reviews found");
        console.error("Hostaway fetch error:", err);
      }
    })();
  }, [router, rows.length]);

  const handleLogout = () => {
    logout('/login');
  };

  return (
    <div className={`dash ${collapsed ? "is-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar__top">
          <div className="sidebar__logo">
            <Image src={TheFlexLogo} alt="The Flex" width={120} height={28} />
          </div>
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="sidebar__toggle"
            onClick={() => setCollapsed((s) => !s)}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <nav className="sidebar__nav">
          <a className="nav-item" href="/dashboard">
            <span className="icon"><MdSpaceDashboard size={18} /></span>
            <span className="label">Dashboard</span>
          </a>
          <a className="nav-item active" href="/hostaway">
            <span className="icon"><MdWeb size={18} /></span>
            <span className="label">Hostaway</span>
          </a>
          <Link className="nav-item" href="/">
            <span className="icon"><MdHome size={18} /></span>
            <span className="label">Home</span>
          </Link>
          <a
            className="nav-item nav-item--logout"
            href="#"
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
          >
            <span className="icon"><MdLogout size={18} /></span>
            <span className="label">Logout</span>
          </a>
        </nav>
      </aside>

      <main className="content hostaway-content">
        <header className="topbar">
          <div className="greet">
            <h1>Hello, {name}</h1>
            <p>Here are your reviews from Hostaway.</p>
          </div>
        </header>

        <section className="grid full-table">
          <div className="card reviews">
            <div className="card-head">
              <h3>Hostaway Reviews</h3>
            </div>
            <div className="table">
              <table>
                <thead>
                  <tr>
                    <th>Guest Name</th>
                    <th>Property</th>
                    <th>Rating</th>
                    <th>Review Snippet</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length > 0 ? (
                    rows.map((r) => (
                      <tr key={r.id}>
                          <td>{r.guestName}</td>
                          <td>{r.listingName}</td>
                          <td>
                            { r.rating ? (
                              <div className="rating">
                                <span>{r.rating.toFixed(1)}</span>
                                <LiaStarSolid />
                              </div>
                            ) : "N/A" }
                          </td>
                          <td className="snippet">{r.publicReview}</td>
                          <td>
                            {r.status === "PUBLISHED" ? (
                              <span className="status published">Published</span>
                            ) : (
                              <span className="status unpublished">Unpublished</span>
                            )}
                          </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                        {tableText}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Hostaway;
