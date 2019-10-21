//? |-----------------------------------------------------------------------------------------------|
//? |  /info.js                                                                                     |
//? |                                                                                               |
//? |  Copyright (c) 2018-2019 Belikhun. All right reserved                                         |
//? |  Licensed under the MIT License. See LICENSE in the project root for license information.     |
//? |-----------------------------------------------------------------------------------------------|

const APPNAME = "Deal Hunter Suite";
const DESCRIPTION = "Provide all the Tools needed for Sale Hunter!";
const CODENAME = "Nadeshiko";
const VERSION = "1.1";

const AUTHOR = "Team DHS";
// const SERVER_ADDR = "http://localhost";
const SERVER_ADDR = "https://dealhunter.000webhostapp.com";

const API = {
    avatar: "/api/avatar",
    status: "/api/status",
    auth: "/api/auth",
    script: { list: "/api/scripts/list", fetch: "/api/scripts/fetch" },
    updates: { check: "/api/updates/check", latest: "/api/updates/latest" }
}