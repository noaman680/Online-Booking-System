import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';

// --- Type Definitions ---
interface Seat {
  id: number;
  number: string;
  isReserved: boolean;
  type: 'window' | 'aisle';
  price: number;
}

interface User {
    fullName: string;
    email: string;
}

// Added Password to the User type for our local user list
interface UserWithPassword extends User {
    password: string;
}

interface ReservationDetails {
    pnr: string;
    passengerName: string;
    seatNumber: string;
}

// --- Helper Components ---

const SeatIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 18v3h3v-3h10v3h3v-6H4v3zm15-8h3v3h-3v-3zM2 10h3v3H2v-3zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z" />
  </svg>
);

// --- Authentication Page Component ---




// --- Reservation Page Component ---

const ReservationPage: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
    const [reservationDetails, setReservationDetails] = useState<ReservationDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [pnrToCancel, setPnrToCancel] = useState('');
    const [cancellationStatus, setCancellationStatus] = useState('');

    const API_BASE_URL = 'http://localhost:8080/api';

    useEffect(() => {
        const fetchSeats = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/seats`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data: Seat[] = await response.json();
                setSeats(data);
            } catch (e: any) {
                if (e instanceof TypeError && e.message === 'Failed to fetch') {
                    setError('Connection to server failed. Please ensure your Java backend is running.');
                } else {
                    setError('An unexpected error occurred while fetching seat data.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchSeats();
    }, []);

    const handleSeatClick = (seat: Seat) => {
        if (seat.isReserved) return;
        setSelectedSeat(seat.id === selectedSeat?.id ? null : seat);
    };

    const handleReservation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedSeat) return;
        
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/reservations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seatId: selectedSeat.id, passengerName: user.fullName }),
            });

            if (!response.ok) throw new Error('Reservation failed!');
            
            const newReservation = await response.json();

            setReservationDetails({
                pnr: newReservation.pnr,
                seatNumber: selectedSeat.number,
                passengerName: newReservation.passengerName
            });
            
            setSeats(seats.map(s => s.id === selectedSeat.id ? { ...s, isReserved: true } : s));
            setSelectedSeat(null);
        } catch (err) {
            setError('Failed to make a reservation. The seat might have been taken.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancellation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!pnrToCancel.trim()) {
            setCancellationStatus('Please enter a PNR number.');
            return;
        }
        setIsLoading(true);
        setCancellationStatus('');

        try {
            const response = await fetch(`${API_BASE_URL}/reservations/${pnrToCancel}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Cancellation failed. PNR not found.');
            
            const result = await response.json();
            setCancellationStatus(result.message);

            const seatResponse = await fetch(`${API_BASE_URL}/seats`);
            const data: Seat[] = await seatResponse.json();
            setSeats(data);
            
            if (reservationDetails?.pnr === pnrToCancel) setReservationDetails(null);
            setPnrToCancel('');
        } catch (err: any) {
            setCancellationStatus(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">ExpressLine Reservations</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Welcome, {user.fullName}!</span>
                        <button onClick={onLogout} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                            Logout
                        </button>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Your Seat</h2>
                        <div className="flex justify-around mb-4 text-sm text-gray-600">
                            <div className="flex items-center"><SeatIcon className="w-5 h-5 text-blue-500 mr-2"/> Available</div>
                            <div className="flex items-center"><SeatIcon className="w-5 h-5 text-green-500 mr-2"/> Selected</div>
                            <div className="flex items-center"><SeatIcon className="w-5 h-5 text-gray-400 mr-2"/> Reserved</div>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg">
                            {isLoading && seats.length === 0 ? (
                                <div className="flex justify-center items-center h-64">
                                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : error ? (
                                <p className="text-center text-red-500 p-4">{error}</p>
                            ) : (
                                <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                                    {seats.map((seat, index) => {
                                        const isSelected = selectedSeat?.id === seat.id;
                                        const seatClass = seat.isReserved ? 'text-gray-400 cursor-not-allowed' : isSelected ? 'text-green-500 cursor-pointer' : 'text-blue-500 hover:text-blue-700 cursor-pointer';
                                        return (
                                            <React.Fragment key={seat.id}>
                                                <div onClick={() => handleSeatClick(seat)} className={`flex flex-col items-center justify-center p-1 rounded-lg transition-transform transform hover:scale-110 ${isSelected ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                                                    <SeatIcon className={`w-8 h-8 ${seatClass}`} />
                                                    <span className="text-xs font-semibold text-gray-600">{seat.number}</span>
                                                </div>
                                                {(index + 1) % 4 === 2 && <div className="md:col-start-3"></div>}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            {reservationDetails ? (
                                <div>
                                    <h2 className="text-xl font-semibold text-green-600 mb-4">Reservation Confirmed!</h2>
                                    <div className="space-y-2 text-gray-700">
                                        <p><strong>PNR:</strong> <span className="font-mono bg-gray-200 px-2 py-1 rounded">{reservationDetails.pnr}</span></p>
                                        <p><strong>Passenger:</strong> {reservationDetails.passengerName}</p>
                                        <p><strong>Seat:</strong> {reservationDetails.seatNumber}</p>
                                    </div>
                                    <button onClick={() => setReservationDetails(null)} className="w-full mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                                        Book Another Seat
                                    </button>
                                </div>
                            ) : selectedSeat ? (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirm Reservation</h2>
                                    <p className="text-gray-600 mb-4">You are booking seat <span className="font-bold">{selectedSeat.number}</span> for <span className="font-bold">{user.fullName}</span>.</p>
                                    <form onSubmit={handleReservation}>
                                        <button type="submit" disabled={isLoading} className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400">
                                            {isLoading ? 'Reserving...' : `Confirm for $${selectedSeat.price}`}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Booking</h2>
                                    <p className="text-gray-600">Please select a seat from the map to begin your reservation.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cancel Reservation</h2>
                            <form onSubmit={handleCancellation}>
                                <div className="mb-4">
                                    <label htmlFor="pnr" className="block text-sm font-medium text-gray-700 mb-1">PNR Number</label>
                                    <input type="text" id="pnr" value={pnrToCancel} onChange={e => setPnrToCancel(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"/>
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400">
                                    {isLoading ? 'Cancelling...' : 'Cancel Booking'}
                                </button>
                                {cancellationStatus && <p className={`text-sm mt-4 ${cancellationStatus.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{cancellationStatus}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};


// --- Main App Component ---
const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    // This state will act as our temporary user database
    const [users, setUsers] = useState<UserWithPassword[]>([
        // Pre-populate with the test user
        { fullName: 'Test User', email: 'test@example.com', password: 'password123' }
    ]);

    const handleLoginSuccess = (loggedInUser: User) => {
        setUser(loggedInUser);
    };

    const handleLogout = () => {
        setUser(null);
    };

    const handleAddUser = (newUser: UserWithPassword) => {
        setUsers(prevUsers => [...prevUsers, newUser]);
    };

    return (
        <div>
            {user ? (
                <ReservationPage user={user} onLogout={handleLogout} />
            ) : (
                <AuthPage 
                    onLoginSuccess={handleLoginSuccess} 
                    users={users} 
                    addUser={handleAddUser} 
                />
            )}
        </div>
    );
};

export default App;
