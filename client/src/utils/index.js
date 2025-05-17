/**
 * Formats a timestamp into a readable time string (HH:MM)
 * @param {string} dateString - ISO timestamp string
 * @returns {string} Formatted time string
 */
export function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  /**
   * Formats a date into a relative or absolute date string
   * @param {string} dateString - ISO timestamp string
   * @returns {string} Formatted date string (Today, Yesterday, Day of week, or Date)
   */
  export function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }
  
  /**
   * Truncates text to a specified length and adds ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length before truncation
   * @returns {string} Truncated text with ellipsis if needed
   */
  export function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }
  
  /**
   * Utility for merging Tailwind CSS classes
   * @param {...(string|undefined)} classes - Class strings
   * @returns {string} Merged class string with duplicates removed
   */
  export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  
  /**
   * Formats a last seen timestamp into a human-readable string
   * @param {string} [lastSeenDate] - ISO timestamp string
   * @returns {string} Human-readable last seen string
   */
  export function getLastSeen(lastSeenDate) {
    if (!lastSeenDate) return 'Unknown';
    
    const lastSeen = new Date(lastSeenDate);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return lastSeen.toLocaleDateString();
  }
  