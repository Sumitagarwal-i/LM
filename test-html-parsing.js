const testHTMLParsing = async () => {
  const videoId = 'f4kqHPrJAZE';
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  
  console.log('Testing HTML parsing for YouTube content extraction...');
  console.log('URL:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch YouTube page:', response.status);
      return;
    }

    const html = await response.text();
    console.log('Successfully fetched YouTube page, length:', html.length);
    
    // Test title extraction
    console.log('\n=== Testing Title Extraction ===');
    const titlePatterns = [
      /"title":"([^"]+)"/,
      /<title>([^<]+)<\/title>/,
      /"videoTitle":"([^"]+)"/,
      /"name":"([^"]+)"[^}]*"videoId":"${videoId}"/,
    ];
    
    for (let i = 0; i < titlePatterns.length; i++) {
      const pattern = titlePatterns[i];
      const match = html.match(pattern);
      if (match && match[1] && match[1].length > 5 && !match[1].includes('YouTube')) {
        const title = match[1].replace(/\\u0026/g, '&').replace(/\\"/g, '"').replace(/\\n/g, ' ');
        console.log(`Pattern ${i + 1} found title:`, title);
        break;
      }
    }
    
    // Test description extraction
    console.log('\n=== Testing Description Extraction ===');
    const descPatterns = [
      /"description":"([^"]+)"/,
      /"shortDescription":"([^"]+)"/,
      /"videoDescription":"([^"]+)"/,
    ];
    
    for (let i = 0; i < descPatterns.length; i++) {
      const pattern = descPatterns[i];
      const match = html.match(pattern);
      if (match && match[1] && match[1].length > 20) {
        const description = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\u0026/g, '&');
        console.log(`Pattern ${i + 1} found description (first 200 chars):`, description.substring(0, 200) + '...');
        break;
      }
    }
    
    // Test channel extraction
    console.log('\n=== Testing Channel Extraction ===');
    const channelPatterns = [
      /"channelName":"([^"]+)"/,
      /"author":"([^"]+)"/,
      /"ownerChannelName":"([^"]+)"/,
    ];
    
    for (let i = 0; i < channelPatterns.length; i++) {
      const pattern = channelPatterns[i];
      const match = html.match(pattern);
      if (match && match[1] && match[1].length > 2 && !match[1].includes('http')) {
        const channel = match[1].replace(/\\"/g, '"');
        console.log(`Pattern ${i + 1} found channel:`, channel);
        break;
      }
    }
    
    // Test view count extraction
    console.log('\n=== Testing View Count Extraction ===');
    const viewPatterns = [
      /"viewCount":"([^"]+)"/,
      /"viewCount":(\d+)/,
    ];
    
    for (let i = 0; i < viewPatterns.length; i++) {
      const pattern = viewPatterns[i];
      const match = html.match(pattern);
      if (match && match[1] && !isNaN(match[1])) {
        console.log(`Pattern ${i + 1} found view count:`, match[1]);
        break;
      }
    }
    
    // Test tags extraction
    console.log('\n=== Testing Tags Extraction ===');
    const tagMatch = html.match(/"keywords":\[([^\]]+)\]/);
    if (tagMatch && tagMatch[1]) {
      const tags = tagMatch[1].replace(/"/g, '').replace(/,/g, ', ');
      console.log('Found tags:', tags);
    }
    
    // Test additional text content
    console.log('\n=== Testing Additional Content Extraction ===');
    const textMatches = html.match(/"text":"([^"]+)"/g);
    if (textMatches) {
      const relevantText = textMatches
        .map(match => match.match(/"text":"([^"]+)"/)?.[1] || '')
        .filter(text => text.length > 30 && text.length < 300 && !text.includes('http') && !text.includes('youtube.com'))
        .slice(0, 5);
      
      console.log('Found relevant text snippets:');
      relevantText.forEach((text, index) => {
        console.log(`${index + 1}. ${text.substring(0, 100)}...`);
      });
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testHTMLParsing().then(() => {
  console.log('\n\n=== HTML parsing test completed ===');
  console.log('This shows what content can be extracted from YouTube pages');
}); 