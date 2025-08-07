// --- DTO for POST request: ReservationRequest.java ---
package com.example.demo.controller;

// A Data Transfer Object to map the incoming JSON request body
class ReservationRequest {
    private String passengerName;
    private int seatId;

    // Getters and setters
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public int getSeatId() { return seatId; }
    public void setSeatId(int seatId) { this.seatId = seatId; }
}