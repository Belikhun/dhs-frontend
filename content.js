var pageLoaded = false;
window.addEventListener("load", e => pageLoaded = true);

// Messages handler
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("Command Received: " + message.action);
    var response = { code: -1, description: "", data: {} }

    switch(message.action) {
        case "status":

            response = { code: 0, description: "Command received!", data: { loaded: pageLoaded } }
            break;

        case "stopLoad":
            window.stop();
            
            response = { code: 0, description: "Success!", data: {} }
            break;

        case "queryText":
            var _e = document.querySelector(message.data.query);

            if (_e)
                response = { code: 0, description: "Success!", data: { text: _e.innerText } }
            else
                response = { code: -1, description: `Element not found!`, data: { query: message.data.query } }
            
            break;

        case "queryInput":
            var _e = document.querySelector(message.data.query);

            if (_e)
                response = { code: 0, description: "Success!", data: { value: _e.value } }
            else
                response = { code: -1, description: "Element not found!", data: { query: message.data.query } }
            
            break;

        case "queryExist":
            var _e = document.querySelector(message.data.query);

            if (_e)
                response = { code: 0, description: "Success!", data: { exist: true } }
            else
                response = { code: -1, description: "Element not found!", data: { exist: false } }
            
            break;

        case "checked":
            var _e = document.querySelector(message.data.query);

            if (_e)
                response = { code: 0, description: "Success!", data: { value: _e.checked } }
            else
                response = { code: -1, description: "Element not found!", data: { query: message.data.query } }
            
            break;

        case "disabled":
            var _e = document.querySelector(message.data.query);

            if (_e)
                response = { code: 0, description: "Success!", data: { disabled: _e.disabled } }
            else
                response = { code: -1, description: "Element not found!", data: { query: message.data.query } }
            
            break;

        case "setInput":
            var _e = document.querySelector(message.data.query);

            if (_e) {
                _e.value = message.data.value;

                _e.dispatchEvent(new Event("focus"));
                _e.dispatchEvent(new Event("blur"));
                _e.dispatchEvent(new Event("keydown"));

                response = { code: 0, description: "Success!", data: { value: _e.value } }
            }
            else
                response = { code: -1, description: "Element not found!", data: { query: message.data.query } }
            
            break;

        case "click":
            var _e = document.querySelector(message.data.query);

            if (_e) {
                _e.focus();
                _e.click();
                _e.checked = true;

                _e.dispatchEvent(new Event("focus"));
                _e.dispatchEvent(new Event("blur"));
                _e.dispatchEvent(new Event("mousedown"));
                _e.dispatchEvent(new Event("keydown"));
                _e.dispatchEvent(new Event("pointerdown"));
                _e.dispatchEvent(new Event("touchend"));
                _e.dispatchEvent(new Event("hashchange"));
                _e.dispatchEvent(new Event("submit"));

                response = { code: 0, description: "Success!", data: { clicked: true } }
            } else
                response = { code: -1, description: "Element not found!", data: { query: message.data.query } }
            
            break;

        case "clickWithText":
            let success = false;
            var _e = document.querySelectorAll(message.data.query);
            
            if (_e.length === 0) {
                response = { code: -1, description: "Element not found!", data: { query: message.data.query } }
                break;
            }

            if (!message.data.text) {
                response = { code: -1, description: "No text sent!", data: {} }
                break;
            }

            for (let item of _e)
                if (item.innerText === message.data.text) {
                    item.click();
                    response = { code: 0, description: "Success", data: { query: message.data.query, text: message.data.text } }
                    
                    success = true;
                    break;
                }

            if (!success)
                response = { code: -1, description: "Element with specified text not found", data: { query: message.data.query, text: message.data.text } }
            break;

        case "changeLocation":
            if (message.data.href) {
                setTimeout(() => location.href = message.data.href, 100);
                response = { code: 0, description: "Success!", data: {} }
            } else
                response = { code: -1, description: "No href sent!", data: {} }

            break;

        case "getCookie":
            let dacookie = {};

            if (message.data.key)
                dacookie[message.data.key] = cookie.get(message.data.key);
            else
                dacookie = cookie.getAll();
                
            response = { code: 0, description: "Success!", data: dacookie }
            break;
        
        case "ajax":
            myajax(
                { ...message.data },
                data => sendResponse({ code: 0, data: data }),
                data => sendResponse({ code: -1, description: `${data.description} while sending an ajax request`, data: data })
            );
            return true;

        case "eval":
            if (message.data.script) {
                let r = eval(message.data.script);
                response = { code: 0, description: "Success!", data: { result: r } }
            } else
                response = { code: -1, description: "No script sent!", data: {} }
            
            break;

        default:
            console.error("Unrecognised command received: ", message.action);
            response.description = "Unrecognised command received: " +  message.action;
            break;
    }

    sendResponse(response);
});