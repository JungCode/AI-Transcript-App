export enum DurationFormat {
  Verbose = 'verbose',
  Compact = 'compact',
}

const formatDate = (dateString?: number): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  } catch {
    return dateString.toString();
  }
};

const formatDuration = (seconds: number, type: DurationFormat): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  switch (type) {
    case DurationFormat.Verbose:
      if (minutes === 0) return `${remainingSeconds} seconds`;
      if (remainingSeconds === 0)
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
      return `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`;

    case DurationFormat.Compact:
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

    default:
      return '';
  }
};

const formatDateOnly = (dateTime: string) => {
  const d = new Date(dateTime);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatStripHTML = (htmlString: string): string => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, '');
};

export { formatDate, formatDateOnly, formatDuration, formatStripHTML };
