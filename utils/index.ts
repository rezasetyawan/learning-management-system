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
