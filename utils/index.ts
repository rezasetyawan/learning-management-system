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

export function formatTimestampToShortString(timestampStr:string) {
    const timestamp = parseInt(timestampStr); // Convert string to number
    const date = new Date(timestamp);
  
    // Set timezone offset for WIB (UTC+7)
    const offset = 7 * 60 * 60 * 1000;
    const timestampWIB = new Date(date.getTime() + offset);
  
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
  