const testYouTubeContent = async () => {
  // Test with a real educational video that should have good content
  const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick Roll for testing
  const testUrl2 = 'https://www.youtube.com/watch?v=8jLoIO9PSqk'; // Another test video
  
  console.log('Testing improved YouTube content analysis...');
  console.log('Test URL 1:', testUrl);
  console.log('Test URL 2:', testUrl2);
  
  const testUrls = [testUrl, testUrl2];
  
  for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    console.log(`\n=== Testing URL ${i + 1} ===`);
    console.log('URL:', url);
    
    try {
      const response = await fetch('http://localhost:3001/api/analyze-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          link: url,
          manualType: 'YouTube video'
        })
      });
      
      if (!response.ok) {
        console.error('Error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        continue;
      }
      
      const data = await response.json();
      console.log('\n=== Analysis Result ===');
      console.log('Type:', data.type);
      console.log('Purpose:', data.purpose);
      console.log('Content Available:', data.contentAvailable);
      
      if (data.contentAnalysis) {
        console.log('\n=== Content Analysis ===');
        console.log(data.contentAnalysis);
      } else if (data.contentMessage) {
        console.log('\n=== Content Message ===');
        console.log(data.contentMessage);
      }
      
      console.log('\n=== Actions ===');
      console.log('Number of actions:', data.actions?.length || 0);
      data.actions?.forEach((action, index) => {
        console.log(`${index + 1}. ${action.icon} ${action.title}: ${action.description}`);
      });
      
    } catch (error) {
      console.error('Test failed:', error);
    }
  }
};

// Also test with a real educational video
const testRealVideo = async () => {
  console.log('\n\n=== Testing with Real Educational Video ===');
  const realVideoUrl = 'https://www.youtube.com/watch?v=8jLoIO9PSqk'; // Replace with a real educational video
  
  try {
    const response = await fetch('http://localhost:3001/api/analyze-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        link: realVideoUrl,
        manualType: 'YouTube video'
      })
    });
    
    if (!response.ok) {
      console.error('Error:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('Real Video Analysis:');
    console.log('Content Available:', data.contentAvailable);
    
    if (data.contentAnalysis) {
      console.log('\nContent Analysis:');
      console.log(data.contentAnalysis);
    }
    
  } catch (error) {
    console.error('Real video test failed:', error);
  }
};

// Run the tests
testYouTubeContent().then(() => {
  console.log('\n\n=== All tests completed ===');
}); 