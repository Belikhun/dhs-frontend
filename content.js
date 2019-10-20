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

        case "queryText":
            var _e = document.querySelector(message.data.query);

            if (_e)
                response = { code: 0, description: "Success!", data: { text: _e.innerText } }
            else
                response = { code: -1, description: "Element not found!", data: { query: message.data.query } }
            
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

        case "setInput":
            var _e = document.querySelector(message.data.query);

            if (_e) {
                _e.value = message.data.value;
                response = { code: 0, description: "Success!", data: { value: _e.value } }
            }
            else
                response = { code: -1, description: "Element not found!", data: { query: message.data.query } }
            
            break;

        case "click":
            var _e = document.querySelector(message.data.query);

            if (_e) {
                _e.click();
                response = { code: 0, description: "Success!", data: { clicked: true } }
            } else
                response = { code: -1, description: "Element not found!", data: { query: message.data.query } }
            
            break;

        case "clickWithText":
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
                    return;
                }

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

//? From belibrary

cookie = {
    cookie: null,

    getAll() {
        const mycookie = document.cookie.split("; ");
        var dacookie = {};

        for (var i = 0; i < mycookie.length; i++) {
            var t = mycookie[i].split("=");
            dacookie[t[0]] = t[1];
        }
        
        this.cookie = dacookie;
        return dacookie;
    },

    get(key, def = null) {
        if (!this.cookie)
            this.cookie = this.getAll();

        if (def !== null && typeof this.cookie[key] === "undefined")
            this.set(key, def, 9999);

        return this.cookie[key] || def;
    },

    set(key, value = "", days = 0, path = "/") {
        var exp = "";
        if (days !== 0 && typeof days === "number") {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            exp = `; expires=${date.toUTCString()}`;
        }
        
        document.cookie = `${key}=${value}${exp}; path=${path}`;

        this.cookie = this.getAll();
        return true;
    },
}
/**
 * An AJAX function designed for my API
 * @param   {Object}        param0      request data
 * @param   {Function}      callout     on request success handler
 * @param   {Function}      error       on errored handler
 * @returns {Promise}                   A Promise thats resolve on request complete
 */
function myajax({
    url = "/",
    method = "GET",
    query = Array(),
    form = Array(),
    json = {},
    header = Array(),
    type = "json",
    onUpload = () => {},
    onDownload = () => {},
    force = false,
    changeState = true,
    reRequest = true,
}, callout = () => {}, error = () => {}) {
    return new Promise((resolve, reject) => {
        if (__connection__.onlineState !== "online" && force === false) {
            let errorObj = {}
            switch (__connection__.onlineState) {
                case "offline":
                    errorObj = { code: 106, description: "Disconnected to Server" }
                    break;
                case "ratelimited":
                    errorObj = { code: 32, description: "Rate Limited" }
                    break;
            }

            reject(errorObj);
            error(errorObj);

            return;
        }

        var xhr = new XMLHttpRequest();
        let formData = new FormData();

        for (let key of Object.keys(form))
            formData.append(key, form[key]);

        let queryKey = Object.keys(query);
        for (let key of queryKey)
            url += `${(queryKey[0] === key) ? "?" : ""}${key}=${query[key]}${(queryKey[queryKey.length - 1] !== key) ? "&" : ""}`;

        xhr.upload.addEventListener("progress", e => onUpload(e), false);
        xhr.addEventListener("progress", e => onDownload(e), false);

        xhr.addEventListener("readystatechange", async function() {
            if (this.readyState === this.DONE) {
                if (this.status === 0) {
                    if (changeState === true)
                        __connection__.stateChange("offline");
                        
                    let errorObj = { code: 106, description: "Disconnected to Server" };
                    reject(errorObj);
                    error(errorObj);

                    return;
                }
                
                if ((this.responseText === "" || !this.responseText) && this.status !== 200) {
                    clog("errr", {
                        color: flatc("red"),
                        text: `HTTP ${this.status}:`
                    }, this.statusText, {
                        color: flatc("magenta"),
                        text: method
                    }, {
                        color: flatc("pink"),
                        text: url
                    });

                    let errorObj = { code: 1, description: `HTTP ${this.status}: ${this.statusText}` }
                    error(errorObj);
                    reject(errorObj);

                    return;
                }

                if (type === "json") {
                    try {
                        var res = JSON.parse(this.responseText);
                    } catch (data) {
                        clog("errr", "Error parsing JSON.");

                        let errorObj = { code: 2, description: `Error parsing JSON`, data: data }
                        error(errorObj);
                        reject(errorObj);

                        return;
                    }

                    if (this.status !== 200 || (res.code !== 0 && res.code < 100)) {
                        clog("errr", {
                            color: flatc("magenta"),
                            text: method
                        }, {
                            color: flatc("pink"),
                            text: url
                        }, {
                            color: flatc("red"),
                            text: "HTTP " + this.status
                        }, this.statusText, ` >>> ${res.description}`);

                        if (this.status === 429 && res.code === 32 && reRequest === true) {
                            // Waiting for :?unratelimited:?
                            await __connection__.stateChange("ratelimited", res);

                            // Resend previous ajax request
                            let r = await myajax(arguments[0], arguments[1], arguments[2])
                                .catch(d => {
                                    reject(d);
                                    return;
                                })
                            // Resolve promise
                            resolve(r);

                            return;
                        } else {
                            let errorObj = { code: 3, description: `HTTP ${this.status}: ${this.statusText}`, data: res }
                            error(errorObj);
                            reject(errorObj);

                            return;
                        }
                    }

                    data = res;
                } else {
                    if (this.status !== 200) {
                        clog("errr", {
                            color: flatc("red"),
                            text: "HTTP" + this.status
                        }, this.statusText, {
                            color: flatc("magenta"),
                            text: method
                        }, {
                            color: flatc("pink"),
                            text: url
                        });

                        let errorObj = { code: 3, description: `HTTP ${this.status}: ${this.statusText}`, data: res }
                        error(errorObj);
                        reject(errorObj);

                        return;
                    }

                    data = this.responseText;
                }

                callout(data);
                resolve(data);
            }
        })
        
        xhr.open(method, url);
        let sendData = formData;

        for (let key of Object.keys(header))
            xhr.setRequestHeader(key, header[key]);

        if (Object.keys(json).length !== 0) {
            sendData = JSON.stringify(json);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        }

        xhr.send(sendData);
    })
}

