import React from 'react';
import { auth } from "./firebase";
import { Link } from 'react-router-dom';
import "../pagescss/admin.css"
function Admin() {
  async function caddieLogout() {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:");
    }
  }

  return (
    <>
      <div className="nav">
        <ul>
          <li><Link to="#">View Bookings</Link></li>
          <li><Link to="#">View Complete</Link></li>
          <li><Link to="#">Booking</Link></li>
          <li><Link to="#">Profile</Link></li>
        </ul>
        <button className="sign-out-btn" onClick={caddieLogout}>Sign Out</button>
      </div>
      <div className="caddie-admin-header">
        <h1 className='caddie-admin-welcome'>Welcome, Admin</h1>
        <p className='caddie-admin-info'>Manage users, bookings, and caddie operations from one place.</p>
      


      <div className="caddie-dashboard">
        <div className="caddie-booking">
          <h2 className='booking-detail'>Booking   :</h2>
          <p className='booking-num'>17</p>
        </div>
        <div className="caddie-booking">
          <h2 className='booking-detail'>Pending :</h2>
          <p className='booking-num'>5</p>
        </div>
         <div className="caddie-booking">
          <h2 className='booking-detail'>Completed :</h2>
          <p className='booking-num'>5</p>
        </div>
      </div>
      </div>


      <footer className="footer">
        <div className="footer-info">
          <span>2025 SmartCaddie Admin Panel — All Rights Reserved</span>
        </div>
      </footer>
    </>
  );
}

export default Admin;
