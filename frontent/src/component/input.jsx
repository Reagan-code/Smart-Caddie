import React, { useState } from 'react';
import axios from 'axios';

function BookInput() {
    const [book, bookNow] = useState('');

    const handleSubmit = () => {
        axios.post('your-api-url-here', { name: book })
            .then(result => console.log(result.data))
            .catch(err => console.log(err));
    };

    return (
        <div>
            <h1>Book Now</h1>
            <input
                type="text"
                placeholder="Enter your name"
                value={book}
                onChange={(e) => bookNow(e.target.value)}
            />
            <button onClick={handleSubmit}>Book</button>
        </div>
    );
}

export default BookInput;