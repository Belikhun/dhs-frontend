//? |-----------------------------------------------------------------------------------------------|
//? |  /info.js                                                                                     |
//? |                                                                                               |
//? |  Copyright (c) 2018-2019 Belikhun. All right reserved                                         |
//? |  Licensed under the MIT License. See LICENSE in the project root for license information.     |
//? |-----------------------------------------------------------------------------------------------|

const APPNAME = "Deal Hunter Suite";
const CODENAME = "Nadeshiko";
const VERSION = "2.1";
const STATE = "release";

const AUTHOR = "Team DHS";
var   CONTACT_ADDR = "https://m.me/DealHunterSuite";

const SERVER_ADDR = {
    release: "https://dealhunter.000webhostapp.com",
    indev: "http://localhost"
}[STATE];

const API = {
    avatar: "/api/avatar",
    status: "/api/status",
    auth: "/api/auth",
    script: { list: "/api/scripts/list", fetch: "/api/scripts/fetch" },
    updates: { check: "/api/updates/check", latest: "/api/updates/latest", changelog: "/api/updates/changelog" }
}