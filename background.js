require('dotenv').config();
const API_KEY = process.env.API_KEY;

const API_URL = 'https://api.openai.com/v1/chat/completions';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "generateFunctionStub") {
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Convert the following Codeforces problem statement into a function stub with driver code for input/output and testing. Only the main solution function should be left empty for implementation:\n\n${message.problemStatement}`
        }]
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.choices && data.choices.length > 0) {
        const stubCode = data.choices[0].message.content;
        chrome.tabs.create({
          url: `data:text/html,<html><body><textarea style="width: 100%; height: 100vh;">${encodeURIComponent(stubCode)}</textarea></body></html>`
        });
        sendResponse({success: true});
      } else {
        throw new Error("No valid response from OpenAI API");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      sendResponse({success: false, error: error.message});
    });
    return true;  // Keeps the message channel open for async response
  }
});