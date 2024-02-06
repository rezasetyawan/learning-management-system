export function formatTimestamp(timestampStr: string) {
  const timestamp = parseInt(timestampStr); // Convert string to number
  const date = new Date(timestamp);

  // Format the date string
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
    timeZoneName: 'short'
  });
}

export function formatTimestampToShortString(timestampStr: string) {
  const timestamp = parseInt(timestampStr); // Convert string to number
  const date = new Date(timestamp);

  // Set timezone offset for WIB (UTC+7)
  // const offset = 7 * 60 * 60 * 1000;
  const timestampWIB = new Date(date.getTime());

  // Get day, month, year
  const day = timestampWIB.getDate().toString().padStart(2, "0");
  const month = (timestampWIB.getMonth() + 1).toString().padStart(2, "0");
  const year = timestampWIB.getFullYear();

  // Get hours and minutes
  const hours = timestampWIB.getHours().toString().padStart(2, "0");
  const minutes = timestampWIB.getMinutes().toString().padStart(2, "0");

  // Define months array
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Format the date string
  const formattedDate = `${day} ${months[timestampWIB.getMonth()]} ${year}`;
  const formattedTime = `${hours}:${minutes}`;

  // Combine date and time
  return `${formattedDate} ${formattedTime}`;
}

export function getTimeGap(timestamp1: string, timestamp2: string) {
  const MILLIS_IN_MINUTES = 1000 * 60;
  const MILLIS_IN_HOUR = 1000 * 60 * 60;
  const MILLIS_IN_DAY = MILLIS_IN_HOUR * 24;
  const MILLIS_IN_WEEK = MILLIS_IN_DAY * 7;
  const MILLIS_IN_MONTH = MILLIS_IN_DAY * 30;
  const MILLIS_IN_YEAR = MILLIS_IN_DAY * 365;

  const timeDiff = Math.abs(parseInt(timestamp2) - parseInt(timestamp1));

  if (timeDiff > MILLIS_IN_MINUTES && timeDiff < MILLIS_IN_HOUR) {
    return `${Math.floor(timeDiff / MILLIS_IN_MINUTES)} menit`;
  } else if (timeDiff < MILLIS_IN_DAY) {
    return `${Math.floor(timeDiff / MILLIS_IN_HOUR)} jam`;
  } else if (timeDiff > MILLIS_IN_DAY && timeDiff < MILLIS_IN_WEEK) {
    return `${Math.floor(timeDiff / MILLIS_IN_DAY)} hari`;
  } else if (timeDiff > MILLIS_IN_WEEK && timeDiff < MILLIS_IN_MONTH) {
    return `${Math.floor(timeDiff / MILLIS_IN_WEEK)} minggu`;
  } else if (timeDiff > MILLIS_IN_MONTH && timeDiff < MILLIS_IN_YEAR) {
    return `${Math.floor(timeDiff / MILLIS_IN_MONTH)} bulan`;
  } else if (timeDiff > MILLIS_IN_YEAR) {
    return `${Math.floor(timeDiff / MILLIS_IN_YEAR)} tahun`;
  } else {
    return `${Math.floor(timeDiff / MILLIS_IN_DAY)} hari`;
  }
}
