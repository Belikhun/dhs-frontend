//? |-----------------------------------------------------------------------------------------------|
//? |  /mainPage/core.js                                                                            |
//? |                                                                                               |
//? |  Copyright (c) 2018-2020 Belikhun. All right reserved                                         |
//? |  Licensed under the MIT License. See LICENSE in the project root for license information.     |
//? |-----------------------------------------------------------------------------------------------|

try {
	const APPNAME = "Deal Hunter Suite";
	const CODENAME = "Nadeshiko";
	const VERSION = "4.3";
	const STATE = "release";
	
	const AUTHOR = "Team DHS";
	var   CONTACT_ADDR = "https://m.me/DealHunterSuite";
	
	const SERVER_LIST = {
		release: {
			master: {
				name: "Máy Chủ Chính (Đông Nam Á)",
				addr: "https://dealhuntersuite.com"
			},

			backup: {
				name: "Máy Chủ Dự Phòng (Bắc Mĩ)",
				addr: "https://dealhunter.000webhostapp.com"
			}
		},

		indev: {
			master: {
				name: "Máy Chủ Chính (Đông Nam Á)",
				addr: "https://dealhuntersuite.com"
			},

			backup: {
				name: "Máy Chủ Dự Phòng (Bắc Mĩ)",
				addr: "https://dealhunter.000webhostapp.com"
			},

			local: {
				name: "Máy Chủ Cục Bộ",
				addr: "http://localhost"
			}
		}
	}[STATE];

	const SERVER_ADDR = () => SERVER_LIST[cookie.get(`server.${STATE}`, "master")].addr
	
	const API = {
		avatar: "/api/avatar",
		server: "/api/server",
		auth: "/api/auth",
		script: { list: "/api/scripts/list", fetch: "/api/scripts/fetch" },
		updates: { check: "/api/updates/check", latest: "/api/updates/latest", changelog: "/api/updates/changelog" },
		analytics: { order: "/api/analytics/order" }
	}
	
	const core = {
		mainBox: $("#mainBox"),
		tool: {
			tracking: {
				container: $("#scriptPageInfo"),
				page: $("#scriptCurrentPage"),
				title: $("#scriptCurrentTitle"),
				tabID: $("#scriptCurrentTabId")
			},
			navbar: {
				clock: $("#navbarClock"),
				userName: $("#navbarUserName"),
				userTag: $("#navbarUserTag"),
				hamburger: $("#navbarHamburger"),
			},
			reloadBtn: $("#scriptReloadInfo"),
			announcement: $("#announcementBox")
		},
		script: {
			autorunList: $("#scriptAutorunList"),
			thisPageList: $("#scriptThisPageList"),
			undependList: $("#scriptUndependList"),
			availableList: $("#scriptAvailableList"),
			settings: {
				container: ("#scriptSettings"),
				header: {
					container: $("#scriptSettingsHeader"),
					message: $("#scriptSettingsHeaderMessage")
				},
				info: {
					container: $("#scriptSettingsInfo"),
					id: $("#scriptSettingsInfoId"),
					title: $("#scriptSettingsInfoTitle"),
					price: $("#scriptSettingsInfoPrice"),
					tags: $("#scriptSettingsInfoTags")
				},
				form: $("#scriptSettingsForm"),
				formList: $("#scriptSettingsFormList"),
				formCancel: $("#scriptSettingsFormCancel"),
				formSubmit: $("#scriptSettingsFormSubmit")
			},
			status: {
				container: $("#scriptRunStatus"),
				status: $("#scriptRunStatusStatus"),
				timer: $("#scriptRunStatusTimer"),
				bar: $("#scriptRunStatusBar"),
				barNow: $("#scriptRunStatusBarNow"),
				barEnd: $("#scriptRunStatusBarEnd"),
				price: $("#scriptRunStatusPrice"),
				current: $("#scriptRunStatusCurrent"),
				target: $("#scriptRunStatusTarget"),
				priceSaved: $("#scriptRunStatusPriceSaved"),
				itemStatus: $("#scriptRunStatusItemStatus"),
				checkDetail: $("#scriptRunStatusCheckDetail"),
				heartbeat: $("#scriptRunStatusHeartbeat")
			},
			cancelButton: $("#scriptRunCancel")
		},
		toolInfo: {
			container: $("#toolInfo"),
			name: $("#toolInfoName"),
			version: $("#toolInfoVersion"),
			codename: $("#toolInfoCodename"),
			copyright: $("#toolInfoCopyright"),
			button: {
				tos: $("#toolInfoTOS"),
				log: $("#toolInfoChangelog"),
				changeServer: $("#toolInfoChangeServer")
			},
			license: {
				container: $("#toolInfoLicense"),
				name: $("#toolInfoLicenseName"),
				tags: $("#toolInfoLicenseTags"),
				licenses: $("#toolInfoLicenses"),
				key: {
					button: $("#toolInfoLicenseKeyBtn"),
					container: $("#toolInfoLicenseKey"),
					key: $("#toolInfoLicenseKeyKey")
				},
			},
			author: $("#toolInfoAuthor")
		},
		server: (server) => (server) ? cookie.set(`server.${STATE}`, server) : cookie.get(`server.${STATE}`, "master"),
		scriptIniting: false,
		prevLayout: 0,
		TOSHtml: "",
		CLHtml: "",
		scriptList: {},
		info: {},
		session: {},
		page: {},
	
		authorList: [{
				name: "Belikhun",
				avatar: `${SERVER_ADDR() + API["avatar"]}?u=belivipro9x99`,
				link: `https://github.com/belivipro9x99`,
				role: [
					"Core Developer",
					"UI/UX Designer"
				]
			}, {
				name: "Toàn Te",
				avatar: `${SERVER_ADDR() + API["avatar"]}?u=kirk2711`,
				link: `https://www.facebook.com/HunterDealNo1`,
				role: [
					"Administrator",
					"License Manager",
					"Product Tester"
				]
			}
		],
	
		tagsColor: {
			vip: "#98ffa9",
			admin: "#fff57d",
			trial: "#eac8ff",
			tester: "#ffc6db",
			pro: "#a0ffe5"
		},

		async init() {
			__connection__.enabled = false;
	
			//? |-----------------------|
			//? |      SOUNDS INIT      |
			//? |-----------------------|
	
			splash.set({ p: 0, i: "Loading all the sounds thingy" });
			cookie.set("__s_m", true);
			await sounds.init();
	
			//? |-----------------------|
			//? |      POPUP INIT       |
			//? |-----------------------|
	
			splash.set({ p: 10, i: "Preparing infoPopup" });
			await popup.init();
	
			//? |-----------------------|
			//? |     TOOLINFO INIT     |
			//? |-----------------------|
	
			splash.set({ p: 20, i: "Preparing Tool Info Panel" });
			
			this.toolInfo.name.innerText = APPNAME;
			this.toolInfo.version.innerText = VERSION;
			this.toolInfo.codename.innerText = CODENAME;
			this.toolInfo.copyright.innerHTML = `Copyright © 2019-2020 ${AUTHOR}. All right reserved`;
	
			this.toolInfo.button.tos.addEventListener("mouseup", () => {
				let tosNode = document.createElement("div");
				tosNode.innerHTML = this.TOSHtml;

				popup.show({
					title: "Điều Khoản Sử Dụng",
					message: "Deal Hunter Suite",
					description: "Updated at 30/10/2019 22:39:00 GMT",
					level: "info",
					customNode: tosNode
				})
			})

			this.toolInfo.button.log.addEventListener("mouseup", () => {
				let logNode = document.createElement("div");
				logNode.innerHTML = this.CLHtml;

				popup.show({
					title: "Changelog",
					message: `Version ${VERSION}`,
					description: "",
					level: "info",
					customNode: logNode
				})
			})

			this.toolInfo.button.changeServer.addEventListener("mouseup", () => this.changeServer());
			this.toolInfo.license.container.dataset.triColor = "red";
			this.toolInfo.license.name.innerText = `Bạn chưa đăng nhập`;
			this.toolInfo.license.key.key.innerText = "KHÔNG RÕ";
	
			for (let item of this.authorList) {
				let container = document.createElement("span");
				container.classList.add("item");
	
				let avatarDiv = document.createElement("div");
				avatarDiv.classList.add("lazyload", "avatar");
	
				let avatar = document.createElement("img");
				avatar.onload = e => e.target.parentNode.dataset.loaded = 1;
				avatar.src = item.avatar;
	
				let spinner = document.createElement("div");
				spinner.classList.add("simple-spinner");
	
				avatarDiv.append(avatar, spinner);
	
				let link = document.createElement("a");
				link.classList.add("authorName");
				link.href = item.link;
				link.target = "_blank";
				link.innerText = item.name;
	
				container.append(avatarDiv, link);
	
				for (let role of item.role) {
					let text = document.createElement("t");
					text.classList.add("authorInfo");
					text.innerText = role;
					container.append(text);
	
					delete text;
				}
	
				this.toolInfo.author.append(container);
	
				delete container;
				delete avatarDiv;
				delete spinner;
				delete link;
			}
	
			this.tool.navbar.hamburger.addEventListener("mouseup", e => {
				let l = this.mainBox.dataset.layout;
	
				if (l == 7) {
					this.tool.navbar.hamburger.classList.remove("active");
					this.changeLayout("back");
				} else {
					this.tool.navbar.hamburger.classList.add("active");
					this.changeLayout(7);
				}
			})
	
			//? |-----------------------|
			//? |   SERVER COMM CHECK   |
			//? |-----------------------|
	
			while (true) {
				splash.set({ p: 30, i: "Kiểm tra kết nối tới máy chủ" });
				let serverStatus = {}

				try {
					serverStatus = await myajax({
						url: SERVER_ADDR() + API.server,
						method: "GET"
					})
				} catch(e) {
					splash.errored();
					if (await popup.show({
						title: "Không thể kết nối tới máy chủ",
						message: `Máy chủ hiện tại: ${STATE}.${this.server()}`,
						description: "Xin lỗi! Hiện tool không thể kết nối tới máy chủ. Vui lòng thử lại sau ít phút hoặc chọn máy chủ khác",
						level: "offline",
						buttonList: {
							retry: { text: "Kết nối lại", color: "green" },
							switchServer: { text: "Đổi Máy Chủ", color: "blue" },
							contact: { text: "Báo lỗi", color: "pink", full: true, resolve: false, onClick: () => window.open("http:\/\/m.me\/HunterDealJustFun", "_blank") }
						}
					}) === "switchServer")
						await this.changeServer({ reAuth: false })

					continue;
				}

				this.info = serverStatus.data;
				break;
			}
	
			CONTACT_ADDR = this.info.contact;
	
			if (this.info.EXTENSION_ANNOUNCEMENT.enabled === true) {
				let a = this.info.EXTENSION_ANNOUNCEMENT;
	
				let aBox = document.createElement("div");
				aBox.classList.add("note", a.level);
	
				let aBoxInner = document.createElement("div");
				aBoxInner.classList.add("inner");
				aBoxInner.innerHTML = a.message;
	
				aBox.appendChild(aBoxInner);
				this.tool.announcement.appendChild(aBox);
			}
	
			splash.set({ p: 40, i: "Fetching TOS" });
			this.TOSHtml = await myajax({
				url: SERVER_ADDR() + "/tos.php",
				method: "GET",
				type: "text",
				force: true,
				reRequest: false
			})
			$("#tutorialPageTOS").innerHTML = this.TOSHtml;
	
	
			splash.set({ p: 45, i: "Fetching changelog" });
			this.CLHtml = await myajax({
				url: SERVER_ADDR() + API.updates.changelog,
				method: "GET",
				type: "text",
				force: true,
				reRequest: false
			})
	
			if (this.info.EXTENSION_VERSION !== VERSION) {
				let changelogNode = document.createElement("div");
				changelogNode.innerHTML = this.CLHtml;
	
				await popup.show({
					title: "Đã có phiên bản mới!",
					message: `Version ${this.info.EXTENSION_VERSION}`,
					description: `Vui lòng cập nhật bằng link dưới hoặc liên hệ Admin để được hỗ trợ!`,
					level: "warning",
					bgColor: "yellow",
					headerTheme: "dark",
					note: `<b>Lưu ý: </b>Tool có thể sẽ chạy không ổn định nếu bạn bỏ qua bản cập nhật này!`,
					customNode: changelogNode,
					buttonList: {
						downZip: { text: "Tải về (zip)", color: "green", resolve: false, onClick: () => window.open(SERVER_ADDR() + API.updates.latest + "?type=zip", "_blank") },
						downCrx: { text: "Tải về (crx)", color: "blue", resolve: false, onClick: () => window.open(SERVER_ADDR() + API.updates.latest + "?type=crx", "_blank") },
						contact: { text: "Hỗ trợ", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") },
						continue: { text: "Tiếp tục chạy!", color: "yellow" }
					}
				})
			}
	
			//? |-----------------------|
			//? |     GENERATE UUID     |
			//? |-----------------------|
	
			splash.set({ p: 50, i: "Generating Client UUID" });
			window.XHR = randString(randBetween(12, 32, true));
	
			//! ======================================= MAIN KEY GENERATOR =======================================
	
			let cpu = await this.__getCPUInfo();
			let ram = await this.__getRAMInfo();
			let disk = await this.__getDiskInfo();
			let keyString = "";
			let diskCap = 0;
	
			for (let item of disk)
				if (item.type === "fixed")  {
					diskCap = item.capacity;
					break;
				}
	
			// Get raw key
			keyString = [
				cpu.archName,
				cpu.features.join("."),
				cpu.modelName,
				cpu.numOfProcessors,
				ram.capacity,
				diskCap
			].join(":");
	
			// encode as UTF-8
			const msgBuffer = new TextEncoder("utf-8").encode(keyString);                    
			const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
			const hashArray = Array.from(new Uint8Array(hashBuffer));            
			const hashHex = hashArray.map(b => ("00" + b.toString(16)).slice(-2)).join("");
	
			this[window.XHR] = hashHex;
	
			//! ======================================= MAIN KEY GENERATOR =======================================
	
			//? |-----------------------|
			//? |     LICENSE CHECK     |
			//? |-----------------------|
	
			splash.set({ p: 60, i: "Đang kiểm tra bản quyền" });
			while (!await this.auth()) { clog("ERRR", "Auth failed. Retrying") }
	
			let tagsString = "";
			for (let item of this.session.keyData.tags)
				tagsString += `<tag ${(typeof this.tagsColor[item.toLowerCase()] === "string") ? `style="background-color: ${this.tagsColor[item.toLowerCase()]}"` : ""}>${item}</tag>`;
			
			this.tool.navbar.userName.innerText = this.session.keyData.name;
			this.tool.navbar.userTag.innerHTML = tagsString;
			delete tagsString;
	
			this.toolInfo.license.container.dataset.triColor = "blue";
			this.toolInfo.license.name.innerText = this.session.keyData.name;
			this.toolInfo.license.tags.innerHTML = tagsString;
			let timerNodes = [];
	
			for (let item of this.session.keyData.licenses) {
				let container = document.createElement("div");
				container.classList.add("license");
	
				let allow = document.createElement("t");
				allow.classList.add("allow");
				allow.innerText = item.allow.split(";").join(", ");
	
				let timeDesc = document.createElement("t");
				timeDesc.classList.add("timeDesc");
				timeDesc.innerText = "Hiệu Lực Còn";
	
				let timer = document.createElement("timer");
				timer.innerText = "INITIALIZING";
	
				container.append(allow, timeDesc, timer);
				this.toolInfo.license.licenses.appendChild(container);
				timerNodes.push({ desc: timeDesc, time: timer, expire: item.expire });
	
				delete container;
				delete allow;
			}
	
			this.toolInfo.license.key.button.addEventListener("mouseup", async e => {
				let response = await popup.show({
					title: "Xác Nhận",
					message: "Hiển Thị License Key",
					description: `Bạn có chắc muốn hiển thị key bản quyền của bạn không?`,
					note: `<b>Tuyệt đối không chia sẻ key cho người khác!</b><br><br>Nếu chúng tôi phát hiện key của bạn bị rò rỉ ra ngoài, chúng tôi sẽ tiến hành <b>khóa key của bạn vô điều kiện</b> và <b>từ chối mọi trách nhiệm liên quan!<b/>`,
					noteLevel: "warning",
					level: "confirm",
					buttonList: {
						confirm: { text: "Xác Nhận", color: "pink" },
						close: { text: "Đóng", color: "blue" }
					}
				});
	
				if (response === "confirm") {
					this.toolInfo.license.key.key.innerText = this.session.keyData.key;
					this.toolInfo.license.container.dataset.triColor = "red";
				}
	
				delete warningNode;
				delete response;
			});
	
			this.frame.add(() => {
				if (this.toolInfo.container.classList.contains("optimize"))
					return;
				
				let now = time();
	
				for (let item of timerNodes) {
					let remain = item.expire - now;
					let parsed = parseTime(remain % 86400, { showPlus: true });
	
					if (remain < 0 && item.triggered !== true) {
						item.desc.innerText = "Đã Hết Hạn";
						item.time.dataset.color = "red";
						this.toolInfo.license.container.dataset.triColor = "purple";
						item.triggered = true;
					}
	
					item.time.innerHTML = `<days>${Math.floor(remain / 86400)}</days>${parsed.str}<ms>${parsed.ms}</ms>`;
	
					delete remain;
					delete parsed;
				}
	
				delete now;
			});
	
			_gaq.push(["_trackEvent", this.session.keyData.name, "auth"]);
	
			//? |-----------------------|
			//? |     TAB COMM CHECK    |
			//? |-----------------------|
	
			splash.set({ p: 70, i: "Kiểm tra liên lạc với trang hiện tại" });
			let commCheck = {}
			try {
				commCheck = await this.sendCommand("status");
			} catch(e) {
				clog("ERRR", "COMM Check Failed!");
				//! Ignore this Error
			} finally {
				clog("DEBG", "Page communication check result:", commCheck);
			}
	
			//? |-----------------------|
			//? |   FETCH SCRIPT LIST   |
			//? |-----------------------|
	
			splash.set({ p: 80, i: "Lấy thông tin danh sách script" });
			await this.fetchScriptList();
	
			//? |----------------------------------|
			//? |    ATTACH LISTENER / INTERVAL    |
			//? |----------------------------------|
	
			splash.set({ p: 85, i: "Setting up Listeners" });
			chrome.tabs.onUpdated.addListener((t, c) => this.checkPage(t, c));
			this.tool.reloadBtn.addEventListener("mouseup", e => this.reload({ hard: true }));
	
			//? |-----------------------|
			//? |    INIT LOGSVIEWER    |
			//? |-----------------------|
	
			splash.set({ p: 90, i: "Inititlizing logsViewer" });
			this.logsViewer.init();
	
			splash.set({ p: 95, i: "Starting frameRenderer" });
			this.frame.init();
	
			// NAVBAR CLOCK
			this.frame.add(() => {
				let date = new Date();
				let day = ["CN", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7"][date.getDay()];
				let h = pleft(date.getHours(), 2);
				let m = pleft(date.getMinutes(), 2);
				let s = pleft(date.getSeconds(), 2);
				let ms = pleft(date.getMilliseconds(), 3);
	
				this.tool.navbar.clock.innerHTML = `<sub>${day}</sub>${h}:${m}:${s}<ms>${ms}</ms>`;
	
				delete date;
				delete day;
				delete h;
				delete m;
				delete s;
				delete ms;
			});
	
			//? |-----------------------|
			//? |       END INIT        |
			//? |-----------------------|
	
			splash.set({ p: 100, i: "Initialized" });
			clog("OKAY", "Initialized");
			_gaq.push(["_trackEvent", this.session.keyData.name, "initialized", "core.js Initialized"]);
			
			if (!(await this.dataLoad("licensed")).licensed) {
				tutorial.init();
				sounds.confirm(0);
				await tutorial.play();
				clog("INFO", "Tutorial Ended");
	
				await this.dataSave({ licensed: true });
				await delayAsync(600);
			}
			
			this.changeLayout(3);
		},

		async changeServer({
			title = "Đổi máy chủ",
			message = `Máy chủ hiện tại: ${STATE}.${this.server()}`,
			description = `${SERVER_ADDR()}`,
			reAuth = true
		} = {}) {
			let container = document.createElement("div");

			for (let key of Object.keys(SERVER_LIST)) {
				let item = SERVER_LIST[key];

				let sw = createSwitch({
					label: item.name,
					color: (key === "master") ? "pink" : "blue",
					value: (this.server() === key),
					type: "radio"
				})

				sw.input.name = `serverSelect`;
				sw.input.required = true;
				sw.input.value = key;
				container.appendChild(sw.group);
			}

			if (await popup.show({
				windowTitle: "Server Changer",
				title,
				message,
				description,
				level: "info",
				icon: "server",
				bgColor: "blue",
				headerTheme: "light",
				customNode: container,
				buttonList: {
					cancel: { text: "Hủy", color: "red" },
					confirm: { text: "Xác Nhận", color: "green" }
				}
			}) !== "confirm")
				return;

			let selected = container.querySelector(`input[name="serverSelect"]:checked`).value;
			clog("INFO", "Server Selected:", { text: selected, color: flatc("red") });

			if (this.server() === selected)
				return;

			this.server(selected);

			if (reAuth)
				location.reload();
		},
 	
		frame: {
			__t: document.title,
			list: [],
			tick: 0,
	
			init() {
				this.render();
				setInterval(() => this.updateTPS(), 1000);
			},
	
			async render() {
				for (let i of this.list)
					await i();
	
				this.tick++;
				requestAnimationFrame(() => this.render());
			},
	
			add(handler) {
				if (typeof handler === "function") {
					this.list.push(handler);
					return this.list.length - 1;
				} else
					throw new Error(`frame.add: expect handler are a function, instead got ${typeof handler}`);
			},
	
			remove(id) {
				if (!this.list[id])
					throw new Error(`frame.remove: ID not found: ${id}`);
	
				this.list.splice(id, 1);
			},
	
			updateTPS() {
				document.title = `${this.__t} [${this.tick} TPS]`;
	
				if (this.tick < 10) {
					// OPTIMIZE
					core.logsViewer.clear(false);
	
					let _a = document.getElementsByClassName("triBgContainer");
					for (let item of _a)
						emptyNode(item);
				}
	
				this.tick = 0;
			}
		},
	
		logsViewer: {
			clearBtn: $("#scriptRunLogsClear"),
			title: $("#scriptRunLogsTitle"),
			log: $("#scriptRunLogsView"),
			toBottomBtn: $("#scriptRunLogsBottom"),
			lockLogs: true,
			limits: 200,
			line: 1,
	
			init() {
				this.log.addEventListener("scroll", (e) => {
					if (e.target.scrollTop >= (e.target.scrollHeight - e.target.offsetHeight))
						this.toBottom();
					else {
						this.toBottomBtn.classList.add("show");
						this.lockLogs = false;
					}
				});

				this.toBottomBtn.addEventListener("click", () => this.toBottom());
				this.clearBtn.addEventListener("mouseup", (e) => this.clear());
			},
	
			setTitle(title) {
				this.title.innerHTML = title;
			},
	
			write(text) {
				let logItem = document.createElement("li");
				logItem.innerHTML = `<l>${this.line}</l>${text}`;
	
				this.log.appendChild(logItem);
				this.line++;
	
				if (this.lockLogs)
					this.toBottom();
			},

			toBottom() {
				this.toBottomBtn.classList.remove("show");
				this.lockLogs = true;

				while (this.log.childElementCount > this.limits)
					this.log.removeChild(this.log.children[0]);

				this.log.scrollTop = this.log.scrollHeight;
			},
	
			clear(resetLine = true) {
				emptyNode(this.log);

				if (resetLine)
					this.line = 1;
			}
		},

		async sendBeacon({
			script,
			name,
			link,
			price,
			count,
			runPrice = null,
			oldPrice = null,
			note = null,
			thumbnail = null
		}) {
			if (!script || !name || !link || typeof price !== "number" || typeof count !== "number") {
				clog("WARN", "Beacon Data Invalid. Refuse To Send Beacon!");
				return false;
			}

			try {
				await myajax({
					url: SERVER_ADDR() + API.analytics.order,
					method: "POST",
					form: {
						token: this.session.token,
						script,
						name,
						link,
						price,
						count,
						runPrice,
						oldPrice,
						note,
						thumbnail
					}
				});
			} catch(e) {
				errorHandler(e);
				return false;
			}

			return true;
		},
	
		async checkPage(tabId, changeInfo) {
			if (tabId !== this.page.id)
				return;
	
			if (changeInfo.url)
				changeInfo.url = new URL(changeInfo.url);
	
			let doScriptListReload = ((typeof changeInfo.status === "string") && (this.page.status !== changeInfo.status))
			this.page = Object.assign(this.page, changeInfo);
			this.updatePageInfo();
			await this.reload({ reloadScriptList: doScriptListReload });
	
			clog("DEBG", {
				text: `tabID ${tabId}`,
				padding: 10,
				seperate: true,
				color: flatc("gray")
			}, `scriptReload = ${doScriptListReload}`, changeInfo);
		},
	
		updatePageInfo() {
			this.tool.tracking.page.innerText = this.page.url.hostname;
			this.tool.tracking.title.innerText = this.page.title;
	
			this.tool.tracking.tabID.innerText = this.page.id || "Không Rõ";
		},
	
		findTarget() {
			return new Promise((resolve, reject) => {
				chrome.tabs.query({
					currentWindow: false,
					active: true,
					url: [`http://*/*`, `https://*/*`]
				}, (tabs) => {
					if (!tabs[0]) {
						reject({ code: -1, description: "Vui lòng khởi động tool trên 1 trang web!" });
						
						this.page = {
							url: {
								hostname: "Không Thể Liên Lạc Tới Tab Hiện Tại",
								pathname: "/"
							},
							title: "Vui lòng đi tới 1 trang web và nhấn nút làm mới để kết nối lại",
							id: null
						}
	
						this.updatePageInfo();
						return;
					}
	
					this.page = tabs[0];
	
					if (this.page.url)
						this.page.url = new URL(this.page.url);
	
					this.updatePageInfo();
					resolve();
				});
			})
		},
	
		async sendCommand(command = "status", data = Array()) {
			if (!this.page.id)
				try {
					await this.findTarget();
				} catch(e) {
					clog("ERRR", e);
					return new Promise((resolve, reject) => reject(e));
				}
	
			return new Promise((resolve, reject) => {
				chrome.tabs.sendMessage(this.page.id, { action: command, data: data }, response => {
					if (typeof response === "undefined") {
						let res = { code: -1, description: `No response from sending command: "${command}"`, data: {} }
						
						if (command === "status")
							res.description = `Không thể liên lạc với tab hiện tại! Vui lòng tải lại tab và thử lại`
	
						if (chrome.runtime.lastError)
							res.data = chrome.runtime.lastError;
	
						reject(res)
						return;
					}
	
					if (response.code !== 0) {
						reject(response);
						return;
					}
	
					clog("DEBG", `Response from command ${command}:`, response);
					resolve(response);
					return;
				});
			})
		},
	
		getCookie(url, name) {
			return new Promise((resolve, reject) => {
				chrome.cookies.get({ url, name }, data => resolve(data));
	
				if (chrome.runtime.lastError)
					reject(chrome.runtime.lastError);
			})
		},
	
		async fetchScriptList(hard = false) {
			if (hard || Object.keys(this.scriptList).length === 0) {
				let res = await myajax({
					url: SERVER_ADDR() + API.script.list,
					method: "POST",
					form: { token: this.session.token }
				})
				
				this.scriptList = res.data;
			}
	
			clog("DEBG", "Call to fetchScriptList", `hard = ${hard}`);
	
			// RESET
			if (this.page.status !== "complete" || hard)
				await this.autorun.stopAll();
	
			emptyNode(this.script.thisPageList);
			emptyNode(this.script.undependList);
			emptyNode(this.script.availableList);
	
			for (let key of Object.keys(this.scriptList)) {
				let item = this.scriptList[key];
	
				// AUTORUN INIT
				if (item.autorun) {
					if (
							(!this.autorun.running[item.id] || hard)
						&& 	(
								item.match === "all"
							||	item.match === "*"
							||	(new RegExp(item.match)).test(this.page.url.hostname + this.page.url.pathname)
						)
					)
						this.autorun.init(item);
				
					continue;
				}
	
				let itemBox = document.createElement("div");
				itemBox.classList.add("item");
	
				if (!item.allow)
					itemBox.setAttribute("disabled", "");
	
				itemBox.innerHTML = `
					<span class="left">
						<t class="name">${item.name}</t>
						<t class="description">${item.description}</t>
					</span>
					<span class="right">
						<t class="id">${item.id}</t>
						<t class="version">v${pleft(item.version, 3)}</t>
					</span>
				`
	
				itemBox.title = [
					`ID: ${item.id}`,
					`Tên: ${item.name}`,
					`Trang: ${item.site}`,
					`Phiên Bản: ${item.version}`,
					item.allow ? `Click Để Chạy!` : `Bạn KHÔNG CÓ QUYỀN chạy Script này!`
				].join("\n");
	
				if (item.match === "all" || item.match === "*") {
					if (item.allow) {
						itemBox.dataset.soundhover = "";
						itemBox.dataset.soundselect = "";
						sounds.applySound(itemBox);
	
						itemBox.dataset.target = item.id;
						itemBox.addEventListener("click", e => this.scriptInit(e.currentTarget.dataset.target));
					}
	
					this.script.undependList.appendChild(itemBox);
				} else if ((new RegExp(item.match)).test(this.page.url.hostname + this.page.url.pathname)) {
					if (item.allow) {
						itemBox.dataset.soundhover = "";
						itemBox.dataset.soundselect = "";
						sounds.applySound(itemBox);
	
						itemBox.dataset.target = item.id;
						itemBox.addEventListener("click", e => this.scriptInit(e.currentTarget.dataset.target));
					}
	
					this.script.thisPageList.appendChild(itemBox);
				}
	
				this.script.availableList.appendChild(itemBox.cloneNode(true));
			}
	
			if (this.page.status === "complete")
				this.autorun.runAll();
		},
	
		changeLayout(id) {
			if (id === "back")
				id = this.prevLayout;
	
			let pId = parseInt(this.mainBox.dataset.layout) || 0;
			this.prevLayout = pId;
	
			if (pId <= id)
				sounds.toggle(0);
			else
				sounds.toggle(1);
	
			// Optimize unused layout
			let layoutToOptimize = document.querySelectorAll(`[data-optimize-target="${pId}"]`);
			for (let item of layoutToOptimize)
				setTimeout(() => { item.classList.add("optimize"); }, 300);
	
			// UnOptimize unused layout
			let layoutToUnOptimize = document.querySelectorAll(`[data-optimize-target="${id}"]`);
			for (let item of layoutToUnOptimize)
				item.classList.remove("optimize");
	
			// Find and unload previous triBg
			let prevTriContainer = document.querySelectorAll(`[data-tri-layout="${pId}"]`);
			for (let item of prevTriContainer) {
				let box = fcfn(item, "triBgContainer");
				emptyNode(box);
	
				delete box;
			}
	
			// Load current layout's triBg
			let triContainer = document.querySelectorAll(`[data-tri-layout="${id}"]`);
			for (let item of triContainer)
				triBg(item, {
					color: item.dataset.triColor || "gray",
					triangleCount: item.dataset.triCount || 16
				})
	
			this.mainBox.dataset.layout = id;
			delete pId;
			delete layoutToOptimize;
			delete layoutToUnOptimize;
			delete prevTriContainer;
			delete triContainer;
		},
	
		subScreen: {
			container: $("#subScreen"),
	
			show(node = document.createElement("span"), layout = "blank") {
				emptyNode(this.container);
				this.container.setAttribute("layout", layout);
				this.container.append(...node.childNodes);
				window.resizeTo(1340, window.outerHeight);
				this.container.classList.add("show");
			},
	
			hide() {
				this.container.classList.remove("show");
				emptyNode(this.container);
				window.resizeTo(420, window.outerHeight);
			}
		},
	
		dataSave(data) {
			return new Promise((resolve, reject) => {
				chrome.storage.local.set(data, (res) => {
					clog("OKAY", "Data saved into chrome storage", data);
					resolve(res);
				});
			})
		},
	
		dataLoad(...key) {
			return new Promise((resolve, reject) => {
				chrome.storage.local.get(key, (res) => {
					clog("INFO", "Fetch data from chrome storage success", res);
					resolve(res);
				});
			})
		},
	
		async reload({ hard = false, reloadScriptList = true }) {
			if (hard)
				await this.findTarget();
	
			if (reloadScriptList)
				await this.fetchScriptList(hard);
		},
	
		async scriptInit(id) {
			if (this.scriptIniting)
				return false;
	
			this.scriptIniting = true;
			clog("INFO", "Call to scriptInit ScriptID", id);
			_gaq.push(["_trackEvent", this.session.keyData.name, "runScript", id]);
	
			this.logsViewer.setTitle(`NHẬT KÍ CHẠY: <i>${id}</i>`);
			this.changeLayout(4);
			sounds.confirm();
	
			this.script.settings.header.message.innerText = "Đang khởi chạy";
			let response = {}
	
			try {
				response = await myajax({
					url: SERVER_ADDR() + API.script.fetch,
					method: "POST",
					form: {
						id: id,
						token: this.session.token
					}
				});
			} catch(e) {
				this.scriptIniting = false;
				await errorHandler(e);
				this.changeLayout(3);
				return;
			}

			// DECRYPT SCRIPT
			let decryptedScript = "";

			try {
				let decrypted = CryptoJS.AES.decrypt(
					{ ciphertext: CryptoJS.enc.Base64.parse(response.data.script) },
					CryptoJS.HmacSHA256(this.session.token + response.data.iv, this.session.keyData.key),
					{
						mode: CryptoJS.mode.CBC,
						padding: CryptoJS.pad.Pkcs7,
						iv: CryptoJS.enc.Hex.parse(response.data.iv)
					}
				);

				decryptedScript = decrypted.toString(CryptoJS.enc.Utf8);
			} catch(e) {
				errorHandler({ code: 69420, description: `Lỗi khi giải mã dữ liệu: ${e.message} 🤔\n🐶: *sniff *sniff`, stack: e.stack });
				return;
			}

			// A little cooldown
			await delayAsync(500);
			this.scriptIniting = false;
	
			(async () => {
				/* javascript-obfuscator:disable */
				var scriptCancelHandler = async () => {}
				var scriptStopped = false;
				const onCancel = (f) => scriptCancelHandler = f;
				const SCRIPT = this.scriptList[id];
	
				const info = async ({
					id = null,
					title = null,
					price = null,
					tags = null,
					hide = false
				} = {}) => {
					this.script.settings.info.container.dataset.hide = hide;
	
					if (id !== null)
						this.script.settings.info.id.innerText = id;
	
					if (title !== null)
						this.script.settings.info.title.innerText = title;
	
					if (price !== null)
						this.script.settings.info.price.innerText = price;
	
					if (tags !== null)
						this.script.settings.info.tags.innerHTML = tags.map(i => `<tag>${i}</tag>`).join("");
				}
	
				const setup = async (settingList, { confirm = "Bắt đầu", cancel = "Hủy", enableSave = true, saveKey = null } = {}) => {
					return new Promise(async (resolve, reject) => {
						emptyNode(this.script.settings.formList);
						const dataSaveKey = `settings.${id}${(typeof saveKey === "string" ? `.${saveKey}` : ``)}`
						let savedSettings = {}
	
						// Load saved settings
						if (enableSave)
							savedSettings = (await this.dataLoad(dataSaveKey))[dataSaveKey] || {};
	
						for (let key of Object.keys(settingList)) {
							let item = settingList[key];
							let input = null;
	
							if (enableSave && typeof savedSettings[key] !== "undefined" && item.save !== false)
								if (item.type === "radio") {
									for (let i of item.list)
										if (i.value === savedSettings[key])
											i.checked = true;
										else
											i.checked = false;
								} else
									item.value = savedSettings[key];
	
							if (["text", "textarea", "number", "date", "time"].includes(item.type)) {
								input = createInput({
									type: item.type,
									id: `scriptSetting_${key}`,
									label: item.label,
									value: (typeof item.value !== "undefined") ? item.value : "",
									required: item.required || false,
									color: "light"
								});
	
								if (item.height)
									input.input.style.height = item.height;
	
								if (item.step)
									input.input.step = item.step;
	
								if (["date", "time"].includes(item.type)) {
									let btnNow = createBtn("Bây Giờ", "dark");
									btnNow.style.marginLeft = "10px";
	
									input.input.step = (typeof item.step === "number") ? item.step : 1;
									let now = new Date();
	
									if (item.type === "date")
										btnNow.addEventListener("mouseup",
											e => input.input.value = [
												now.getFullYear(),
												now.getMonth() + 1,
												now.getDate()
											].map(v => v < 10 ? "0" + v : v)
												.join("-")
										)
									else if (item.type === "time")
										btnNow.addEventListener("mouseup",
											e => input.input.value = [
												now.getHours(),
												now.getMinutes(),
												now.getSeconds()
											].map(v => v < 10 ? "0" + v : v)
												.join(":")
										)
	
									input.group.appendChild(btnNow);
								}
							}
	
							else if (item.type === "note") {
								let group = document.createElement("div");
								group.classList.add("note", item.level || "info");
								
								let inner = document.createElement("div");
								inner.classList.add("inner");
								inner.innerHTML = item.text;
	
								group.appendChild(inner);
								input = { group: group }
							}
	
							else if (item.type === "customNode") {
								item.node.classList.add("customNode");
								input = { group: item.node }
							}
							
							else if (item.type === "checkbox") {
								input = createSwitch({
									label: item.label,
									color: item.color || "pink",
									value: item.value || false
								});
								
								if (typeof item.disabled !== "undefined")
									input.input.disabled = item.disabled;
							}
	
							else if (item.type === "switch") {
								input = { input: null }
	
								if (!settingList[item.name])
									settingList[item.name] = {
										type: "switch",
										inputList: {},
										changeHandler: [],
										onChange(key, f = () => {}) { this.changeHandler.push({ key: key, f: f }) },
										triggerChange(e) {
											clog("DEBG", "Switch Change", e);
											for (let h of this.changeHandler)
												h.f({ ...e, target: this.inputList[h.key] });
										},
										getValue() {
											for (let key of Object.keys(this.inputList))
												if (this.inputList[key].checked === true)
													return this.inputList[key].value;
										}
									}
								
								let _i = createSwitch({
									label: item.label,
									color: item.color || "blue",
									value: item.value || false,
									type: "radio"
								});
								_i.input.addEventListener("change", e => settingList[item.name].triggerChange(e));
								_i.input.name = item.name;
								_i.input.value = key;
	
								settingList[item.name].inputList[key] = _i.input;
								input.group = _i.group;
							}
	
							else if (item.type === "radio") {
								let defValue = item.type.default || null;
								let group = document.createElement("div");
								group.classList.add("radioGroup");
								let label = document.createElement("span");
								label.classList.add("label");
								label.innerHTML = item.label;
								group.appendChild(label);
	
								for (let _i of item.list) {
									let btn = createSwitch({
										label: _i.name,
										color: _i.color || "blue",
										value: _i.checked || false,
										type: "radio"
									});
									btn.input.name = `ssr_${key}`;
									btn.input.value = _i.value;
									btn.input.required = item.required || false;
									group.appendChild(btn.group);
								}
	
								input = {
									group: group,
									input: {
										name: `ssr_${key}`,
										list: item.list,
										getValue: () => {
											let _e = document.querySelector(`input[name=ssr_${key}]:checked`);
											return (_e) ? _e.value : defValue;
										}
									}
								}
							}
							
							else
								reject({ code: -1, description: "Unknown item type when Script preparing settings value: " + item.type, data: item })
						
							this.script.settings.formList.appendChild(input.group);
	
							if (input.input)
								settingList[key].inputElement = input.input;
							else
								delete settingList[key];
						}
	
						//* DEPEND HANDLER AND SANITIZER
						for (let key of Object.keys(settingList)) {
							let item = settingList[key];
	
							if (item.depend) {
								let _t = item;
								let _i = item.inputElement;
	
								let _o = _t.depend.split(":");
								if (_o.length === 2) {
									_i.disabled = (!settingList[_o[0]].inputList[_o[1]].checked) ^ (_t.doubt || false);
									settingList[_o[0]]
										.onChange(_o[1], e => { _i.disabled = (!e.target.checked) ^ (_t.doubt || false) });
								} else {
									_i.disabled = (!settingList[_t.depend].inputElement.checked) ^ (_t.doubt || false);
									settingList[_t.depend]
										.inputElement
										.addEventListener("change", e => { _i.disabled = (!e.target.checked) ^ (_t.doubt || false) });
								}
							}
						}
	
						this.script.settings.formSubmit.innerText = confirm;
						this.script.settings.formCancel.innerText = cancel;
						this.script.settings.formCancel.onmouseup = e => { scriptCancelHandler(true); this.changeLayout(3) }
						this.changeLayout(5);
	
						// Form submit action
						this.script.settings.form.onsubmit = async (e) => {
							e.preventDefault();
							let returnData = {}
							let saveType = ["text", "textarea", "number", "date", "time", "checkbox", "radio"]
							let saveSettings = {}
							
							for (let key of Object.keys(settingList)) {
								let item = settingList[key];
	
								if (item.type === "number")
									returnData[key] = parseInt(item.inputElement.value);
								else if (item.type === "checkbox")
									returnData[key] = item.inputElement.checked;
								else if (item.type === "radio")
									returnData[key] = item.inputElement.getValue();
								else if (item.type === "switch")
									returnData[key] = item.getValue();
								else if (item.type === "note" || item.type === "customNode")
									continue;
								else
									returnData[key] = item.inputElement.value;
	
								// Save Settings
								if (enableSave && saveType.includes(item.type) && item.save !== false)
									saveSettings[key] = returnData[key];
							}
	
							if (enableSave)
								await this.dataSave({ [dataSaveKey]: saveSettings });
							
							// Run layout init
							sounds.confirm(1);
							this.changeLayout(4);
							resolve(returnData);
							clog("INFO", "Script settings Submitted");
						}
	
						this.script.settings.formList.scrollTop = 0;
					});
				}
	
				const heartbeat = ({ color = "green", beat = true } = {}) => {
					if (color && typeof color === "string")
						this.script.status.heartbeat.dataset.color = color;
	
					this.script.status.heartbeat.style.animation = "none";
					
					if (beat) {
						//? Trigger Reflow
						this.script.status.heartbeat.offsetHeight;
						this.script.status.heartbeat.style.animation = null;
					}
				}
	
				const rejectSetup = async (reason) => {
					await scriptCancelHandler(true);

					heartbeat({ color: "red", beat: false });
					await popup.show({
						windowTitle: id,
						title: "Đã dừng phản hồi!",
						message: "Script Rejected Setup",
						description: reason,
						level: "warning",
						buttonList: {
							contact: { text: "Báo Lỗi", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") },
							back: { text: "Quay lại", color: "green" },
						}
					});
	
					this.changeLayout(3);
					scriptStopped = true;
				}
	
				const triggerError = async (error) => {
					await scriptCancelHandler(true);
					
					heartbeat({ color: "red", beat: false });
					await errorHandler(error, true);
					this.changeLayout(3);
					scriptStopped = true;
				}
	
				const errored = async (message) => {
					await scriptCancelHandler(true);

					heartbeat({ color: "red", beat: false });
					sounds.warning();
	
					this.script.status.container.dataset.triColor = "darkRed";
					writeLog("============ LỖI! ============");
					writeLog(message);
					runInfo({
						status: "Có lỗi đã xảy ra!",
						progress: 100,
						itemStatus: message,
						itemStatusColor: "red",
						checkDetail: "Mở Console để biết thêm chi tiết"
					});
				}
	
				const preRunInit = async () => {
					// Reset the info layout
					this.script.status.container.dataset.triColor = "dark";
					this.script.status.status.innerText = "Đang Chờ";
					this.script.status.timer.innerHTML = "00:00<ms>000</ms>";
					this.script.status.bar.style.width = "0%";
					this.script.status.bar.dataset.color = "green";
					this.script.status.barNow.innerText = "00";
					this.script.status.barEnd.innerText = "??";
					this.script.status.current.innerText = "Không Rõ";
					this.script.status.target.innerText = "Không Rõ";
					this.script.status.priceSaved.innerText = "-0%";
					this.script.status.priceSaved.dataset.color = "yellow";
					this.script.status.itemStatus.innerText = "Không Rõ";
					this.script.status.checkDetail.innerText = "Đang chờ phản hồi từ script...";
					
					this.script.cancelButton.innerText = "Hủy";
					this.script.cancelButton.classList.remove("rainbow");
					this.script.cancelButton.classList.add("yellow");
					this.script.cancelButton.onclick = () => { scriptCancelHandler(true); this.changeLayout(3); scriptStopped = true; }
					this.changeLayout(6);
				}
	
				const run = () => {
					preRunInit();
					
					runInfo({ status: "Đang chạy" });
					heartbeat();
					sounds.confirm(1);
	
					this.logsViewer.lockLogs = true;
				}
	
				const order = () => {
					runInfo({ status: "Đang đặt mua" });
					heartbeat();
					sounds.confirm(2);
					this.script.status.container.dataset.triColor = "darkBlue";
				}
	
				const runInfo = async ({
					status = null,
					time = null,
					progress = null,
					progWarn = true,
					now = null,
					end = null,
					current = null,
					target = null,
					dataType = "price",
					saved = null,
					itemStatus = null,
					itemStatusColor = null,
					checkDetail = null,
				} = {}) => {
					if (scriptStopped)
						throw { code: 0, description: "Script Stopped" }

					this.script.status.container.dataset.dataType = dataType;
	
					if (status !== null)
						this.script.status.status.innerText = status;
	
					if (time !== null) {
						let _t = parseTime(time);
						this.script.status.timer.innerHTML = `${_t.str}<ms>${_t.ms}</ms>`;
					}
	
					if (progress !== null) {
						progress = Math.min(progress, 100);
						this.script.status.bar.dataset.color = (progress >= 80 && progWarn) ? "red" : "green";
						this.script.status.bar.style.width = `${progress}%`;
					}
	
					if (now !== null)
						this.script.status.barNow.innerText = now;
	
					if (end !== null)
						this.script.status.barEnd.innerText = end;
	
					if (dataType === "price") {
						this.script.status.current.classList.add("price");
						this.script.status.target.classList.add("price");
	
						if (current !== null)
							this.script.status.current.innerText = priceFormat(current);
	
						if (target !== null)
							this.script.status.target.innerText = priceFormat(target);
					} else {
						if (dataType !== null) {
							this.script.status.current.classList.remove("price");
							this.script.status.target.classList.remove("price");
						}
	
						if (current !== null)
							this.script.status.current.innerText = current;
	
						if (target !== null)
							this.script.status.target.innerText = target;
					}
	
					if (typeof saved === "number") {
						this.script.status.priceSaved.dataset.color = (saved === 0) ? "yellow" : (saved < 0) ? "green" : "red";
						this.script.status.priceSaved.innerText = `${(saved < 0) ? "-" : "+"}${Math.abs(saved).toFixed(2)}%`;
					}
	
					if (itemStatus !== null)
						this.script.status.itemStatus.innerText = itemStatus;
	
					if (itemStatusColor !== null)
						this.script.status.itemStatus.dataset.color = itemStatusColor;
	
					if (checkDetail !== null)
						this.script.status.checkDetail.innerHTML = checkDetail;
				}
	
				const complete = async () => {
					await scriptCancelHandler(false);
					clog("OKAY", "Script", {text: id, color: flatc("blue")}, "completed successfully");
					heartbeat({ color: "green", beat: false });
	
					sounds.confirm(0);
					runInfo({ status: "Đã chạy xong!", dataType: null })
					this.script.status.container.dataset.triColor = "purple";
					this.script.cancelButton.innerText = "Đóng";
					this.script.cancelButton.classList.add("rainbow");
					this.script.cancelButton.classList.remove("yellow");
				}

				const sendBeacon = async (arg) => await this.sendBeacon(arg);
	
				const writeLog = (text) => {
					if (scriptStopped)
						throw { code: 0, description: "Script Stopped" }

					clog("INFO", {
						text: id,
						color: flatc("green"),
						padding: 6,
						seperate: true
					}, text);
	
					this.logsViewer.write(text);
				}
	
				const command = async (command, data = {}) => (await this.sendCommand(command, data)).data;
	
				// Clear logs
				this.logsViewer.clear();
	
				// Start executing the script
				this.script.settings.header.message.innerText = "Đang chờ thông tin phản hồi";
				clog("INFO", "Script Initializing");
	
				try {
					await eval(decryptedScript);
				} catch(e) {
					await scriptCancelHandler(true);
					await errorHandler(e, true);
					this.changeLayout(3);
				}
	
				/* javascript-obfuscator:enable */
			})().catch(async e => {
				scriptCancelHandler(true);
				await errorHandler(e, true);
				this.changeLayout(3);
			});
		},
	
		autorun: {
			running: {},
	
			script: class {
				get statusList() {
					return {
						complete: { icon: "check", bgColor: "green", barColor: "green" },
						running: { icon: "spinner", bgColor: "blue", barColor: "blue" },
						waiting: { icon: "pause", bgColor: "pink", barColor: "pink" },
						warning: { icon: "error", bgColor: "yellow", barColor: "yellow" },
						errored: { icon: "error", bgColor: "red", barColor: "red" },
						loading: { icon: "spinner", bgColor: "orange", barColor: "blue" }
					}
				}

				get core() {
					return {
						scriptList: core.scriptList,
						info: core.info,
						session: core.session,
						page: core.page,
						getCookie: core.getCookie,
					}
				}
	
				set status(status) {
					if (!this.statusList[status])
						throw { code: -1, description: `Not a valid status: ${status}` }
	
					let s = this.statusList[status];
	
					this.DOM.info.icon.dataset.icon = s.icon;
					this.DOM.dataset.triColor = s.bgColor;
					this.DOM.info.bar.progress.dataset.color = s.barColor;
				}
	
				constructor(data) {
					//? VARIABLE INIT
					this.timer = new stopClock();
					this.data = data;
					this.scriptDisabled = !this.data.allow;
					this.scriptLoaded = false;
					this.scriptInited = false;
					this.configable = false;
					this.configing = false;
					this.settingsSaveKey = `settings.${this.data.id}`;
					this.settingsTemplate = {}
					this.settings = {}
					this.cancelHandler = () => void 0;
	
					// Create Status Node
					let buildTree = [{type:"span",class:"left",name:"left",list:[{type:"t",class:"name",name:"name",text:this.data.name},{type:"t",class:"description",name:"description",text:this.data.description}]},{type:"span",class:"right",name:"right",list:[{type:"t",class:"id",name:"scriptID",text:this.data.id},{type:"t",class:"version",name:"version",text:this.data.version}]},{type:"div",class:"settings",name:"settings"},{type:"ul",class:["textView","light","small","errorLogs"],name:"errorLogs"},{type:"div",class:"runInfo",name:"info",list:[{type:"span",class:"icon",name:"icon"},{type:"t",class:"status",name:"status",text:"Đang khởi chạy"},{type:"t",class:"progress",name:"progress",text:"0%"},{type:"div",class:"progressBar",name:"bar",list:[{type:"div",class:"bar",name:"progress"}]}]}]
					let builtNode = buildElementTree("div", "item", buildTree);
					this.DOM = builtNode.obj;
					this.DOM.info.bar.progress.dataset.color = "green";
					this.DOM.dataset.soundhover = true;
					this.DOM.dataset.triLayout = 3;
					triBg(this.DOM, { color: "yellow" });
					core.script.autorunList.appendChild(builtNode.tree);
	
					this.DOM.settings.dataset.soundhoversoft = true;
					this.DOM.settings.style.display = "none";
					this.DOM.settings.addEventListener("mouseup", () => this.editConfig());
					this.DOM.errorLogs.style.display = "none";
	
					if (this.scriptDisabled) {
						this.DOM.setAttribute("disabled", true);
						this.DOM.dataset.triColor = "darkRed";
						this.DOM.info.status.innerText = "Bạn KHÔNG CÓ QUYỀN chạy Script này!";
					} else {
						sounds.applySound(this.DOM);
						sounds.applySound(this.DOM.settings);
					}
	
					clog("OKAY", "Created new autorun.script with ScriptID", this.data.id);
					_gaq.push(["_trackEvent", core.session.keyData.name, "runScript", this.data.id]);
				}
	
				async errored(error) {
					clog("ERRR", "Autorun Runtime", error);
					sounds.warning();
	
					let e = error.code ? `[${error.code}]` : error.name || error.data.name || `${error.data.data.file}:${error.data.data.line}`;
					let d = error.description || error.message || error.data.message || error.data.description || error.description;
				
					this.status = "errored";
					this.DOM.info.bar.progress.style.width = "100%";
					this.DOM.info.progress.innerHTML = "<b>ERRR</b>";
					this.DOM.info.status.innerHTML = `${e} >>> ${d}`;
	
					await this.stop(true);
				}
	
				logError(msg) {
					this.DOM.errorLogs.style.display = "block";
					let log = document.createElement("li");
					log.innerHTML = `${pleft(this.timer.stop + "", 6)} | ${msg}`;
					this.DOM.errorLogs.appendChild(log);
				}
	
				async enableConfig(settings) {
					this.DOM.settings.style.display = "flex";
					this.configable = true;
					this.settingsTemplate = settings;
					
					//* LOAD SAVED SETTINGS
					let savedSettings = (await core.dataLoad(this.settingsSaveKey))[this.settingsSaveKey] || {};
					this.settings = savedSettings;
	
					for (let key of Object.keys(this.settingsTemplate)) {
						let item = this.settingsTemplate[key];
	
						if (typeof savedSettings[key] !== "undefined")
							if (item.type === "radio") {
								for (let i of item.list)
									if (i.value === savedSettings[key])
										i.checked = true;
									else
										i.checked = false;
								
								this.settingsTemplate[key] = item;
							} else
								this.settingsTemplate[key].value = savedSettings[key];
	
						if (typeof this.settings[key] === "undefined")
							if (["text", "textarea", "number", "date", "time", "checkbox"].includes(item.type))
								this.settings[key] = item.value;
							else if (item.type === "radio")
								this.settings[key] = item.list.filter(i => i.checked === true)[0].value;
					}
				}
	
				async editConfig() {
					if (!this.enableConfig || this.configing)
						return false;
					
					this.configing = true;
					let settingList = this.settingsTemplate;
					core.script.settings.info.container.dataset.hide = true;
					emptyNode(core.script.settings.formList);
	
					for (let key of Object.keys(settingList)) {
						let item = settingList[key];
						let input = null;
	
						if (["text", "textarea", "number", "date", "time"].includes(item.type)) {
							input = createInput({
								type: item.type,
								id: `scriptSetting_${key}`,
								label: item.label,
								value: item.value || "",
								required: item.required || false,
								color: "light"
							});
	
							if (item.height)
								input.input.style.height = item.height;
	
							if (item.step)
								input.input.step = item.step;
	
							if (["date", "time"].includes(item.type)) {
								let btnNow = createBtn("Bây Giờ", "dark");
								btnNow.style.marginLeft = "10px";
	
								input.input.step = (typeof item.step === "number") ? item.step : 1;
								let now = new Date();
	
								if (item.type === "date")
									btnNow.addEventListener("mouseup",
										e => input.input.value = [
											now.getFullYear(),
											now.getMonth() + 1,
											now.getDate()
										].map(v => v < 10 ? "0" + v : v)
											.join("-")
									)
								else if (item.type === "time")
									btnNow.addEventListener("mouseup",
										e => input.input.value = [
											now.getHours(),
											now.getMinutes(),
											now.getSeconds()
										].map(v => v < 10 ? "0" + v : v)
											.join(":")
									)
	
								input.group.appendChild(btnNow);
							}
						}
	
						else if (item.type === "note") {
							let group = document.createElement("div");
							group.classList.add("note", item.level || "info");
							
							let inner = document.createElement("div");
							inner.classList.add("inner");
							inner.innerHTML = item.text;
	
							group.appendChild(inner);
							input = { group: group }
						}
	
						else if (item.type === "customNode") {
							item.node.classList.add("customNode");
							input = { group: item.node }
						}
	
						else if (item.type === "checkbox") {
							input = createSwitch({
								label: item.label,
								color: item.color || "pink",
								value: item.value || false
							});
							
							if (typeof item.disabled !== "undefined")
								input.input.disabled = item.disabled;
						}
	
						else if (item.type === "radio") {
							let defValue = item.type.default || null;
							let group = document.createElement("div");
							group.classList.add("radioGroup");
							let label = document.createElement("span");
							label.classList.add("label");
							label.innerHTML = item.label;
							group.appendChild(label);
	
							for (let _i of item.list) {
								let btn = createSwitch({
									label: _i.name,
									color: _i.color || "blue",
									value: _i.checked || false,
									type: "radio"
								});
								btn.input.name = `ssr_${key}`;
								btn.input.value = _i.value;
								btn.input.required = item.required || false;
								group.appendChild(btn.group);
							}
	
							input = {
								group: group,
								input: {
									name: `ssr_${key}`,
									list: item.list,
									getValue: () => {
										let _e = document.querySelector(`input[name=ssr_${key}]:checked`);
										return (_e) ? _e.value : defValue;
									}
								}
							}
						}
						
						else
							reject({ code: -1, description: "Unknown item type when Script preparing settings value: " + item.type, data: item })
					
						core.script.settings.formList.appendChild(input.group);
	
						if (input.input)
							settingList[key].inputElement = input.input;
					}
	
					//* DEPEND HANDLER AND SANITIZER
					for (let key of Object.keys(settingList)) {
						let item = settingList[key];
	
						if (item.depend) {
							let _t = item;
							let _i = item.inputElement;
	
							_i.disabled = (!settingList[_t.depend].inputElement.checked) ^ (_t.doubt || false);
							settingList[_t.depend]
								.inputElement
								.addEventListener("change", e => { _i.disabled = (!e.target.checked) ^ (_t.doubt || false) });
						}
					}
	
					core.script.settings.formSubmit.innerText = "Lưu";
					core.script.settings.formCancel.innerText = "Hủy";
					core.script.settings.formCancel.onmouseup = e => { this.configing = false; core.changeLayout(3) };
					core.changeLayout(5);
	
					// Form submit action
					core.script.settings.form.onsubmit = async (e) => {
						e.preventDefault();
						let returnData = {}
						let saveType = ["text", "textarea", "number", "date", "time", "checkbox", "radio"]
						let saveSettings = {}
						
						for (let key of Object.keys(settingList)) {
							let item = settingList[key];
	
							if (item.type === "number")
								returnData[key] = parseInt(item.inputElement.value);
							else if (item.type === "checkbox")
								returnData[key] = item.inputElement.checked;
							else if (item.type === "radio")
								returnData[key] = item.inputElement.getValue();
							else if (item.type === "note" || item.type === "customNode")
								continue;
							else
								returnData[key] = item.inputElement.value;
	
							// Save Settings
							if (saveType.includes(item.type)) {
								saveSettings[key] = returnData[key];
	
								if (item.type === "radio") {
									for (let i of item.list)
										if (i.value === saveSettings[key])
											i.checked = true;
										else
											i.checked = false;
									
									this.settingsTemplate[key] = item;
								} else
									this.settingsTemplate[key].value = saveSettings[key];
							}
						}
	
						this.settings = saveSettings;
						await core.dataSave({ [this.settingsSaveKey]: saveSettings });
	
						this.configing = false;
						sounds.confirm(1);
						core.changeLayout(3);
						clog("INFO", "Autorun Script settings saved");
					}
	
					core.script.settings.formList.scrollTop = 0;
				}
	
				async load() {
					if (this.scriptDisabled)
						return false;
	
					this.status = "loading";
					this.DOM.info.status.innerText = `Đang tải`;
					let response = {}
			
					try {
						response = await myajax({
							url: SERVER_ADDR() + API.script.fetch,
							method: "POST",
							form: {
								id: this.data.id,
								token: core.session.token
							},
							onDownload: (e) => {
								if (e.lengthComputable) {
									let p = (e.loaded / e.total) * 100;
									this.DOM.info.bar.progress.style.width = `${p}%`;
									this.DOM.info.progress.innerText = `${p}%`;
								} else
									this.DOM.info.progress.innerText = `NUL`;
							}
						});
					} catch(e) {
						this.scriptLoaded = false;
						await this.errored(e);
						return false;
					}

					// DECRYPT SCRIPT
					let decryptedScript = "";

					try {
						let decrypted = CryptoJS.AES.decrypt(
							{ ciphertext: CryptoJS.enc.Base64.parse(response.data.script) },
							CryptoJS.HmacSHA256(core.session.token + response.data.iv, core.session.keyData.key),
							{
								mode: CryptoJS.mode.CBC,
								padding: CryptoJS.pad.Pkcs7,
								iv: CryptoJS.enc.Hex.parse(response.data.iv)
							}
						);

						decryptedScript = decrypted.toString(CryptoJS.enc.Utf8);
					} catch(e) {
						this.scriptLoaded = false;
						this.errored({ code: 69420, description: `Lỗi khi giải mã dữ liệu: ${e.message} 🤔\n🐶: *sniff *sniff`, stack: e.stack });
						return false;
					}
	
					this.DOM.info.status.innerText = `Đã tải xong`;
					this.DOM.info.bar.progress.style.width = `0`;
					this.DOM.info.progress.innerText = `0`;
					this.mainScript = decryptedScript;
					this.scriptLoaded = true;
					return true;
				}
	
				async run() {
					if (!this.scriptLoaded)
						throw { code: -1, description: `Autorun ScriptID ${this.data.id} is not loaded yet` }
	
					clog("INFO", "Running Autorun ScriptID", this.data.id);
					this.status = "running";
					this.DOM.info.progress.innerText = `WAIT`;
					this.DOM.info.status.innerText = `Đang chạy`;
	
					(async () => {
						/* javascript-obfuscator:disable */
						const onCancel = (f) => this.cancelHandler = f;
						const SCRIPT = this.data;
	
						const runInfo = ({
							status = null,
							info = null,
							progress = null
						}) => {
							if (typeof status === "string")
								this.status = status;
	
							if (typeof info === "string") {
								clog("INFO", {
									text: this.data.id,
									color: flatc("green"),
									padding: 6,
									seperate: true
								}, info);
	
								this.DOM.info.status.innerText = info;
							}
	
							if (typeof progress === "number") {
								this.DOM.info.progress.innerText = `${progress}%`;
								this.DOM.info.bar.progress.style.width = `${progress}%`;
							} else if (typeof progress === "string")
								this.DOM.info.progress.innerHTML = progress;
						}
	
						const triggerError = async (error, popupHandler = false) => {
							await this.errored(error);
	
							if (popupHandler)
								await errorHandler(error, true);
						}
						
						const errored = async (error) => {
							if (typeof error === "string")
								this.logError(error);
							else {
								let e = (error.code && error.data && error.data.code)
									?	`[${error.code} ${error.data.code}]`
									:	error.code ? `[${error.code}]`
									:	error.name
									||	error.data.name
									||	`${error.data.data.file}:${error.data.data.line}`

								let d = (error.description && error.data && error.data.description)
									?	`${error.description} (${error.data.description}) ${(error.data.data.file) ? `${error.data.data.file}:${error.data.data.line}` : ""}`
									:	error.message
									||	error.description
									||	error.data.message
									||	error.data.description
							
								this.logError(`RUNTIME: ${e} >>> ${d}`);
							}
						}
	
						const command = async (command, data = {}) => (await core.sendCommand(command, data)).data;
						const rejectSetup = async (reason) => await this.errored({ code: -1, description: `Setup Rejected: ${reason}` });
						const config = async (settings) => await this.enableConfig(settings);
	
						const complete = async (msg = "Chạy thành công!") => {
							runInfo({ status: "complete", progress: 100, info: msg });
							await this.stop(false);
						}

						const sendBeacon = async (arg) => await core.sendBeacon(arg);
	
						const writeLog = (text) =>
							clog("INFO", {
								text: this.data.id,
								color: flatc("green"),
								padding: 6,
								seperate: true
							}, text);
	
						this.DOM.info.status.innerText = `Đang chờ phản hồi`;
	
						try {
							await eval(this.mainScript);
						} catch(e) { throw e }
	
						/* javascript-obfuscator:enable */
					})().catch(async e => { throw e });
				}
	
				async stop(clean = true) {
					clog("INFO", `Stopping Autorun ScriptID ${this.data.id}`);
					await this.cancelHandler(clean);
				}
	
				async clear() {
					await this.stop(true);
	
					if (this.DOM)
						core.script.autorunList.removeChild(this.DOM);
	
					delete this.DOM;
				}
			},
	
			async init(data) {
				if (data.disabled) {
					clog("DEBG", `Autorun Script ID ${data.id} is DISABLED`);
					return;
				}

				if (!this.running[data.id])
					this.running[data.id] = new this.script(data);
				else
					clog("ERRR", `Autorun Script ID ${data.id} is RUNNING`);
			},
	
			async runAll() {
				for (let key of Object.keys(this.running)) {
					let item = this.running[key];
	
					if (await item.load())
						try {
							await item.run();
						} catch(e) {
							clog("ERRR", `Start ScriptID ${item.data.id}`, e);
	
							if (item.errored)
								await item.errored(e);
							else
								errorHandler(e);
						}
				}
			},
	
			async stopAll() {
				for (let key of Object.keys(this.running)) {
					let item = this.running[key];
	
					try {
						await item.clear();
					} catch(e) {
						clog("ERRR", `Stop ScriptID ${item.data.id}`, e);
						await errorHandler(e);
					}
	
					delete this.running[key];
				}
			}
		},
	
		__getCPUInfo() {
			return new Promise((resolve, reject) => chrome.system.cpu.getInfo((data) => resolve(data)))
		},
	
		__getRAMInfo() {
			return new Promise((resolve, reject) => chrome.system.memory.getInfo((data) => resolve(data)))
		},
	
		__getDiskInfo() {
			return new Promise((resolve, reject) => chrome.system.storage.getInfo((data) => resolve(data)))
		},
	
		async auth() {
			await delayAsync(700);
	
			try {
				var response = await myajax({
					url: SERVER_ADDR() + API.auth,
					method: "POST",
					form: { key: this[window.XHR] },
					changeState: false
				});
			} catch (e) {
				if (e.code === 106) {
					splash.errored();
					if (await popup.show({
						title: "Không thể kết nối tới máy chủ",
						message: `Máy chủ hiện tại: ${STATE}.${this.server()}`,
						description: "Xin lỗi! Hiện tool không thể kết nối tới máy chủ. Vui lòng thử lại sau ít phút hoặc chọn máy chủ khác",
						level: "offline",
						buttonList: {
							retry: { text: "Kết nối lại", color: "green" },
							switchServer: { text: "Đổi Máy Chủ", color: "blue" },
							contact: { text: "Báo lỗi", color: "pink", full: true, resolve: false, onClick: () => window.open("http:\/\/m.me\/HunterDealJustFun", "_blank") }
						}
					}) === "switchServer")
						await this.changeServer({ reAuth: false })
	
					return false;
				}
	
				switch (e.data.code) {
					case 50:
						var keyBox = document.createElement("pre");
						keyBox.classList.add("dark", "break", "center");
						keyBox.innerText = e.data.data.key;
						keyBox.style.fontSize = "16px";
	
						splash.errored();
						if (await popup.show({
							title: "Chưa đăng kí bản quyền!",
							message: "Xin Lỗi!",
							description: "Bản copy này của <b>Deal Hunter Suite</b> chưa được đăng kí trên máy bạn!<br>Vui lòng gửi mã đăng kí phía dưới tới Admin để thực hiện đăng kí sản phẩm!",
							level: "okay",
							icon: "key",
							bgColor: "pink",
							headerTheme: "light",
							bodyTheme: "dark",
							customNode: keyBox,
							buttonList: {
								contact: { text: "Liên Hệ Đăng Kí", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") },
								reload: { text: "Kiểm Tra Lại", color: "green" },
								switchServer: { text: "Đổi Máy Chủ", color: "blue", full: true }
							}
						}) === "switchServer")
							await this.changeServer({ reAuth: false });
		
						return false;
				
					case 51:
						var box = document.createElement("div");
						box.style.display = "flex";
						box.style.flexDirection = "column";
						box.style.alignItems = "center";
	
						var timeBox = document.createElement("t");
						timeBox.style.fontSize = "13px";
						timeBox.style.fontWeight = "bold";
						timeBox.style.margin = "auto";
						timeBox.style.color = oscColor("yellow");
	
						let expired = 0;
						for (let item of e.data.data.licenses)
							if (expired < item.expire)
								expired = item.expire;
	
						liveTime(timeBox, expired, { prefix: "Đã hết hạn ", surfix: " trước" })
						
						var keyBox = document.createElement("pre");
						keyBox.classList.add("dark", "break", "center");
						keyBox.innerText = e.data.data.key;
						keyBox.style.fontSize = "16px";
						keyBox.style.margin = "4px 10px 0";
	
						box.append(timeBox, keyBox);
	
						splash.errored();
						if (await popup.show({
							title: "Bản quyền đã hết hạn!",
							message: "Xin lỗi!",
							description: "Bản quyền <b>Deal Hunter Suite</b> của máy bạn đã hết hạn!<br>Vui lòng liên hệ với Admin để gia hạn sản phẩm!",
							level: "warning",
							customNode: box,
							buttonList: {
								contact: { text: "Liên Hệ", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") },
								reload: { text: "Kiểm Tra Lại", color: "green" },
								switchServer: { text: "Đổi Máy Chủ", color: "blue", full: true }
							}
						}) === "switchServer")
							await this.changeServer({ reAuth: false });

						return false;
	
					default:
						var infoBox = document.createElement("pre");
						infoBox.classList.add("dark", "break");
						infoBox.innerText = `[${e.data.code}] ${e.data.status} ${e.data.description}` + (e.data.data.code ? `\nat ${e.data.data.file}:${e.data.data.line}` : "");
						infoBox.style.fontSize = "15px";
	
						splash.errored();
						if (await popup.show({
							title: "Toang Rồi Ông Giáo Ạ!",
							message: "AUTHORIZE SERVER ERROR",
							description: "Có lỗi không mong muốn đã sảy ra khi đăng nhập vào máy chủ <b>Deal Hunter Suite</b>!",
							level: "error",
							customNode: infoBox,
							buttonList: {
								contact: { text: "Liên Hệ", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") },
								reload: { text: "Thử Lại", color: "green" },
								switchServer: { text: "Đổi Máy Chủ", color: "blue", full: true }
							}
						}) === "switchServer")
							await this.changeServer({ reAuth: false });
						
						return false;
				}
			}

			if (this[window.XHR] !== response.data.keyData.key) {
				splash.errored();
				throw { code: -1, description: "Một lỗi không rõ nguyên nhân đã xảy ra khi cố đăng nhập vào máy chủ!" }
			}
	
			this.session = response.data;
			clog("OKAY", "Login success as", this.session.keyData.name);
			delete this[window.XHR];
			delete window.XHR;
	
			return true;
		},
	}
	
	const tutorial = {
		container: $("#tutorialPage"),
		card: $("#tutorialPageCardWrapper"),
		indicator: $("#tutorialPageIndicator"),
		button: $("#tutorialPageButton"),
		list: [],
		prevCard: null,
		playing: false,
	
		init() {
			emptyNode(this.indicator);
			let cardList = this.card.getElementsByClassName("card");
	
			for (let i = 0; i < cardList.length; i++) {
				let item = cardList[i];
				let dot = document.createElement("dot");
				dot.dataset.id = i;
				dot.addEventListener("click", e => this.switch(parseInt(e.target.dataset.id)));
				this.indicator.appendChild(dot);
	
				this.list.push({
					card: item,
					dot: dot
				})
			}
	
			this.button.addEventListener("mouseup", e => this.switch("next"));
			clog("OKAY", "Initialized: tutorial");
		},
	
		play() {
			return new Promise((resolve, reject) => {
				core.changeLayout(8);
				this.switch(0, true);
	
				this.button.addEventListener("click", e => {
					if (this.prevCard === this.list.length) {
						sounds.confirm(1);
						core.changeLayout("back");
						resolve();
					}
				})
			})
		},
	
		async switch(card, init = false) {
			if (card === this.prevCard || this.playing)
				return false;
	
			if (!init)
				sounds.warning();
	
			this.playing = true;
	
			if (this.prevCard !== null && this.list[this.prevCard]) {
				let _p = this.list[this.prevCard];
	
				_p.card.classList.remove("play", "show");
				_p.dot.classList.remove("active");
			}
	
			card = (card === "next") ? this.prevCard + 1 : card;
			this.prevCard = card;
	
			if (!this.list[card])
				return false;
	
			let _t = this.list[card];
			_t.dot.classList.add("active");
			_t.card.classList.add("show");
			this.card.style.transform = `translateX(calc(-${card * 100}vw + ${card * 40}px))`;
	
			this.button.className = `sq-btn sound ${_t.card.dataset.buttonColor || "blue"}`;
			this.button.innerText = _t.card.dataset.buttonText || "Tiếp";
	
			await delayAsync(600);
			_t.card.classList.add("play");
			this.playing = false;
		}
	}
	
	const splash = {
		progress: $("#splashProgress"),
		detail: $("#splashDetail"),
	
		set({
			p = null,
			i = null
		}) {
			this.progress.dataset.color = "blue";
			this.progress.dataset.blink = "grow";
	
			if (p !== null)
				this.progress.style.width = `${p}%`;
	
			if (i !== null)
				this.detail.innerText = i;
		},
	
		errored() {
			sounds.warning();
			this.progress.dataset.color = "red";
			this.progress.dataset.blink = "fade";
		}
	}
	
	const errorHandler = async (error, returnable = false) => {
		if (typeof error.code === "number" && error.code === 0)
			return;

		clog("ERRR", error);
		splash.errored();
	
		let e = (error.code && error.data && error.data.code)
			?	`[${error.code} ${error.data.code}]`
			:	error.code ? `[${error.code}]`
			:	error.name
			||	error.data.name
			||	`${error.data.data.file}:${error.data.data.line}`
	
		let d = (error.description && error.data && error.data.description)
			?	`${error.description} (${error.data.description}) ${(error.data.data.file) ? `${error.data.data.file}:${error.data.data.line}` : ""}`
			:	error.message
			||	error.description
			||	error.data.message
			||	error.data.description
	
		let returnBtn = {}
	
		if (returnable)
			returnBtn.back = { text: "Quay lại", color: "green" }
	
		let errorContainer = document.createElement("div");
	
		let errorBox = document.createElement("pre");
		errorBox.classList.add("dark", "break");
		errorBox.innerText = `${e} >>> ${d}`;
		errorBox.style.fontSize = "16px";
		errorContainer.appendChild(errorBox);
	
		if (error.stack) {
			let errorStack = document.createElement("ul");
			errorStack.classList.add("textView");
			errorStack.innerHTML = error.stack.split("\n").map(line => `<li>${line}</li>`).join("");
			errorContainer.appendChild(errorStack);
		}
	
		await popup.show({
			windowTitle: "Error Handler",
			title: "Toang Rồi Ông Giáo Ạ!",
			message: "EXCEPTION OCCURED",
			description: "Một lỗi không mong muốn đã sảy ra!",
			level: "error",
			customNode: errorContainer,
			buttonList: {
				contact: { text: "Báo Lỗi", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") },
				...returnBtn
			}
		})
	
		_gaq.push(["_trackEvent", core.session.keyData.name, "errored", `${e} >>> ${d}`]);
	}
	
	window.addEventListener(
		"DOMContentLoaded",
		async (e) => {
			await core.init().catch(errorHandler);

			if (STATE === "indev")
				window.core = core;
		}
	);
} catch(e) {
	clog("ERRR", "core.js error:", e);
	window.alert(e);
}