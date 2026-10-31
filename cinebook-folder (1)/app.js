const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLS = [1, 2, 3, 4, 5];
const TICKET_PRICE = 150;
const STORAGE_KEY = 'cinebook-bookings-v1';

const state = {
  bookings: loadBookings(),
  selectedSeat: null,
};

const seatGrid = document.getElementById('seatGrid');
const selectedSeatLabel = document.getElementById('selectedSeatLabel');
const selectionSummary = document.getElementById('selectionSummary');
const statusMessage = document.getElementById('statusMessage');
const bookingForm = document.getElementById('bookingForm');
const customerName = document.getElementById('customerName');
const rowInput = document.getElementById('rowInput');
const seatInput = document.getElementById('seatInput');
const availableCount = document.getElementById('availableCount');
const bookedCount = document.getElementById('bookedCount');
const bookingCountLabel = document.getElementById('bookingCountLabel');
const bookingsList = document.getElementById('bookingsList');
const latestContent = document.getElementById('latestContent');

function loadBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveBookings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookings));
}

function isBooked(row, col) {
  return state.bookings.some((booking) => booking.row === row && Number(booking.col) === Number(col));
}

function renderSeatMap() {
  seatGrid.innerHTML = '';
  ROWS.forEach((row) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'seat-row';

    const rowLabel = document.createElement('span');
    rowLabel.className = 'row-label';
    rowLabel.textContent = row;
    rowEl.appendChild(rowLabel);

    COLS.forEach((col) => {
      const seat = document.createElement('button');
      const booked = isBooked(row, col);
      const selected = state.selectedSeat?.row === row && state.selectedSeat?.col === col;
      seat.type = 'button';
      seat.className = `seat ${booked ? 'booked' : ''} ${selected ? 'selected' : ''}`;
      seat.textContent = col;
      seat.setAttribute('aria-label', `Row ${row}, seat ${col}${booked ? ', booked' : selected ? ', selected' : ', available'}`);
      seat.disabled = booked;
      seat.addEventListener('click', () => chooseSeat(row, col));
      rowEl.appendChild(seat);
    });
    seatGrid.appendChild(rowEl);
  });
  renderStats();
}

function chooseSeat(row, col) {
  if (isBooked(row, col)) {
    showStatus('That seat has already found its audience. Try another view.', 'error');
    return;
  }
  state.selectedSeat = { row, col };
  rowInput.value = row;
  seatInput.value = String(col);
  renderSeatMap();
  updateSelectionSummary();
  showStatus('', '');
  customerName.focus();
}

function syncSeatFromInputs() {
  const row = rowInput.value;
  const col = Number(seatInput.value);
  if (row && col) {
    if (isBooked(row, col)) {
      state.selectedSeat = null;
      updateSelectionSummary();
      renderSeatMap();
      showStatus(`Row ${row}, seat ${col} is already booked. Choose another seat.`, 'error');
      return;
    }
    state.selectedSeat = { row, col };
    renderSeatMap();
    updateSelectionSummary();
    showStatus('', '');
  } else {
    state.selectedSeat = null;
    renderSeatMap();
    updateSelectionSummary();
  }
}

function updateSelectionSummary() {
  if (state.selectedSeat) {
    const { row, col } = state.selectedSeat;
    selectedSeatLabel.textContent = `Row ${row} · Seat ${col}`;
    selectionSummary.classList.add('active');
    selectionSummary.innerHTML = `<span class="summary-icon">✓</span><span>Row ${row}, seat ${col} selected<br /><small>Ready when you are, ${customerName.value.trim() || 'moviegoer'}.</small></span>`;
  } else {
    selectedSeatLabel.textContent = 'No seat selected';
    selectionSummary.classList.remove('active');
    selectionSummary.innerHTML = '<span class="summary-icon">+</span><span>Select a seat on the map<br /><small>or use the row and seat selectors</small></span>';
  }
}

function renderStats() {
  const booked = state.bookings.length;
  availableCount.textContent = String(ROWS.length * COLS.length - booked);
  bookedCount.innerHTML = `${booked} <small>booked</small>`;
  bookingCountLabel.textContent = `${booked} reservation${booked === 1 ? '' : 's'}`;
}

