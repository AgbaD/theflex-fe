"use client";

import React, { useEffect, useState } from "react";
import "@/css/dashboard.scss";
import Image from "next/image";
import TheFlexLogo from "@/images/logo.svg";
import { MdHome, MdLogout, MdSpaceDashboard, MdWeb } from "react-icons/md";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import { FaArrowUp } from "react-icons/fa";
import { LiaStarSolid } from "react-icons/lia";
import { getDashboard, updateReviewStatus } from "@/lib/apiHelper";
import { useRouter } from "next/navigation";
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

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [name, setName] = useState("User");
  const [stats, setStats] = useState({ totalListings: 0, avgRating: 0, reviewsThisMonth: 0 });
  const router = useRouter();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        const dashRes = await getDashboard(token);
        if (dashRes.success) {
          const totals = dashRes.data?.totals || {};
          const reviews = dashRes.data?.recent || [];
          setStats({
            totalListings: totals.uniqueListings ?? 0,
            avgRating: totals.averageRatingAll ?? 0,
            reviewsThisMonth: totals.reviewsThisMonth ?? 0,
          });

          const mapped: ReviewRow[] = (reviews).map(
            (r: ReviewRow) => ({
              ...r,
            })
          );
          setRows(mapped);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    })();
  }, [router]);

  const handleLogout = () => {
    logout('/login');
  };

  const publishReview = async (id: number) => {
    const auth = localStorage.getItem("auth");
    if (!auth) return;

    const { token } = JSON.parse(auth);

    try {
      const res = await updateReviewStatus(id, "PUBLISHED", token);
      if (res.success) {
        setRows((r) => r.map((x) => (x.id === id ? { ...x, status: "PUBLISHED" } : x)));
      } else {
        alert(res.message || "Failed to publish review");
      }
    } catch (err) {
      console.error("Error publishing review:", err);
      alert("Something went wrong while publishing review");
    }
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
          <a className="nav-item active" href="/dashboard">
            <span className="icon"><MdSpaceDashboard size={18} /></span>
            <span className="label">Dashboard</span>
          </a>
          <a className="nav-item" href="/hostaway">
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

      <main className="content">
        <header className="topbar">
          <div className="greet">
            <h1>Hello, {name}</h1>
            <p>Here’s your property review summary this week.</p>
          </div>
          <div className="actions">
            <div className="month">
              <span>{formattedDate}</span>
            </div>
          </div>
        </header>

        <section className="stats">
          <div className="stat-card">
            <h3>Total Listings</h3>
            <div className="value-row">
              <span className="value">{stats.totalListings}</span>
              {/* <span className="chip positive"><FaArrowUp />0.2%</span> */}
            </div>
            <p className="sub">improved <span>+0.2%</span> this month</p>
          </div>

          <div className="stat-card">
            <h3>Average Rating</h3>
            <div className="value-row">
              <span className="value">{stats.avgRating.toFixed(1)}</span>
              <LiaStarSolid className="star" />
              {/* <span className="chip positive"><FaArrowUp />0.4%</span> */}
            </div>
            <p className="sub">improved <span>+0.4%</span> this month</p>
          </div>

          <div className="stat-card">
            <h3>Reviews this month</h3>
            <div className="value-row">
              <span className="value">{stats.reviewsThisMonth}</span>
              {/* <span className="chip positive"><FaArrowUp />12%</span> */}
            </div>
            <p className="sub"><span>+45</span> New reviews this month</p>
          </div>
        </section>

        <section className="grid">
          <div className="card reviews">
            <div className="card-head">
              <h3>Review management</h3>
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
                  {rows.map((r) => (
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
                          <button
                            className="publish-btn"
                            onClick={() => publishReview(r.id)}
                          >
                            Publish
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-foot">
              <a href="#">View All</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
