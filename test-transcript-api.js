const testTranscriptAPI = async () => {
  // Use videos that are more likely to have transcripts
  const videoId = 'jNQXAC9IVRw'; // "Me at the zoo" - YouTube's first video, likely has captions
  const apiUrl = 'http://localhost:3002';
  
  console.log('Testing YouTube Transcript API...');
  console.log('Video ID:', videoId);
  console.log('API URL:', apiUrl);
  
  try {
    // Test health endpoint
    console.log('\n=== Testing Health Endpoint ===');
    const healthResponse = await fetch(`${apiUrl}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }
    
    // Test transcript endpoint
    console.log('\n=== Testing Transcript Endpoint ===');
    const transcriptResponse = await fetch(`${apiUrl}/getTranscript?videoId=${videoId}`);
    
    if (transcriptResponse.ok) {
      const transcriptData = await transcriptResponse.json();
      console.log('✅ Transcript retrieved successfully!');
      console.log('Video ID:', transcriptData.videoId);
      console.log('Segments:', transcriptData.segments);
      console.log('Transcript length:', transcriptData.transcript.length, 'characters');
      console.log('\n=== Transcript Preview ===');
      console.log(transcriptData.transcript.substring(0, 500) + '...');
      
      return transcriptData.transcript;
    } else {
      const errorData = await transcriptResponse.json();
      console.log('❌ Transcript retrieval failed:');
      console.log('Status:', transcriptResponse.status);
      console.log('Error:', errorData.error);
      console.log('Message:', errorData.message);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return null;
  }
};

// Test with multiple videos that are more likely to have transcripts
const testMultipleVideos = async () => {
  const testVideos = [
    'jNQXAC9IVRw', // "Me at the zoo" - YouTube's first video
    'kJQP7kiw5Fk', // "Despacito" - Popular song with lyrics
    '9bZkp7q19f0', // "PSY - GANGNAM STYLE" - Popular song with lyrics
  ];
  
  console.log('\n\n=== Testing Multiple Videos ===');
  
  for (const videoId of testVideos) {
    console.log(`\n--- Testing Video: ${videoId} ---`);
    
    try {
      const response = await fetch(`http://localhost:3002/getTranscript?videoId=${videoId}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success: ${data.segments} segments, ${data.transcript.length} characters`);
        console.log('Preview:', data.transcript.substring(0, 100) + '...');
      } else {
        const errorData = await response.json();
        console.log(`❌ Failed: ${errorData.error} - ${errorData.message}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
};

// Test the complete flow with Supabase function
const testCompleteFlow = async () => {
  console.log('\n\n=== Testing Complete Flow ===');
  console.log('This tests the Supabase function calling the transcript API');
  
  const testUrl = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';
  
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
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Complete flow successful!');
      console.log('Content Available:', data.contentAvailable);
      
      if (data.contentAnalysis) {
        console.log('\n=== Content Analysis ===');
        console.log(data.contentAnalysis.substring(0, 300) + '...');
      } else if (data.contentMessage) {
        console.log('\n=== Content Message ===');
        console.log(data.contentMessage);
      }
    } else {
      console.log('❌ Complete flow failed:', response.status);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.error('❌ Complete flow error:', error.message);
  }
};

// Run all tests
const runAllTests = async () => {
  console.log('🚀 Starting YouTube Transcript API Tests\n');
  
  // First test the transcript API directly
  const transcript = await testTranscriptAPI();
  
  // Then test multiple videos
  await testMultipleVideos();
  
  // Finally test the complete flow
  await testCompleteFlow();
  
  console.log('\n\n=== All Tests Completed ===');
  if (transcript) {
    console.log('✅ Transcript API is working correctly!');
  } else {
    console.log('❌ Transcript API needs attention');
  }
};

// Run the tests
runAllTests(); 