__connection__ = {
    onlineState: "online",
    checkEvery: 2000,
    checkInterval: null,
    checkCount: 0,
    onDisconnected: () => {},
    onRatelimited: () => {},
    __checkTime: 0,
    __sbarItem: null,
    __listeners: [],

    async stateChange(state = "online", data = {}) {
        return new Promise((resolve, reject) => {
            const s = ["online", "offline", "ratelimited"];
            if (!typeof state === "string" || state === this.onlineState || s.indexOf(state) === -1) {
                let t = {code: -1, description: `Unknown state or rejected: ${state}`}
                reject(t);
                return;
            }

            clog("INFO", `We just went`, {
                text: state,
                color: flatc("yellow")
            });

            this.onlineState = state;
            this.__triggerOnStateChange(state);
            clearInterval(this.checkInterval);

            switch(state) {
                case "online":
                    clog("okay", "Đã kết nối tới máy chủ.");
                    if (this.__sbarItem)
                        this.__sbarItem.remove();
                    resolve();
                    break;

                case "offline":
                    let checkerer = () => {}

                    clog("lcnt", "Mất kết nối tới máy chủ.");
                    this.checkCount = 0;
                    this.__sbarItem = (typeof sbar !== "undefined") ? sbar.additem("Đang thử kết nối lại...", "spinner", {aligin: "right"}) : null;

                    this.onDisconnected({
                        onCount: (f) => checkerer = f
                    });

                    this.checkInterval = setInterval(() => {
                        this.checkCount++;
                        if (this.__sbarItem)
                            this.__sbarItem.change(`Đang thử kết nối lại... [Lần ${this.checkCount}]`);
                            
                        checkerer(this.checkCount);

                        checkServer(window.location.origin)
                            .then((data) => {
                                if (data.code === 0) {
                                    this.stateChange("online");
                                    checkerer("connected");
                                    resolve();
                                }
                            });
                    }, this.checkEvery);
                    break;

                case "ratelimited":
                    let counterer = () => {}

                    clog("lcnt", data.description);
                    this.__checkTime = parseInt(data.data.reset);
                    this.__sbarItem = (sbar) ? sbar.additem(`Kết nối lại sau [${this.__checkTime}] giây`, "spinner", {aligin: "right"}) : null;

                    this.onRatelimited({
                        onCount: (f) => counterer = f,
                        data: data
                    });

                    this.checkInterval = setInterval(() => {
                        this.__checkTime--;
                        counterer(this.__checkTime);

                        if (this.__sbarItem)
                            this.__sbarItem.change(`Kết nối lại sau [${this.__checkTime}] giây`);

                        if (this.__checkTime <= 0) {
                            this.stateChange("online");
                            resolve();
                        }
                    }, 1000);
                break;
            }
        });
    },

    onStateChange(f) {
        if (typeof f === "function")
            this.__listeners.push(f);
    },

    __triggerOnStateChange(state) {
        for (var i of this.__listeners)
            i(state);
    }

}

