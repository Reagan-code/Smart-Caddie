


import React from 'react';
import { useState } from 'react';
import '../pagescss/search.css'

function Search() {
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const caddie = [
    {
      id: 1,
      firstName: "Reagan",
      lastName: "ochieng",
      email: "regan.oo-is.nairobi@stillirisengo.org",
      phone: "07104157343"
    },
    {
      id: 2, 
      firstName: "Mickey",
      lastName: "Omondi",
      email: "mickey@gmail.com",
      phone: "098765436543"
    },
    {
      id: 3, 
      firstName: "Sebastian",
      lastName: "Yongo",
      email: "seabstian@gmail.com",
      phone: "1234567890"
    },
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredCaddie = caddie.filter((caddieRecord) => {
    const searchTerm = search.toLowerCase();
    if (searchTerm === '') {
      return true;
    }else
    return (
      caddieRecord.firstName.toLowerCase().includes(searchTerm) ||
      caddieRecord.lastName.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className='cointain-caddie'>
      <div className='input-caddie'>
           <input  
           className='caddie-search'
        type='text'
        placeholder='search'
        value={search} 
        onChange={handleSearch}
      />
      </div>
        {filteredCaddie.map((caddieRecord) => (
        <div key={caddieRecord.id} className='caddie-record'> 
        <img src='https://static.vecteezy.com/system/resources/thumbnails/053/406/424/small/person-gray-photo-placeholder-man-on-gray-background-avatar-man-icon-anonymous-user-male-no-photo-web-template-default-user-picture-for-social-networks-social-media-resume-forums-free-vector.jpg'></img>
          <div className='caddie-firstName'>
              <strong>Name </strong>
            {caddieRecord.firstName} 
          </div>
            <div className='caddie-email'>
              <strong>Email </strong>
          {caddieRecord.email} 
          </div> 
          <div  className='caddie-phone'>
                            <strong>Phone </strong>
          {caddieRecord.phone}
          </div>
               <button className='btn-search'>Book Now</button>
          </div>
        ))}
    </div>
  );
}

export default Search;


