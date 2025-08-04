import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import '../pagescss/search.css';

function Search() {
  const [search, setSearch] = useState('');

  const caddie = [
    {
      id: 1,
      firstName: 'Reagan',
      lastName: 'Ochieng',
      email: 'regan.oo-is.nairobi@stillirisengo.org',
      gender: 'Male',
      age: 25,
      available: true,
    },
    {
      id: 2,
      firstName: 'Mickey',
      lastName: 'Omondi',
      email: 'mickey@gmail.com',
      gnder: 'Male',
      age: 30,
      available: false,
    },
    {
      id: 3,
      firstName: 'Sebastian',
      lastName: 'Yongo',
      email: 'seabstian@gmail.com',
      gender: 'Male',
      age: 28,
      available: true,
    },
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredCaddie = caddie.filter((caddieRecord) => {
    const searchTerm = search.toLowerCase();
    return (
      caddieRecord.firstName.toLowerCase().includes(searchTerm) ||
      caddieRecord.lastName.toLowerCase().includes(searchTerm) ||
      caddieRecord.gender.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="cointain-caddie">
      <div className="input-caddie">
        <input
          className="caddie-search"
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Caddie Table">
          <TableHead className='table-head'>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCaddie.map((caddieRecord) => (
              <TableRow key={caddieRecord.id}>
                <TableCell>
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/053/406/424/small/person-gray-photo-placeholder-man-on-gray-background-avatar-man-icon-anonymous-user-male-no-photo-web-template-default-user-picture-for-social-networks-social-media-resume-forums-free-vector.jpg"
                    alt="avatar"
                    style={{ width: 40, height: 40, borderRadius: '50%' }}
                  />
                </TableCell>
                <TableCell>
                  {caddieRecord.firstName} {caddieRecord.lastName}
                </TableCell>
                <TableCell>{caddieRecord.email}</TableCell>
                <TableCell>{caddieRecord.age}</TableCell>
                <TableCell>{caddieRecord.available ? 'Yes' : 'No'}</TableCell>
                <TableCell>{caddieRecord.gender}</TableCell>
                <TableCell>
                  <button className="btn-book">Book Now</button>
                </TableCell>
                  <TableCell>
                  <button className="btn-rate">Rate Now</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Search;