function clog(level, ...args) {
    const font = "Calibri";
    const size = "12";
    var date = new Date();
    const rtime = round(sc.stop, 3).toFixed(3);
    var str = "";

    level = level.toUpperCase();
    lc = flatc({
        DEBG: "blue",
		OKAY: "green",
		INFO: "magenta",
		WARN: "yellow",
		ERRR: "red",
		CRIT: "gray",
    }[level])

    text = [
        {
            color: flatc("aqua"),
            text: `${pleft(date.getHours(), 2)}:${pleft(date.getMinutes(), 2)}:${pleft(date.getSeconds(), 2)}`,
            padding: 8,
            seperate: true
        }, {
            color: flatc("blue"),
            text: rtime,
            padding: 8,
            seperate: true
        }, {
            color: flatc("red"),
            text: window.location.pathname,
            padding: 16,
            seperate: true
        }, {
            color: lc,
            text: level,
            padding: 6,
            seperate: true
        }
    ]

    text = text.concat(args);
    var out = new Array();
    out[0] = "%c";
    out[1] = "padding-left: 10px";
    var n = 2;
    // i | 1   2   3   4   5     6
    // j | 0   1   2   3   4     5
    // n | 1 2 3 4 5 6 7 8 9 10 11

    for (var i = 1; i <= text.length; i++) {
        item = text[i-1];
        if (typeof item === "string" || typeof item === "number") {
            if (i > 4) str += `${item} `;
            out[0] += `%c${item} `;
            out[n] = `font-size: ${size}px; font-family: ${font}; color: ${flatc("black")}`;
            n += 1;
        } else if (typeof item === "object") {
            if (!item.text) {
                out[n] = item;
                n += 1;

                continue;
            }

            var t = pleft(item.text, ((item.padding) ? item.padding : 0));
            if (i > 4) str += t + " ";
            out[0] += `%c${t}`;
            
            if (item.seperate) {
                out[0] += "%c| ";
                out[n] = `font-size: ${size}px; color: ${item.color};`;
                out[n+1] = `font-size: ${size}px; color: ${item.color}; font-weight: bold;`;
                n += 2;
            } else {
                out[0] += " ";
                out[n] = `font-size: ${size}px; font-family: ${font}; color: ${item.color}`;
                n += 1;
            }
        } else
            console.error(`error: type ${typeof item}`)
    }

    document.__onclog(level, rtime, str);

    switch (level) {
        case "DEBG":
            console.debug.apply(this, out);
            break;
    
        case "WARN":
            console.warn.apply(this, out);
            break;

        case "ERRR":
            console.error.apply(this, out);
            break;

        case "CRIT":
            console.error.apply(this, out);
            break;

        default:
            console.log.apply(this, out);
            break;
    }
}

if (typeof document.__onclog === "undefined")
    document.__onclog = (lv, t, m) => {};

function round(number, to = 2) {
    const d = Math.pow(10, to);
    return Math.round(number * d) / d;
}


/**
 * Add padding in the left of input if input length is smaller than function length arg.
 *  
 * @param {string} inp Input in String
 * @param {number} inp Input in Number
 * @param {number} length Length
 */
function pleft(inp, length = 0) {
    type = typeof inp;
    inp = (type === "number") ? inp.toString() : inp;
    padd = "";

    switch (type) {
        case "number":
            padd = "0";
            break;

        case "string":
            padd = " ";
            break;

        default:
            console.error(`error: pleft() first arg is ${type}`);
            return false;
    }

    padd = padd.repeat((length - inp.length < 0) ? 0 : length - inp.length);
    return padd + inp;
}

/**
 * My color template
 * Return HEX string color code.
 * 
 * @param   {string}    color
 * @returns {String}
 */
function flatc(color) {
    const clist = {
        green: "#A8CC8C",
        red: "#E88388",
        blue: "#71BEF2",
        aqua: "#66C2CD",
        yellow: "#DBAB79",
        orange: "#e67e22",
        gray: "#6B737E",
        magenta: "#D290E4",
        black: "#282D35",
        pink: "#f368e0",
    }

    return (clist[color]) ? clist[color] : clist.black;
}

class stopClock {
    __time(date = new Date()) {
        return date.getTime();
    }

    constructor(date = new Date()) {
        this.start = this.__time(date);
    }

    get stop() {
        return (this.__time() - this.start) / 1000;
    }
}

// Init
sc = new stopClock();
clog("info", "Log started at:", {
    color: flatc("green"),
    text: (new Date()).toString()
})