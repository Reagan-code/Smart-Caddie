import React, { useEffect } from 'react';
import { useState } from 'react';
import '../pagescss/search.css'
import axios from 'axios';
import BookInput from '../component/input';

function Book() {
  const [caddie, bookCaddie] = useState([]);
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts') 
    .then(result => bookCaddie(result.data))
    .catch(err => console.log(err))
}, []);

  return (
    <div>
        <h1>Hello</h1>
        <BookInput />
        {
            caddie.length === 0 ? (
                <h1 className='no-caddie'>No Caddie Available</h1>
            ) :
            caddie.map((caddie) => {
                return (
                    <div>
                        {caddie.book}
                    </div>
                )
            })
        }
    </div>
  ) 
}
export default Book;