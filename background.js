chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if(request.action === "fetchCountry"){
        const isbn = request.isbn;
        const apiKey = "AIzaSyDbWNw_9Rbsg7RK9V_wa3RtFOhmnW9kLU0";
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const promptText = `Given this ISBN: "${isbn}", provide only the one-word country name of the book's origin.`;
        
        fetch(endpoint,{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: promptText
                  }]
                }]
              })              
        })          
        .then(response => response.json())
        .then(data =>{
            console.log('API response:', data);
            const country = data?.candidates?.[0]?.content || "Unknown";
            console.log("Full candidate object:", JSON.stringify(data.candidates[0], null, 2));
            chrome.tabs.sendMessage(sender.tab.id, { action: "displayCountry", country: country });
        })
        .catch(error =>{
            console.error("Error fetching country:", error);
            chrome.tabs.sendMessage(sender.tab.id, { action: "displayCountry", country: "Error fetching data" });
        });
    }
});
  