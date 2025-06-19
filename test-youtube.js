// Test YouTube transcript functionality
import { YoutubeTranscript } from 'youtube-transcript';

async function testYouTubeTranscript() {
  try {
    // Test with a known YouTube video ID
    const videoId = 'dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up
    
    console.log('Testing YouTube transcript for video ID:', videoId);
    
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (transcript && transcript.length > 0) {
      console.log('✅ Transcript found!');
      console.log('Number of segments:', transcript.length);
      console.log('First segment:', transcript[0]);
      
      // Combine all text
      const fullText = transcript.map(segment => segment.text).join(' ');
      console.log('Full transcript length:', fullText.length);
      console.log('First 200 characters:', fullText.substring(0, 200) + '...');
    } else {
      console.log('❌ No transcript found');
    }
  } catch (error) {
    console.error('❌ Error fetching transcript:', error.message);
  }
}

testYouTubeTranscript(); 