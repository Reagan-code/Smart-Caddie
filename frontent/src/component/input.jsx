import React, { useState } from 'react';
import axios from 'axios';
import './styles/input.css'

function BookInput() {
    const [book, bookNow] = useState('');

    const handleSubmit = () => {
        axios.post('your-api-url-here', { name: book })
            .then(result => console.log(result.data))
            .catch(err => console.log(err));
    };

    return (
        <div>
            <h1 className='bookHeader'>Book Now</h1>
            <input
                className='input-book'
                type="text"
                placeholder="Enter your name"
                value={book}
                onChange={(e) => bookNow(e.target.value)}
            />
            <button className='btn-book' onClick={handleSubmit}>Book</button>
        </div>
    );
}

export default BookInput;