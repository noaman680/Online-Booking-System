// --- Service Layer: ReservationService.java ---
package com.example.demo.service;

import com.example.demo.model.Reservation;
import com.example.demo.model.Seat;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ReservationService {

    private final List<Seat> seats;
    private final Map<String, Reservation> reservations = new ConcurrentHashMap<>();

    public ReservationService() {
        // Initialize seats
        seats = IntStream.range(0, 40)
            .mapToObj(i -> {
                String type = (i % 4 == 0 || i % 4 == 3) ? "window" : "aisle";
                double price = type.equals("window") ? 50.0 : 45.0;
                Seat seat = new Seat(i + 1, String.format("%d%s", (i / 4) + 1, (char)('A' + (i % 4))), type, price);
                // Randomly reserve some seats for demonstration
                if (Math.random() > 0.7) {
                    seat.setReserved(true);
                }
                return seat;
            })
            .collect(Collectors.toList());
    }

    public List<Seat> getAllSeats() {
        return seats;
    }

    public Optional<Reservation> makeReservation(String passengerName, int seatId) {
        Optional<Seat> seatToReserve = seats.stream().filter(s -> s.getId() == seatId && !s.isReserved()).findFirst();
        if (seatToReserve.isPresent()) {
            Seat seat = seatToReserve.get();
            seat.setReserved(true);
            String pnr = "PNR" + System.currentTimeMillis();
            Reservation newReservation = new Reservation(pnr, passengerName, seatId);
            reservations.put(pnr, newReservation);
            return Optional.of(newReservation);
        }
        return Optional.empty();
    }

    public boolean cancelReservation(String pnr) {
        Reservation reservation = reservations.get(pnr);
        if (reservation != null) {
            Optional<Seat> seatToCancel = seats.stream().filter(s -> s.getId() == reservation.getSeatId()).findFirst();
            seatToCancel.ifPresent(seat -> seat.setReserved(false));
            reservations.remove(pnr);
            return true;
        }
        return false;
    }
}
