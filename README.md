# CineBook — Movie Ticket Booking Simulator

CineBook is a movie ticket booking project presented in two forms:

1. `movie_ticket_booking.cpp` — the original console-based C++ simulator.
2. `index.html`, `styles.css`, and `app.js` — a polished responsive browser interface based on the same booking logic.

The project uses a 5×5 seating layout and a fixed ticket price of **Rs. 150**.

## Features

- Display 25 seats across rows A–E and seat numbers 1–5.
- Book a seat with a customer name.
- Validate missing names, invalid selections, and already booked seats.
- View all confirmed bookings.
- View the most recent booking.
- Cancel a booking and restore the seat to available.
- Keep browser bookings in `localStorage` for the web version.
- Demonstrate a 2D array, queue, stack, and singly linked list in the C++ version.

## Folder contents

| File | Purpose |
| --- | --- |
| `movie_ticket_booking.cpp` | Original command-line C++ implementation |
| `index.html` | CineBook website structure and content |
| `styles.css` | Responsive cinematic styling |
| `app.js` | Browser booking, cancellation, validation, and persistence logic |
| `server.js` | Small Node.js static server for local preview |
| `package.json` | Start script for the local server |
| `manus-routes.json` | Website route declaration |
| `TODO.md` | Implementation outcomes and project status |

## Run the C++ version

You need a C++ compiler such as `g++`.

```bash
g++ -std=c++17 -Wall -Wextra -pedantic movie_ticket_booking.cpp -o movie_ticket_booking
./movie_ticket_booking
```

On Windows with MinGW, run the same compile command in PowerShell or Git Bash and start the generated `.exe` file:

```bash
g++ -std=c++17 -Wall -Wextra -pedantic movie_ticket_booking.cpp -o movie_ticket_booking.exe
./movie_ticket_booking.exe
```

## Run the website

You need Node.js installed.

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in a browser.

The web version is a frontend simulator. It does not require a database or payment provider. Bookings are saved in the browser's local storage and can be reset with the reset button in the top-right corner.

## Data-structure mapping

- **2D array:** stores whether each seat is available or booked.
- **Queue:** demonstrates first-in, first-out booking request handling.
- **Stack:** keeps the most recent booking at the top.
- **Singly linked list:** stores confirmed booking records and supports cancellation.

## Notes

The website is a visual and interactive redesign of the original C++ simulator. The browser version uses seat labels A–E for readability, while the original console version uses numeric rows 1–5.
