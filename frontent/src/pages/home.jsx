import React from 'react';
import { auth} from "./firebase";
import { Link } from 'react-router-dom';



import '../pagescss/home.css'
function Home() {
 
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
    <ul className='nav-ul'>
     <li className='nav-li'>
  <Link to="/">Home</Link>
</li>
<li  className='nav-li'>
  <Link to="/search">Search</Link>
</li >
<li  className='nav-li'>
  <Link to="/book">Booking</Link>
</li>

    </ul>
    <button className="sign-out-btn" onClick={caddieLogout}> SignOut</button>
  </div>
  <div className="welcome">
    <h1> Welcome to Smart Caddie</h1>
    <p>
      No more confusion , You can now search for caddies amd book them instally
    </p>
    <div className="cards">
      <div className="fast">
        <h2>Fast</h2>
        <p1>Book a caddie in one click</p1>
      </div>
      <div className="fast">
        <h2>Fast</h2>
        <p1>Book a caddie in one click</p1>
      </div>
      <div className="fast">
        <h2>Fast</h2>
        <p1>Book a caddie in one click</p1>
      </div>
    </div>
    <button className='search-caddie-btn'> Search Caddie</button>
  </div>

        <div className="adding-caddie-account">
          <div className="text">     
            <p>Are you a  caddie who is looking for a job</p>
          </div>
          <div className="img-cointainer">
            <div className='caddie-advantages'>
                <h1 className='img-details'> Fast</h1>
                <img src="https://static01.nyt.com/images/2020/05/16/sports/14golf-caddies1-print/merlin_141478350_e069e836-3995-4a6e-8faa-267c049837dd-superJumbo.jpg?quality=75&auto=webp" className='img-caddie'/>
            </div>
              <div className='caddie-advantages'>
              <h1 className='img-details'> Affordable</h1>
                <img src="https://e9t4oddrrr4.exactdn.com/wp-content/uploads/2022/11/1400x788px-5-1.jpg?strip=all&lossy=0&ssl=1" className='img-caddie'/>
            </div>
              <div className='caddie-advantages'>
               <h1 className='img-details'> Free</h1>
                <img src="https://www.thecaddienetwork.com/wp-content/uploads/2018/07/USATSI_10912277-e1530550848428.jpg" className='img-caddie' />
            </div>
           </div>
            <button className='btn-img-caddie'>Add Now</button>
          </div>
             <h1 className='Notification-head'> Get Instant nonfication Now </h1>
        <div className="booking">
            <div className="booking-details">
             <h1>Notification</h1>
             <h2>You can now connect anywhere in the Global and find caddie in Kenya </h2>
            </div>
             <div className="booking-details">
           <h1>Connect</h1>
           <h2>The Smart Caddie app sends timely notifications to remind golfers of tee times, ensuring they stay on schedule during busy rounds.</h2>
            </div>
             <div className="booking-details-one">
                           <h1>Everywhere</h1>
                           <h2>The Smart Caddie app delivers real-time notifications to golfers, providing personalized club recommendations based on course conditions and player performance.</h2>
            </div>
        </div>
            <button className='btn-notification'>View Now</button>
            <footer className="footer">
  <div className="footer-info">
  
    <span> 2025 SmartCaddie All Rights Reserved </span>
  </div>
</footer>

        
    </>
  )
}

export default Home;