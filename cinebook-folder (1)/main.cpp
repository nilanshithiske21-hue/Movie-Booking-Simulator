#include <iostream>
#include <string>
#include <queue>
#include <stack>
#include <limits>

using namespace std;

const int ROWS = 5;
const int COLS = 5;
const int TICKET_PRICE = 150;

// 2D array: false = available, true = booked
bool seats[ROWS][COLS] = {false};

// Queue: demonstrates FIFO processing of booking requests
queue<string> bookingQueue;

// Stack: stores booking history; top() gives the most recent entry
stack<string> bookingHistory;

// Singly linked list: stores confirmed booking records
struct Booking {
    string name;
    int row;
    int col;
    Booking* next;
};

Booking* head = nullptr;

void clearInput() {
    cin.clear();
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
}

void displaySeats() {
    cout << "\n--- Seat Layout (O = Available, X = Booked) ---\n";
    cout << "     ";
    for (int col = 1; col <= COLS; ++col) cout << col << "  ";
    cout << '\n';

    for (int i = 0; i < ROWS; ++i) {
        cout << "Row " << i + 1 << " ";
        for (int j = 0; j < COLS; ++j) {
            cout << (seats[i][j] ? "X  " : "O  ");
        }
        cout << '\n';
    }
}

void addBooking(const string& name, int row, int col) {
    Booking* newBooking = new Booking{name, row, col, nullptr};

    if (head == nullptr) {
        head = newBooking;
        return;
    }

    Booking* temp = head;
    while (temp->next != nullptr) temp = temp->next;
    temp->next = newBooking;
}

void bookTicket() {
    string name;
    int row, col;

    cout << "\nEnter customer name: ";
    getline(cin >> ws, name);

    cout << "Enter row (1-5): ";
    if (!(cin >> row)) {
        cout << "Invalid input. Please enter a number.\n";
        clearInput();
        return;
    }

    cout << "Enter seat number (1-5): ";
    if (!(cin >> col)) {
        cout << "Invalid input. Please enter a number.\n";
        clearInput();
        return;
    }

    if (row < 1 || row > ROWS || col < 1 || col > COLS) {
        cout << "Invalid seat selection. Row and seat must be from 1 to 5.\n";
        return;
    }

    if (seats[row - 1][col - 1]) {
        cout << "Sorry! This seat is already booked.\n";
        return;
    }

    // Enqueue the request, then process the next request in FIFO order.
    bookingQueue.push(name);
    string customer = bookingQueue.front();
    bookingQueue.pop();

    seats[row - 1][col - 1] = true;
    addBooking(customer, row, col);

    string details = customer + " - Row " + to_string(row) +
                     ", Seat " + to_string(col);
    bookingHistory.push(details);

    cout << "\nBooking successful!\n"
         << "Customer: " << customer << '\n'
         << "Seat: Row " << row << ", Seat " << col << '\n'
         << "Ticket Price: Rs. " << TICKET_PRICE << '\n';
}

void displayBookings() {
    if (head == nullptr) {
        cout << "\nNo confirmed bookings found.\n";
        return;
    }

    cout << "\n--- Confirmed Bookings ---\n";
    Booking* temp = head;
    while (temp != nullptr) {
        cout << "Customer: " << temp->name
             << " | Row: " << temp->row
             << " | Seat: " << temp->col << '\n';
        temp = temp->next;
    }
}

void showLastBooking() {
    if (bookingHistory.empty()) {
        cout << "\nNo booking history available.\n";
        return;
    }

    cout << "\nMost Recent Booking: " << bookingHistory.top() << '\n';
}

void cancelTicket() {
    int row, col;

    cout << "\nEnter row to cancel (1-5): ";
    if (!(cin >> row)) {
        cout << "Invalid input. Please enter a number.\n";
        clearInput();
        return;
    }

    cout << "Enter seat number to cancel (1-5): ";
    if (!(cin >> col)) {
        cout << "Invalid input. Please enter a number.\n";
        clearInput();
        return;
    }

    if (row < 1 || row > ROWS || col < 1 || col > COLS) {
        cout << "Invalid seat selection. Row and seat must be from 1 to 5.\n";
        return;
    }

    if (!seats[row - 1][col - 1]) {
        cout << "This seat is not currently booked.\n";
        return;
    }

    Booking* current = head;
    Booking* previous = nullptr;

    while (current != nullptr) {
        if (current->row == row && current->col == col) {
            cout << "Booking cancelled for " << current->name << ".\n";
            seats[row - 1][col - 1] = false;

            if (previous == nullptr) {
                head = current->next;
            } else {
                previous->next = current->next;
            }

            delete current;
            return;
        }

        previous = current;
        current = current->next;
    }

    cout << "Booking record was not found. Please check the seat details.\n";
}

void freeBookings() {
    while (head != nullptr) {
        Booking* temp = head;
        head = head->next;
        delete temp;
    }
}

int main() {
    int choice = 0;

    do {
        cout << "\n===== MOVIE TICKET BOOKING SIMULATOR =====\n"
             << "1. Display Seats\n"
             << "2. Book Ticket\n"
             << "3. View All Bookings\n"
             << "4. View Last Booking\n"
             << "5. Cancel Ticket\n"
             << "6. Exit\n"
             << "Enter your choice: ";

        if (!(cin >> choice)) {
            cout << "Invalid menu input. Please enter a number from 1 to 6.\n";
            clearInput();
            continue;
        }
        clearInput();

        switch (choice) {
            case 1: displaySeats(); break;
            case 2: bookTicket(); break;
            case 3: displayBookings(); break;
            case 4: showLastBooking(); break;
            case 5: cancelTicket(); break;
            case 6: cout << "Thank you for using the simulator!\n"; break;
            default: cout << "Invalid choice. Please try again.\n";
        }
    } while (choice != 6);

    freeBookings();
    return 0;
}
