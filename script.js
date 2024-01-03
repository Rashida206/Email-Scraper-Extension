let scrapeEmail = document.getElementById('scrapeEmail');
let list = document.getElementById('emailList');

// Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Get emails
  let emails = request.emails;

  // Display emails on popup
  if (emails == null || emails.length == 0) {
    // No emails
    let li = document.createElement('li');
    li.innerText = "No emails found";
    list.appendChild(li);
  } else {
    // Display emails
    emails.forEach((email) => {
      let li = document.createElement('li');
      li.innerText = email;
      list.appendChild(li);
    });
  }
});

// Button click eventListener
scrapeEmail.addEventListener("click", async () => {

  // Get current active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Execute script to parse emails on page
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapeEmailsFromPage,
  });
});

// Function to Scrape Emails
function scrapeEmailsFromPage() {
  // RegEx to parse emails from HTML code
  const emailRegex = /[\w-]+(?:\.[\w-]+)*@([a-z\d-]+(?:\.[a-z\d-]+)*\.[a-z]{2,3})/gim;

  // Parse emails from HTML of the page
  let emails = document.body.innerHTML.match(emailRegex);

  // Send emails to the popup
  chrome.runtime.sendMessage({ emails: emails });
}
