package com.example.demo.model;
public class Reservation {
    private String pnr;
    private String passengerName;
    private int seatId;

    public Reservation(String pnr, String passengerName, int seatId) {
        this.pnr = pnr;
        this.passengerName = passengerName;
        this.seatId = seatId;
    }
    
    // Getters
    public String getPnr() { return pnr; }
    public String getPassengerName() { return passengerName; }
    public int getSeatId() { return seatId; }
}