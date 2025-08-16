import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import NavBar from "./NavBar";
import { auth } from "./firebase";  
import { onAuthStateChanged } from "firebase/auth";
import "../pagescss/home.css";
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid, 
  Box, 
  Chip, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Star,
  AccessTime,
  Person,
  Email,
  CalendarToday,
  Delete,
  RateReview
} from '@mui/icons-material';

const Home = () => {
  const [book, setBook] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completeDialog, setCompleteDialog] = useState({ open: false, booking: null });
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
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

  useEffect(() => {
    if (!user) {
      setBook([]);
      return;
    }

    const q = query(collection(db, "booking"), where("userId", "==", user));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setBook(items);
      
    });

    return () => unsubscribe();
  }, [user]);
  console.log(book)
    console.log("Querying ratings for userId:", user);



  const confirmedCount = book.filter(item => item.status === "confirmed").length;
  const pendingCount = book.filter(item => item.status === "pending").length;
  const completedCount = book.filter(item => item.completed === true).length;

  const handleCompleteBooking = async () => {
    try {
      const bookingRef = doc(db, "booking", completeDialog.booking.id);
      await updateDoc(bookingRef, {
        completed: true,
        status: 'completed',
        completedAt: new Date().toISOString(),
        rating: rating,
        review: review
      });
      
      // Add rating to ratings collection
      if (rating > 0) {
        await addDoc(collection(db, "ratings"), {
          caddieEmail: completeDialog.booking.email,
          caddieName: completeDialog.booking.title,
          rating: rating,
          review: review,
          userId: user,
          createdAt: new Date().toISOString()
        });
      }
      
      setSnackbar({ open: true, message: 'Booking completed successfully!', severity: 'success' });
      setCompleteDialog({ open: false, booking: null });
      setRating(0);
      setReview('');
    } catch (error) {
      console.error('Error completing booking:', error);
      setSnackbar({ open: true, message: 'Error completing booking', severity: 'error' });
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, "booking", bookingId));
      setSnackbar({ open: true, message: 'Booking deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting booking:', error);
      setSnackbar({ open: true, message: 'Error deleting booking', severity: 'error' });
    }
  };

  const getStatusColor = (status, completed) => {
    if (completed) return 'success';
    switch (status) {
      case 'confirmed': return 'primary';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status, completed) => {
    if (completed) return <CheckCircle />;
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'pending': return <AccessTime />;
      default: return null;
    }
  };

  const deleteCaddie = async (id) => {
    await deleteDoc(doc(db, "booking", id));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <NavBar />
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Typography 
          variant={{ xs: 'h5', sm: 'h4' }} 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: '#2e7d32',
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          My Bookings Dashboard
        </Typography>
        
        {/* Stats Cards */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              bgcolor: '#e8f5e8', 
              borderLeft: { xs: 'none', sm: '4px solid #4caf50' },
              borderTop: { xs: '4px solid #4caf50', sm: 'none' },
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant={{ xs: 'body1', sm: 'h6' }} color="#2e7d32">Confirmed</Typography>
                    <Typography variant={{ xs: 'h4', sm: 'h3' }} sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                      {confirmedCount}
                    </Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: { xs: 32, sm: 40 }, color: '#4caf50' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              bgcolor: '#fff3e0', 
              borderLeft: { xs: 'none', sm: '4px solid #ff9800' },
              borderTop: { xs: '4px solid #ff9800', sm: 'none' },
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant={{ xs: 'body1', sm: 'h6' }} color="#f57c00">Pending</Typography>
                    <Typography variant={{ xs: 'h4', sm: 'h3' }} sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                      {pendingCount}
                    </Typography>
                  </Box>
                  <AccessTime sx={{ fontSize: { xs: 32, sm: 40 }, color: '#ff9800' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ 
              bgcolor: '#e3f2fd', 
              borderLeft: { xs: 'none', sm: '4px solid #2196f3' },
              borderTop: { xs: '4px solid #2196f3', sm: 'none' },
              height: '100%'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant={{ xs: 'body1', sm: 'h6' }} color="#1976d2">Completed</Typography>
                    <Typography variant={{ xs: 'h4', sm: 'h3' }} sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {completedCount}
                    </Typography>
                  </Box>
                  <Star sx={{ fontSize: { xs: 32, sm: 40 }, color: '#2196f3' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bookings List */}
        <Typography 
          variant={{ xs: 'h6', sm: 'h5' }} 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          Recent Bookings
        </Typography>
        
        {book.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="h6" align="center" color="textSecondary">
                No bookings found. Start by searching for a caddie!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {book.map((booking) => (
              <Grid item xs={12} sm={6} lg={4} key={booking.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2} flexWrap="wrap" gap={1}>
                      <Typography 
                        variant={{ xs: 'body1', sm: 'h6' }} 
                        sx={{ 
                          fontWeight: 'bold',
                          flex: 1,
                          minWidth: '120px'
                        }}
                      >
                        {booking.title}
                      </Typography>
                      <Chip 
                        label={booking.completed ? 'Completed' : booking.status}
                        color={getStatusColor(booking.status, booking.completed)}
                        icon={getStatusIcon(booking.status, booking.completed)}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {booking.email}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {booking.date}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {booking.time}
                        </Typography>
                      </Box>
                    </Box>

                    {booking.rating && (
                      <Box display="flex" alignItems="center" mb={2}>
                        <Rating value={booking.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({booking.rating}/5)
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Box display="flex" gap={1} flexDirection={{ xs: 'column', sm: 'row' }}>
                      {!booking.completed && booking.status === 'confirmed' && (
                        <Button
                          variant="contained"
                          color="success"
                          size={{ xs: 'medium', sm: 'small' }}
                          startIcon={<CheckCircle />}
                          onClick={() => setCompleteDialog({ open: true, booking })}
                          sx={{ flexGrow: 1 }}
                          fullWidth={{ xs: true, sm: false }}
                        >
                          Complete
                        </Button>
                      )}
                      <Tooltip title="Delete booking">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteBooking(booking.id)}
                          sx={{ alignSelf: { xs: 'center', sm: 'auto' } }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Complete Booking Dialog */}
      <Dialog 
        open={completeDialog.open} 
        onClose={() => setCompleteDialog({ open: false, booking: null })} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 2, sm: 3 },
            width: { xs: 'calc(100% - 32px)', sm: '100%' }
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
            Complete Booking
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Mark your booking with <strong>{completeDialog.booking?.title}</strong> as completed and leave a review.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography component="legend" gutterBottom>Rate your experience:</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={{ xs: 3, sm: 4 }}
            label="Review (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Share your experience with this caddie..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialog({ open: false, booking: null })}>
            Cancel
          </Button>
          <Button 
            onClick={handleCompleteBooking}
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
          >
            Complete Booking
          </Button>
        </DialogActions>
      </Dialog>

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
};

export default Home;