# Movie Ticket Booking Simulator (C++)

A console-based mini project that simulates basic cinema seat booking and cancellation. It demonstrates four data structures: a two-dimensional array, queue, stack, and singly linked list.

## Features
- Display a 5 × 5 seat layout
- Book a seat for a customer
- Prevent duplicate bookings
- Display all confirmed bookings
- View the most recent booking
- Cancel a booking and release the seat
- Validate seat coordinates and numeric menu input
- Fixed ticket price: Rs. 150

## Data structures used
1. **2D Array (`bool seats[5][5]`)** — tracks whether each seat is available or booked.
2. **Queue (`queue<string> bookingQueue`)** — demonstrates FIFO handling of booking requests. In this prototype, each request is processed immediately.
3. **Stack (`stack<string> bookingHistory`)** — stores booking entries; `top()` displays the latest entry.
4. **Singly Linked List (`Booking`)** — stores confirmed booking records and supports insertion, traversal, and deletion during cancellation.

## Requirements
- A C++ compiler such as g++ (GCC), MinGW, or an IDE such as Code::Blocks / Visual Studio.
- C++11 or later.

## Compile and run

### Windows (MinGW / g++)
Open Command Prompt or the VS Code terminal in this folder:

```bash
g++ -std=c++11 main.cpp -o movie_booking
movie_booking.exe
```

### Linux / macOS
```bash
g++ -std=c++11 main.cpp -o movie_booking
./movie_booking
```

## Menu
1. Display Seats
2. Book Ticket
3. View All Bookings
4. View Last Booking
5. Cancel Ticket
6. Exit

## Example test
1. Choose `2` to book a ticket.
2. Enter a customer name, row `2`, and seat `3`.
3. Choose `1` to see the seat marked `X`.
4. Choose `3` to view confirmed bookings.
5. Choose `4` to view the most recent booking.
6. Choose `5`, enter row `2` and seat `3` to cancel.
7. Choose `1` again to verify that the seat is available.

## Limitations / future scope
- Data is stored in memory and is cleared when the program exits.
- The queue currently processes each request immediately; it is not a persistent pending-request system.
- Movie selection, show times, payments, user accounts, and database storage are not implemented.

## GitHub
After creating a GitHub repository, replace this line with its URL:
`[Add repository URL here]`
