import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Rating,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Person,
  Star,
  Email,
  Male,
  Female,
  FilterList,
  BookOnline
} from '@mui/icons-material';
import '../pagescss/search.css';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { db } from "./firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, addDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function Search({ setSelectCaddie }) { 
  const [search, setSearch] = useState('');
  const [rate, setRate] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredCaddies, setFilteredCaddies] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();  

  const caddieList = [
    { id: 1, firstName: 'Reagan', lastName: 'Ochieng', email: 'martin@gmail.com', gender: 'Male', age: 25, available: true, rating: null, experience: '5 years', specialties: ['Golf Course Management', 'Club Selection'], hourlyRate: 25 },
    { id: 2, firstName: 'Mickey', lastName: 'Omondi', email: 'mickey@gmail.com', gender: 'Male', age: 30, available: true, rating: null, experience: '8 years', specialties: ['Tournament Support', 'Course Strategy'], hourlyRate: 35 },
    { id: 3, firstName: 'Sebastian', lastName: 'Yongo', email: 'seabstian@gmail.com', gender: 'Male', age: 28, available: true, rating: null, experience: '6 years', specialties: ['Beginner Friendly', 'Equipment Care'], hourlyRate: 30 },
    { id: 4, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@gmail.com', gender: 'Female', age: 27, available: true, rating: null, experience: '4 years', specialties: ['Ladies Golf', 'Swing Analysis'], hourlyRate: 28 },
    { id: 5, firstName: 'David', lastName: 'Wilson', email: 'david@gmail.com', gender: 'Male', age: 35, available: false, rating: null, experience: '10 years', specialties: ['Professional Tours', 'Advanced Strategy'], hourlyRate: 45 }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.uid); 
      } else {
        setUser(null);  
      }
      setLoading(false);
    });
    return () => unsubscribe();  
  }, []);


  const filterCaddies = (caddieData, ratings) => {
    return caddieData.filter(caddie => {
      const matchesSearch = search === '' || 
        caddie.firstName.toLowerCase().includes(search.toLowerCase()) ||
        caddie.lastName.toLowerCase().includes(search.toLowerCase()) ||
        caddie.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesGender = genderFilter === '' || caddie.gender === genderFilter;
      const matchesAvailability = availabilityFilter === '' || 
        (availabilityFilter === 'available' && caddie.available) ||
        (availabilityFilter === 'unavailable' && !caddie.available);
      
      return matchesSearch && matchesGender && matchesAvailability;
    }).map(caddie => {
      
      const caddieRatings = ratings.filter(rating => rating.caddieEmail === caddie.email);
      if (caddieRatings.length > 0) {
        const avgRating = caddieRatings.reduce((sum, rating) => sum + Number(rating.rating), 0) / caddieRatings.length;
        return { 
          ...caddie, 
          rating: parseFloat(avgRating.toFixed(1)), 
          reviewCount: caddieRatings.length,
          hasRatings: true
        };
      }
      return { ...caddie, rating: null, reviewCount: 0, hasRatings: false };
    });
  };

  useEffect(() => {
    if (!user) {
      setFilteredCaddies(filterCaddies(caddieList, []));
      return;
    }

    const q = query(collection(db, "ratings"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ratings = [];
      snapshot.forEach((doc) => {
        ratings.push({ id: doc.id, ...doc.data() });
      });
      setRate(ratings);
      
      // Apply filtering with ratings
      setFilteredCaddies(filterCaddies(caddieList, ratings));
    });

    return () => unsubscribe();
  }, [user, search, genderFilter, availabilityFilter]);

  // Handle case when user is not logged in
  useEffect(() => {
    if (!user) {
      setFilteredCaddies(filterCaddies(caddieList, []));
    }
  }, [search, genderFilter, availabilityFilter]);

  const getCaddieRating = (caddieEmail) => {
    console.log("Getting rating for caddie:", caddieEmail);
    console.log("Available ratings:", rate);
    
    const caddieRatings = rate.filter(rating => {
      console.log("Checking rating:", rating, "against email:", caddieEmail);
      return rating.caddieEmail === caddieEmail;
    });
    
    console.log("Found ratings for", caddieEmail, ":", caddieRatings);
    
    if (caddieRatings.length === 0) return null;
    
    const totalRating = caddieRatings.reduce((sum, rating) => sum + Number(rating.rating), 0);
    const avgRating = (totalRating / caddieRatings.length).toFixed(1);
    
    console.log("Calculated average rating:", avgRating);
    return avgRating;
  };

  const handleBook = (caddie) => {
    if (!user) {
      setSnackbar({ open: true, message: 'Please login to book a caddie', severity: 'warning' });
      return;
    }
    if (!caddie.available) {
      setSnackbar({ open: true, message: 'This caddie is currently unavailable', severity: 'error' });
      return;
    }
    setSelectCaddie(caddie);
    setSnackbar({ open: true, message: `Selected ${caddie.firstName} ${caddie.lastName}`, severity: 'success' });
    navigate('/book');
  };

  const clearFilters = () => {
    setSearch('');
    setGenderFilter('');
    setAvailabilityFilter('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <NavBar />
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
        <Typography 
          variant="h4"
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: '#2e7d32',
            textAlign: { xs: 'center', sm: 'left' },
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          Find Your Perfect Caddie
        </Typography>
        
        {/* Search and Filter Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
              <Grid item xs={12} lg={4}>
                <TextField
                  fullWidth
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={4} lg={2}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={genderFilter}
                    label="Gender"
                    onChange={(e) => setGenderFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={4} lg={2}>
                <FormControl fullWidth>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={availabilityFilter}
                    label="Availability"
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="unavailable">Unavailable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} lg={2}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={clearFilters}
                  fullWidth
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  Clear Filters
                </Button>
              </Grid>
              <Grid item xs={12} lg={2}>
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  align="center"
                  sx={{ 
                    p: { xs: 1, sm: 0 },
                    bgcolor: { xs: '#f0f0f0', sm: 'transparent' },
                    borderRadius: { xs: 1, sm: 0 }
                  }}
                >
                  {filteredCaddies.length} caddie(s) found
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Caddies Grid */}
        {filteredCaddies.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" color="textSecondary">
                No caddies found matching your criteria.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {filteredCaddies.map((caddie) => {
              return (
                <Grid item xs={12} sm={6} lg={4} key={caddie.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      },
                      opacity: caddie.available ? 1 : 0.7
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Header with Avatar and Status */}
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar 
                          sx={{ 
                            width: { xs: 50, sm: 60 }, 
                            height: { xs: 50, sm: 60 }, 
                            mr: 2,
                            bgcolor: caddie.gender === 'Male' ? '#1976d2' : '#9c27b0',
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                          }}
                        >
                          {caddie.firstName[0]}{caddie.lastName[0]}
                        </Avatar>
                        <Box flexGrow={1}>
                          <Typography 
                            variant="h6"
                            sx={{ 
                              fontWeight: 'bold',
                              fontSize: { xs: '1rem', sm: '1.25rem' }
                            }}
                          >
                            {caddie.firstName} {caddie.lastName}
                          </Typography>
                          <Box 
                            display="flex" 
                            alignItems="center" 
                            gap={0.5}
                            flexWrap="wrap"
                            mt={0.5}
                          >
                            <Chip 
                              label={caddie.available ? 'Available' : 'Unavailable'}
                              color={caddie.available ? 'success' : 'error'}
                              size="small"
                              sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' } }}
                            />
                            <Chip 
                              label={caddie.gender}
                              icon={caddie.gender === 'Male' ? <Male /> : <Female />}
                              variant="outlined"
                              size="small"
                              sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' } }}
                            />
                          </Box>
                        </Box>
                      </Box>

                      {/* Details */}
                      <Box sx={{ mb: 2 }}>
                        <Box display="flex" alignItems="flex-start" mb={1}>
                          <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary', mt: 0.2 }} />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              wordBreak: 'break-word',
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            {caddie.email}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1} flexWrap="wrap">
                          <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                          >
                            Age: {caddie.age}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              ml: { xs: 0, sm: 1 },
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              '&::before': { content: { xs: 'none', sm: '" • "' } }
                            }}
                          >
                            Experience: {caddie.experience}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 1,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          <strong>Rate:</strong> ${caddie.hourlyRate}/hour
                        </Typography>
                      </Box>

                      {/* Rating */}
                      {caddie.hasRatings && caddie.rating ? (
                        <Box display="flex" alignItems="center" mb={2}>
                          <Rating value={caddie.rating} readOnly size="small" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {caddie.rating}/5 ({caddie.reviewCount} reviews)
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          No ratings yet
                        </Typography>
                      )}

                      {/* Specialties */}
                      <Box sx={{ mb: 2 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            mb: 1,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          Specialties:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                          {caddie.specialties.map((specialty, index) => (
                            <Chip 
                              key={index}
                              label={specialty}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                height: { xs: 24, sm: 28 }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                    
                    {/* Action Button */}
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant={caddie.available ? "contained" : "outlined"}
                        color={caddie.available ? "primary" : "inherit"}
                        fullWidth
                        startIcon={<BookOnline />}
                        onClick={() => handleBook(caddie)}
                        disabled={!caddie.available}
                        sx={{
                          py: { xs: 1, sm: 1.5 },
                          fontWeight: 'bold',
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          ...(caddie.available && {
                            background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #1b5e20 30%, #388e3c 90%)',
                            }
                          })
                        }}
                      >
                        {caddie.available ? 'Book Now' : 'Unavailable'}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Search;
