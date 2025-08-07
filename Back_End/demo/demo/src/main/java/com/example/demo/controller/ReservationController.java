// --- Controller Layer: ReservationController.java ---
package com.example.demo.controller;
import com.example.demo.model.Reservation;
import com.example.demo.model.Seat;
import com.example.demo.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

// For a real app, you'd configure CORS properly.
@CrossOrigin(origins = "*") 
@RestController
@RequestMapping("/api")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/seats")
    public List<Seat> getSeatMap() {
        return reservationService.getAllSeats();
    }

    @PostMapping("/reservations")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        Optional<Reservation> reservation = reservationService.makeReservation(request.getPassengerName(), request.getSeatId());
        return reservation
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Seat is already reserved or does not exist.")));
    }

    @DeleteMapping("/reservations/{pnr}")
    public ResponseEntity<?> cancelReservation(@PathVariable String pnr) {
        if (reservationService.cancelReservation(pnr)) {
            return ResponseEntity.ok(Map.of("message", "Reservation " + pnr + " cancelled successfully."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Reservation not found."));
        }
    }
}