import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
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
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Star, AccessTime, Email, CalendarToday, Delete } from "@mui/icons-material";

const Home = () => {
  const [book, setBook] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [completeDialog, setCompleteDialog] = useState({ open: false, booking: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, bookingId: null });

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u.uid);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Bookings listener
  useEffect(() => {
    if (!user) {
      setBook([]);
      return;
    }

    const q = query(collection(db, "booking"), where("userId", "==", user));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((d) => items.push({ id: d.id, ...d.data() }));
      setBook(items);
    });

    return () => unsubscribe();
  }, [user]);

  const confirmedCount = book.filter((item) => item.status === "confirmed").length;
  const pendingCount = book.filter((item) => item.status === "pending").length;
  const completedCount = book.filter((item) => item.completed === true).length;

  const handleCompleteBooking = async () => {
    if (!completeDialog.booking) return;
    if (completeDialog.booking.completed) {
      setSnackbar({ open: true, message: "This booking is already completed.", severity: "info" });
      setCompleteDialog({ open: false, booking: null });
      return;
    }

    console.log("Completing booking with rating:", rating, "and review:", review);

    try {
      setActionLoading(true);
      const bookingRef = doc(db, "booking", completeDialog.booking.id);
      
      // Update booking with rating and review
      await updateDoc(bookingRef, {
        completed: true,
        status: "completed",
        completedAt: serverTimestamp(),
        rating: Number(rating) || 0,
        review: review || "",
      });

      console.log("Booking updated successfully");

      // Add to ratings collection if rating provided
      if (rating > 0) {
        console.log("Adding rating to ratings collection");
        await addDoc(collection(db, "ratings"), {
          caddieEmail: completeDialog.booking.email || "",
          caddieName: completeDialog.booking.title || "",
          rating: Number(rating),
          review: review || "",
          userId: user,
          bookingId: completeDialog.booking.id,
          createdAt: serverTimestamp(),
        });
        console.log("Rating added to collection");
      }

      setSnackbar({ 
        open: true, 
        message: rating > 0 ? "Booking completed and rating submitted!" : "Booking completed successfully!", 
        severity: "success" 
      });
      setCompleteDialog({ open: false, booking: null });
      setRating(0);
      setReview("");
    } catch (error) {
      console.error("Error completing booking:", error);
      setSnackbar({ open: true, message: "Error completing booking: " + error.message, severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    const bookingId = deleteDialog.bookingId;
    if (!bookingId) return;
    try {
      setActionLoading(true);
      await deleteDoc(doc(db, "booking", bookingId));
      setSnackbar({ open: true, message: "Booking deleted successfully!", severity: "success" });
      setDeleteDialog({ open: false, bookingId: null });
    } catch (error) {
      console.error("Error deleting booking:", error);
      setSnackbar({ open: true, message: "Error deleting booking", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status, completed) => {
    if (completed) return "success";
    switch (status) {
      case "confirmed":
        return "primary";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status, completed) => {
    if (completed) return <CheckCircle />;
    switch (status) {
      case "confirmed":
        return <CheckCircle />;
      case "pending":
        return <AccessTime />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <NavBar />
      <Box sx={{ p: { xs: 3, sm: 4, md: 5 }, maxWidth: { xs: '100%', sm: 1200, md: 1400, lg: 1600 }, mx: "auto" }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            typography: { xs: "h4", sm: "h3", md: "h2" },
            fontWeight: "bold",
            color: "#2e7d32",
            textAlign: { xs: "center", sm: "left" },
            mb: { xs: 3, sm: 4, md: 5 }
          }}
        >
          My Bookings Dashboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={{ xs: 3, sm: 4, md: 5 }} sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                bgcolor: "#e8f5e8",
                borderLeft: { xs: "none", sm: "6px solid #4caf50" },
                borderTop: { xs: "6px solid #4caf50", sm: "none" },
                height: "100%",
                minHeight: { xs: 120, sm: 140, md: 160 },
                borderRadius: 3,
                boxShadow: 3
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h5" sx={{ typography: { xs: "h6", sm: "h5", md: "h4" }, fontWeight: 600 }} color="#2e7d32">
                      Confirmed
                    </Typography>
                    <Typography variant="h2" sx={{ typography: { xs: "h3", sm: "h2", md: "h1" }, fontWeight: "bold", color: "#2e7d32" }}>
                      {confirmedCount}
                    </Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: { xs: 40, sm: 48, md: 56 }, color: "#4caf50" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                bgcolor: "#fff3e0",
                borderLeft: { xs: "none", sm: "6px solid #ff9800" },
                borderTop: { xs: "6px solid #ff9800", sm: "none" },
                height: "100%",
                minHeight: { xs: 120, sm: 140, md: 160 },
                borderRadius: 3,
                boxShadow: 3
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h5" sx={{ typography: { xs: "h6", sm: "h5", md: "h4" }, fontWeight: 600 }} color="#f57c00">
                      Pending
                    </Typography>
                    <Typography variant="h2" sx={{ typography: { xs: "h3", sm: "h2", md: "h1" }, fontWeight: "bold", color: "#f57c00" }}>
                      {pendingCount}
                    </Typography>
                  </Box>
                  <AccessTime sx={{ fontSize: { xs: 40, sm: 48, md: 56 }, color: "#ff9800" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                bgcolor: "#e3f2fd",
                borderLeft: { xs: "none", sm: "6px solid #2196f3" },
                borderTop: { xs: "6px solid #2196f3", sm: "none" },
                height: "100%",
                minHeight: { xs: 120, sm: 140, md: 160 },
                borderRadius: 3,
                boxShadow: 3
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h5" sx={{ typography: { xs: "h6", sm: "h5", md: "h4" }, fontWeight: 600 }} color="#1976d2">
                      Completed
                    </Typography>
                    <Typography variant="h2" sx={{ typography: { xs: "h3", sm: "h2", md: "h1" }, fontWeight: "bold", color: "#1976d2" }}>
                      {completedCount}
                    </Typography>
                  </Box>
                  <Star sx={{ fontSize: { xs: 40, sm: 48, md: 56 }, color: "#2196f3" }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bookings List */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ 
            fontWeight: "bold", 
            mb: { xs: 3, sm: 4, md: 5 }, 
            textAlign: { xs: "center", sm: "left" }, 
            typography: { xs: "h5", sm: "h4", md: "h3" },
            color: "#1a1a1a"
          }}
        >
          Recent Bookings
        </Typography>

        {book.length === 0 ? (
          <Card sx={{ borderRadius: 3, boxShadow: 2, minHeight: { xs: 120, sm: 140 } }}>
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 }, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ typography: { xs: "h6", sm: "h5" }, fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' } }} align="center" color="text.secondary">
                No bookings found. Start by searching for a caddie!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
            {book.map((booking) => (
            <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={booking.id}>
                <Card
                  sx={{
                    height: "100%",
                    minHeight: { xs: 280, sm: 320, md: 360 },
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    borderRadius: 3,
                    boxShadow: 2,
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 6
                    },
                  }}
                >
                    <CardContent sx={{ flexGrow: 1, p: { xs: 2.5, sm: 3, md: 3.5 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={{ xs: 2, sm: 2.5, md: 3 }} flexWrap="wrap" gap={1.5} width="100%">
                      <Typography
                        variant="h5"
                        sx={{ 
                          fontWeight: "bold", 
                          flex: 1, 
                          minWidth: "120px", 
                          typography: { xs: "h6", sm: "h5", md: "h5" },
                          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.4rem' }
                        }}
                      >
                        {booking.title}
                      </Typography>
                      <Chip
                        label={booking.completed ? "Completed" : booking.status}
                        color={getStatusColor(booking.status, booking.completed)}
                        icon={getStatusIcon(booking.status, booking.completed)}
                        size="medium"
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                          height: { xs: 28, sm: 32, md: 36 }
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
                      <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 1.5 }}>
                        <Email sx={{ fontSize: { xs: 18, sm: 20, md: 22 }, mr: { xs: 1, sm: 1.5 }, color: "text.secondary" }} />
                        <Typography variant="body1" sx={{ typography: { xs: "body2", sm: "body1" }, fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' } }} color="text.secondary">
                          {booking.email}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={{ xs: 1, sm: 1.5 }}>
                        <CalendarToday sx={{ fontSize: { xs: 18, sm: 20, md: 22 }, mr: { xs: 1, sm: 1.5 }, color: "text.secondary" }} />
                        <Typography variant="body1" sx={{ typography: { xs: "body2", sm: "body1" }, fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' } }} color="text.secondary">
                          {booking.date}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <AccessTime sx={{ fontSize: { xs: 18, sm: 20, md: 22 }, mr: { xs: 1, sm: 1.5 }, color: "text.secondary" }} />
                        <Typography variant="body1" sx={{ typography: { xs: "body2", sm: "body1" }, fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' } }} color="text.secondary">
                          {booking.time}
                        </Typography>
                      </Box>
                    </Box>

                    {booking.rating && (
                      <Box display="flex" alignItems="center" mb={{ xs: 2, sm: 2.5 }}>
                        <Rating value={Number(booking.rating) || 0} readOnly size="medium" sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' } }} />
                        <Typography variant="body1" sx={{ ml: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' } }}>
                          ({Number(booking.rating) || 0}/5)
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <Box sx={{ p: { xs: 2.5, sm: 3, md: 3.5 }, pt: 0 }}>
                    <Box display="flex" gap={{ xs: 1.5, sm: 2 }} flexDirection={{ xs: "column", sm: "row" }}>
                      {!booking.completed && booking.status === "confirmed" && (
                        <Button
                          variant="contained"
                          color="success"
                          size="medium"
                          startIcon={<CheckCircle sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                          onClick={() => setCompleteDialog({ open: true, booking })}
                          fullWidth
                          sx={{ 
                            width: { xs: "100%", sm: "auto" },
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            py: { xs: 1, sm: 1.25 },
                            px: { xs: 2, sm: 2.5 }
                          }}
                          disabled={actionLoading}
                        >
                          {actionLoading ? "Working..." : "Complete"}
                        </Button>
                      )}
                      <Tooltip title="Delete booking">
                        <span>
                          <IconButton
                            color="error"
                            size="medium"
                            onClick={() => setDeleteDialog({ open: true, bookingId: booking.id })}
                            sx={{ 
                              alignSelf: { xs: "center", sm: "auto" },
                              p: { xs: 1.5, sm: 2 }
                            }}
                            disabled={actionLoading}
                          >
                            <Delete sx={{ fontSize: { xs: 20, sm: 24 } }} />
                          </IconButton>
                        </span>
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
          sx: { m: { xs: 2, sm: 3 }, width: { xs: "calc(100% - 32px)", sm: "100%" } },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <CheckCircle sx={{ mr: 1, color: "success.main" }} />
            Complete Booking
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Mark your booking with <strong>{completeDialog.booking?.title}</strong> as completed and leave a review.
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography component="legend" gutterBottom>
              Rate your experience:
            </Typography>
            <Rating 
              value={rating} 
              onChange={(event, newValue) => {
                console.log("Rating changed to:", newValue);
                setRating(newValue || 0);
              }} 
              size="large" 
              precision={1}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Review (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            sx={{ mt: 2 }}
            placeholder="Share your experience with this caddie..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialog({ open: false, booking: null })}>Cancel</Button>
          <Button onClick={handleCompleteBooking} variant="contained" color="success" startIcon={<CheckCircle />} disabled={actionLoading}>
            {actionLoading ? "Saving..." : "Complete Booking"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, bookingId: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Are you sure you want to delete this booking? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, bookingId: null })}>Cancel</Button>
          <Button onClick={handleDeleteBooking} color="error" variant="contained" startIcon={<Delete />} disabled={actionLoading}>
            {actionLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
