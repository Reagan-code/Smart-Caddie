import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import BookInput from '../component/input';
import '../pagescss/book.css';

function Book() {
  const [caddie, bookCaddie] = useState([]);
  useEffect(() => {
    axios.get('') 
    .then(result => bookCaddie(result.data))
    .catch(err => console.log(err))
}, []);

  return (
    <div className='book-cointainer'>
        <h1>Hello</h1>
        <BookInput />
        {
            caddie.length === 0 ? (
                <h1 className='no-caddie'>No Caddie Available</h1>
            ) :
            caddie.map((caddie) => {
                return (
                    <div className='book-results'>
                        {caddie.book}
                    </div>
                )
            })
        }
    </div>
  ) 
}
export default Book;