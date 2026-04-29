'use server';

export async function fetchYoutubeVideoDuration(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await res.text();
    
    // Look for the exact length parameter in YouTube's embedded JSON data
    const match = html.match(/"lengthSeconds":"(\d+)"/);
    
    if (match && match[1]) {
      const totalSeconds = parseInt(match[1]);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      
      if (minutes === 0) {
        return `${seconds} sec`;
      }
      return `${minutes} min`;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch duration:', error);
    return null;
  }
}
