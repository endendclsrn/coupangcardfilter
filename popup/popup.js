let card_discount = 0;
chrome.tabs.query({
    active: true,
    currentWindow: true
}, tabs => {
    // ...and send a request for the DOM info...

    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', type: 'get_card_filter', value: '0' },
        function(response) {
            console.log(response);
            document.getElementById("card_filter").checked = response.msg.value == "true";
        }
    );

    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', type: 'get_card_discount', value: '0' },
        function(response) {
            console.log(response);
            document.getElementById("card_discount").value = response.msg.value;
        }
    );

    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', type: 'get_card_calc', value: '0' },
        function(response) {
            console.log(response);
            document.getElementById("card_calc").checked = response.msg.value == "true";
        }
    );
});

document.getElementById("card_discount").addEventListener("change", (event) => {
    if(!isNaN(Number(event.target.value))) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, tabs => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {from: 'popup', type: 'set_card_discount', value: Number(event.target.value) });
        });
    }
});


document.getElementById("card_filter").addEventListener("change", (event) => {
    if(event.target.checked) {
        document.getElementById("card_discount").disabled = false;
    }
    else {
        document.getElementById("card_discount").disabled = true;
    }
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {from: 'popup', type: 'set_card_filter', value: event.target.checked });
    });
});

document.getElementById("card_calc").addEventListener("change", (event) => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {from: 'popup', type: 'set_card_calc', value: event.target.checked });
    });
});