const testImprovedYouTube = async () => {
  // Test with the specific video that was causing issues
  const testUrl = 'https://www.youtube.com/watch?v=f4kqHPrJAZE';
  
  console.log('Testing improved YouTube content analysis...');
  console.log('URL:', testUrl);
  console.log('This should now provide meaningful analysis based on actual video content');
  
  try {
    const response = await fetch('http://localhost:3001/api/analyze-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        link: testUrl,
        manualType: 'YouTube video'
      })
    });
    
    if (!response.ok) {
      console.error('Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('\n=== Analysis Result ===');
    console.log('Type:', data.type);
    console.log('Purpose:', data.purpose);
    console.log('Content Available:', data.contentAvailable);
    
    if (data.contentAnalysis) {
      console.log('\n=== Content Analysis ===');
      console.log('This should now show specific analysis based on the actual video content:');
      console.log('='.repeat(80));
      console.log(data.contentAnalysis);
      console.log('='.repeat(80));
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
};

// Also test with a different video to compare
const testComparison = async () => {
  const testUrl2 = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  
  console.log('\n\n=== Comparison Test ===');
  console.log('URL:', testUrl2);
  
  try {
    const response = await fetch('http://localhost:3001/api/analyze-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        link: testUrl2,
        manualType: 'YouTube video'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Content Available:', data.contentAvailable);
      
      if (data.contentAnalysis) {
        console.log('\nContent Analysis Preview:');
        console.log(data.contentAnalysis.substring(0, 300) + '...');
      }
    }
  } catch (error) {
    console.error('Comparison test failed:', error);
  }
};

// Run the tests
testImprovedYouTube().then(() => {
  return testComparison();
}).then(() => {
  console.log('\n\n=== All tests completed ===');
  console.log('The improved analysis should now provide specific, meaningful content based on actual video data');
}); 