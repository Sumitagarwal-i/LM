const testYouTubeAPI = async () => {
  const videoId = 'f4kqHPrJAZE'; // The video ID from your example
  const apiKey = 'AIzaSyBqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqX'; // Demo key
  
  console.log('Testing YouTube Data API directly...');
  console.log('Video ID:', videoId);
  
  try {
    // Test YouTube Data API
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
    console.log('API URL:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('\n=== YouTube API Response ===');
    console.log('Items found:', data.items?.length || 0);
    
    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      const snippet = video.snippet;
      
      console.log('\n=== Video Information ===');
      console.log('Title:', snippet.title);
      console.log('Channel:', snippet.channelTitle);
      console.log('Published:', snippet.publishedAt);
      console.log('Description length:', snippet.description?.length || 0);
      console.log('Tags count:', snippet.tags?.length || 0);
      
      if (snippet.description) {
        console.log('\n=== Description Preview ===');
        console.log(snippet.description.substring(0, 500) + '...');
      }
      
      if (snippet.tags) {
        console.log('\n=== Tags ===');
        console.log(snippet.tags.slice(0, 10).join(', '));
      }
      
      console.log('\n=== Statistics ===');
      console.log('Views:', video.statistics?.viewCount || 'Unknown');
      console.log('Likes:', video.statistics?.likeCount || 'Unknown');
      console.log('Comments:', video.statistics?.commentCount || 'Unknown');
      
      console.log('\n=== Content Details ===');
      console.log('Duration:', video.contentDetails?.duration || 'Unknown');
      console.log('Definition:', video.contentDetails?.definition || 'Unknown');
      console.log('Caption:', video.contentDetails?.caption || 'Unknown');
      
    } else {
      console.log('No video found with this ID');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Also test with a different video
const testAnotherVideo = async () => {
  const videoId = 'dQw4w9WgXcQ'; // Rick Roll
  const apiKey = 'AIzaSyBqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqX';
  
  console.log('\n\n=== Testing Another Video ===');
  console.log('Video ID:', videoId);
  
  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        console.log('Title:', video.snippet.title);
        console.log('Channel:', video.snippet.channelTitle);
        console.log('Description preview:', video.snippet.description?.substring(0, 200) + '...');
      }
    }
  } catch (error) {
    console.error('Second test failed:', error);
  }
};

// Run the tests
testYouTubeAPI().then(() => {
  return testAnotherVideo();
}).then(() => {
  console.log('\n\n=== API tests completed ===');
}); 