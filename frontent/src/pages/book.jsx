import { useState, useEffect } from 'react'

function App() {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [bookings, setBookings] = useState([])


  useEffect(() => {
    const savedBookings = localStorage.getItem('bookings')
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings))
    }
  }, [])

 
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings))
  }, [bookings])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !date || !time) return

    const newBooking = {
      id: Date.now(),
      name,
      date,
      time
    }

    setBookings([...bookings, newBooking])
    setName('')
    setDate('')
    setTime('')
  }

  const clearBookings = () => {
    setBookings([])
    localStorage.removeItem('bookings')
  }

  return (
    <div>
      <h1>Booking App</h1>
      
      <form onSubmit={handleSubmit} className="booking-form">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button type="submit">Book Now</button>
      </form>

      <div className="booking-list">
        <h2>Your Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          <>
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-item">
                <p><strong>Name:</strong> {booking.name}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time:</strong> {booking.time}</p>
              </div>
            ))}
            <button onClick={clearBookings} style={{ backgroundColor: '#f44336' }}>
              Clear All Bookings
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default App
