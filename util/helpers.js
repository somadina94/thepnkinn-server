exports.getDaysBetweenDates = (date1, date2) => {
  const oneDay = 1000 * 60 * 60 * 24; // milliseconds in one day
  const diffInTime = Math.abs(new Date(date2) - new Date(date1)); // time difference in milliseconds
  return Math.ceil(diffInTime / oneDay); // convert to days
};

exports.checkAvailability = (bookedArr = [], startDate, endDate) => {
  // Convert the input dates to Date objects
  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);

  let booked = false;

  for (const booking of bookedArr) {
    const bookedStartDate = new Date(booking.startDate);
    const bookedEndDate = new Date(booking.endDate);

    // Check for overlap
    if (newStartDate < bookedEndDate && newEndDate > bookedStartDate) {
      booked = true; // Dates overlap
      break; // No need to check further
    }
  }

  return !booked; // Return true if available, false if booked
};

exports.formatDate = (date) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
};

exports.formatAmount = (amount) => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