function handleBooking(event) {
  event.preventDefault();
  const name = customerName.value.trim();
  const seat = state.selectedSeat;

  if (!name) {
    showStatus('Tell us who the ticket is for before you book.', 'error');
    customerName.focus();
    return;
  }
  if (!seat) {
    showStatus('Choose an available seat on the map to continue.', 'error');
    document.getElementById('seat-map').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  if (isBooked(seat.row, seat.col)) {
    showStatus('That seat was just booked. Please pick another one.', 'error');
    state.selectedSeat = null;
    renderSeatMap();
    updateSelectionSummary();
    return;
  }

  const booking = {
    id: `${Date.now()}-${seat.row}${seat.col}`,
    name,
    row: seat.row,
    col: seat.col,
    price: TICKET_PRICE,
    createdAt: new Date().toISOString(),
  };
  state.bookings.push(booking);
  saveBookings();
  state.selectedSeat = null;
  bookingForm.reset();
  renderAll();
  renderLatest(booking);
  showStatus(`Booked! ${name}'s seat is ready — Row ${booking.row}, Seat ${booking.col}.`, 'success');
  document.getElementById('latestBooking').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function cancelBooking(id) {
  const booking = state.bookings.find((item) => item.id === id);
  if (!booking) return;
  state.bookings = state.bookings.filter((item) => item.id !== id);
  saveBookings();
  if (state.selectedSeat?.row === booking.row && state.selectedSeat?.col === Number(booking.col)) {
    state.selectedSeat = null;
  }
  renderAll();
  showStatus(`Booking cancelled for ${booking.name}. Row ${booking.row}, seat ${booking.col} is available again.`, 'success');
}

function renderBookings() {
  if (!state.bookings.length) {
    bookingsList.innerHTML = '<div class="empty-bookings">No confirmed bookings yet. The first seat is waiting for you.</div>';
    return;
  }
  bookingsList.innerHTML = state.bookings.map((booking, index) => `
    <div class="booking-row">
      <span class="booking-index">0${index + 1}</span>
      <div><div class="booking-name">${escapeHtml(booking.name)}</div><div class="booking-sub">After the Rain · Friday, 7:30 PM</div></div>
      <div class="booking-detail"><small>Seat</small>Row ${booking.row} · ${booking.col}</div>
      <div class="booking-detail booking-price"><small>Price</small>Rs. ${booking.price}</div>
      <button class="cancel-button" type="button" data-cancel-id="${booking.id}">Cancel</button>
    </div>
  `).join('');

  bookingsList.querySelectorAll('[data-cancel-id]').forEach((button) => {
    button.addEventListener('click', () => cancelBooking(button.dataset.cancelId));
  });
}

function renderLatest(booking = state.bookings[state.bookings.length - 1]) {
  if (!booking) {
    latestContent.className = 'latest-content empty-latest';
    latestContent.innerHTML = '<span class="latest-placeholder">Your most recent booking<br />will appear here.</span>';
    return;
  }
  latestContent.className = 'latest-content';
  latestContent.innerHTML = `<div class="latest-booking"><div><h3>${escapeHtml(booking.name)}</h3><p>After the Rain · Friday, 7:30 PM</p></div><div class="latest-seat">${booking.row}${booking.col}<small>your seat</small></div></div>`;
}

function renderAll() {
  renderSeatMap();
  renderBookings();
  renderLatest();
  updateSelectionSummary();
}

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${message ? 'show' : ''} ${type || ''}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}

rowInput.addEventListener('change', syncSeatFromInputs);
seatInput.addEventListener('change', syncSeatFromInputs);
customerName.addEventListener('input', updateSelectionSummary);
bookingForm.addEventListener('submit', handleBooking);
document.getElementById('resetDemo').addEventListener('click', () => {
  if (!state.bookings.length || window.confirm('Reset all demo bookings?')) {
    state.bookings = [];
    state.selectedSeat = null;
    saveBookings();
    bookingForm.reset();
    renderAll();
    showStatus('The cinema is ready for a fresh night.', 'success');
  }
});

renderAll();
