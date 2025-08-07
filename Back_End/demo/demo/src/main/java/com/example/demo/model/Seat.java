// --- Data Model: Seat.java ---
package com.example.demo.model;

public class Seat {
    private int id;
    private String number;
    private boolean isReserved;
    private String type; // e.g., "window", "aisle"
    private double price;

    public Seat(int id, String number, String type, double price) {
        this.id = id;
        this.number = number;
        this.type = type;
        this.price = price;
        this.isReserved = false;
    }

    // Getters and Setters
    public int getId() { return id; }
    public String getNumber() { return number; }
    public boolean isReserved() { return isReserved; }
    public void setReserved(boolean reserved) { isReserved = reserved; }
    public String getType() { return type; }
    public double getPrice() { return price; }
}