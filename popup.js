document.getElementById('convert').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: getProblemStatement,
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      if (results && results[0] && results[0].result) {
        chrome.runtime.sendMessage(
          {action: "generateFunctionStub", problemStatement: results[0].result},
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
            } else if (!response.success) {
              console.error("Failed to generate function stub:", response.error);
            }
            window.close(); // Close the popup after sending the message
          }
        );
      } else {
        console.error("Failed to get problem statement");
      }
    });
  });
});

function getProblemStatement() {
  const problemElement = document.querySelector('.problem-statement');
  return problemElement ? problemElement.innerText : 'Problem statement not found';
}