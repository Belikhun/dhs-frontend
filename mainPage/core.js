//? |-----------------------------------------------------------------------------------------------|
//? |  /mainPage/core.js                                                                            |
//? |                                                                                               |
//? |  Copyright (c) 2018-2019 Belikhun. All right reserved                                         |
//? |  Licensed under the MIT License. See LICENSE in the project root for license information.     |
//? |-----------------------------------------------------------------------------------------------|

const loadMsg = () => {
	let msgs = [
		`Not panicking...totally not panicking...er...everything's fine...`,
		`Following the white rabbit....`,
		`"Going the distance..."`,
		`The Elders of the Internet are contemplating your request...`,
		`PC Load Letter!? What the $#%& does that mean?`,
		`All your base are belong to us`,
		`Baking cake...er...I mean loading, yeah loading...`,
		`I'll be with you in a bit...(snicker)`,
		`Let this abomination unto the Lord begin`,
		`Making stuff up. Please wait...`,
		`Searching for the... OMG, what the heck is THAT doing there?`,
		`Loading the Loading message....`,
		`The internet is full... Please wait...`,
		`Slackbot is groggy. installing java`,
		`Initializing Skynet library. gaining sentience....`,
		`Commencing infinite loop (this may take some time)....`,
		`Caching internet locally....`,
		`Water detected on drive C:, please wait. Spin dry commencing`,
		`Load failed. retrying with --prayer....`,
		`Performing the rite of percussive maintenance....`,
		`Sacrificing a resistor to the machine gods....`
	]

	return msgs[randBetween(0, msgs.length - 1)];
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
		announcement: $("#announcementBox"),
		changelog: $("#toolChangelog"),
		changelogContainer: $("#toolChangelogContainer")
	},
	script: {
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
		logs: $("#scriptRunLogs"),
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
		license: {
			container: $("#toolInfoLicense"),
			licensee: $("#toolInfoLicenseName"),
			allow: $("#toolInfoLicenseAllow"),
			timer: $("#toolInfoLicenseTimer"),
			key: {
				button: $("#toolInfoLicenseKeyBtn"),
				container: $("#toolInfoLicenseKey"),
				key: $("#toolInfoLicenseKeyKey")
			},
		},
		author: $("#toolInfoAuthor")
	},
	uniqueKeys: null,
	scriptIniting: false,
	prevLayout: 0,
	scriptList: {},
	info: {},
	session: {},
	page: {},

	async init() {
		splash.change({ title: "Deal Hunter Suite", description: loadMsg() });

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
		this.toolInfo.copyright.innerHTML = `Copyright (C) 2019-2020 ${AUTHOR}. All right reserved`;

		this.toolInfo.license.container.dataset.triColor = "red";
		this.toolInfo.license.licensee.innerText = `Bạn chưa đăng nhập`;
		this.toolInfo.license.key.key.innerText = "KHÔNG RÕ";
		this.toolInfo.author.innerHTML = `
			<span class="item">
				<img class="avatar" src="${SERVER_ADDR + API["avatar"]}?u=belivipro9x99">
				<a href="https://github.com/belivipro9x99" target="_blank" rel="noopener noreferrer" class="authorName">Belikhun</a>
				<t class="authorInfo">Core Developer</t>
				<t class="authorInfo">UI/UX Designer</t>
			</span>

			<span class="item">
				<img class="avatar" src="${SERVER_ADDR + API["avatar"]}?u=kirk2711">
				<a href="https://www.facebook.com/HunterDealNo1" target="_blank" rel="noopener noreferrer" class="authorName">Toàn Te</a>
				<t class="authorInfo">Administrator</t>
				<t class="authorInfo">License Manager</t>
				<t class="authorInfo">Maintainer</t>
			</span>
		`

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

		splash.set({ p: 30, i: "Kiểm tra kết nối tới máy chủ" });
		try {
			var serverStatus = await myajax({
				url: SERVER_ADDR + API.status,
				method: "GET"
			})
		} catch(e) {
			splash.change({ description: "Lỗi đã sảy ra! Vui lòng khởi động lại công cụ!" });
			await popup.show({
				title: "Không thể kết nối tới máy chủ",
				message: "Xin lỗi! Hiện tool không thể kết nối tới máy chủ",
				description: "Vui lòng thử lại sau ít phút!",
				level: "offline",
				buttonList: {
					contact: { text: "Báo lỗi", color: "pink", resolve: false, onClick: () => window.open("http:\/\/m.me\/HunterDealNo1", "_blank") }
				}
			});

			return false;
		}

		this.info = serverStatus.data;
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

		if (this.info.EXTENSION_VERSION !== VERSION) {
			await popup.show({
				title: "Đã có phiên bản mới!",
				description: `Hiện đã có phiên bản mới: <b>v${this.info.EXTENSION_VERSION}</b>. Vui lòng cập nhật bằng link dưới hoặc liên hệ Admin để được hỗ trợ!`,
				level: "warning",
				buttonList: {
					downZip: { text: "Tải về (zip)", color: "green", resolve: false, onClick: () => window.open(SERVER_ADDR + API.updates.latest + "?type=zip", "_blank") },
					downCrx: { text: "Tải về (crx)", color: "blue", resolve: false, onClick: () => window.open(SERVER_ADDR + API.updates.latest + "?type=crx", "_blank") },
					contact: { text: "Hỗ trợ", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") },
					continue: { text: "Tiếp tục chạy!", color: "yellow" }
				}
			});
		}

		splash.set({ p: 40, i: "Fetching changelog" });
		this.tool.changelogContainer.innerHTML = await myajax({
			url: SERVER_ADDR + API.updates.changelog,
			method: "GET",
			type: "text",
			force: true,
			reRequest: false
		})
		this.tool.changelog.dataset.loaded = "true";

		//? |-----------------------|
		//? |     GENERATE UUID     |
		//? |-----------------------|

		splash.set({ p: 50, i: "Generating Client UUID" });
		this.uniqueKeys = await this.generateKey();

		//? |-----------------------|
		//? |     LICENSE CHECK     |
		//? |-----------------------|

		splash.set({ p: 60, i: "Đang kiểm tra bản quyền" });
		while (!await this.auth()) { clog("INFO", "Auth failed. Retrying"); }

		this.toolInfo.license.container.dataset.triColor = "blue";
		this.toolInfo.license.licensee.innerText = this.session.keyData.name;
		this.toolInfo.license.allow.innerText = this.session.keyData.allow.split(";").join(", ");
		this.toolInfo.license.key.key.innerText = "ĐÃ BỊ ẨN";

		this.toolInfo.license.key.button.addEventListener("mouseup", async e => {
			let warningNode = document.createElement("t");
			warningNode.style.fontFamily = "Open Sans";
			warningNode.style.color = "#f3e75f";
			warningNode.innerHTML = `<b>⚠ Lưu ý:</b> Tuyệt đối không chia sẻ key cho người khác! Bạn sẽ bị đăng xuất nếu có máy khác sử dụng key của bạn!`;

			let response = await popup.show({
				title: "Xác Nhận",
				message: "Hiển Thị License Key",
				description: `Bạn có chắc muốn hiển thị key bản quyền của bạn không?`,
				level: "confirm",
				additionalNode: warningNode,
				buttonList: {
					confirm: { text: "Xác Nhận", color: "pink" },
					close: { text: "Đóng", color: "blue" }
				}
			});

			if (response === "confirm")
				this.toolInfo.license.key.key.innerText = this.session.keyData.key;

			delete warningNode;
			delete response;
		});

		setInterval(() => {
			let now = time();
			let remain = this.session.keyData.expire - now;

			let d = Math.floor(remain / 86400);
			let t = parseTime(remain % 86400);

			this.toolInfo.license.timer.innerHTML = `<days>${d}</days>${t.str}<ms>${t.ms}</ms>`;

			delete now;
			delete remain;
			delete d;
			delete t;
		}, 64);

		_gaq.push(["_trackEvent", "auth", this.session.keyData.name]);

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

		splash.set({ p: 90, i: "Setting up Listeners" });
		chrome.tabs.onUpdated.addListener((t, c) => this.checkPage(t, c));
		this.tool.reloadBtn.addEventListener("mouseup", e => this.reload(true));

		// NAVBAR CLOCK
		setInterval(() => {
			let date = new Date();
			let day = ["Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "CN"][date.getDay() - 1];
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
		}, 64);

		//? |-----------------------|
		//? |       END INIT        |
		//? |-----------------------|

		splash.set({ p: 100, i: "" });
		clog("OKAY", "Initialized");
		_gaq.push(["_trackEvent", "pageLoad", "initialized", "core.js Initialized"]);
		
		if (!(await this.dataLoad("licensed")).licensed) {
			tutorial.init();
			sounds.confirm(0);
			splash.change({ title: "Deal Hunter Suite", description: `Chào mừng bạn đến với <b>Deal Hunter Suite</b>!<br><b>${this.session.keyData.name}</b>` });
			await tutorial.play();
			clog("INFO", "Tutorial Ended");

			await this.dataSave({ licensed: true });
			await delayAsync(600);
		}

		this.tool.navbar.userName.innerText = this.session.keyData.name;
		splash.change({ description: `Cấp phép cho: <b>${this.session.keyData.name}</b>` });
		await delayAsync(500);
		this.changeLayout(3);
	},

	async checkPage(tabId, changeInfo) {
		if (tabId !== this.page.id)
			return;

		if (changeInfo.url)
			changeInfo.url = new URL(changeInfo.url);

		this.page = Object.assign(this.page, changeInfo);
		this.updatePageInfo();
		await this.reload();

		clog("DEBG", {
			text: `tabID ${tabId}`,
			padding: 10,
			seperate: true,
			color: flatc("gray")
		}, changeInfo);
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

	async fetchScriptList(hard = false) {
		if (hard || Object.keys(this.scriptList).length === 0) {
			let res = await myajax({
				url: SERVER_ADDR + API.script.list,
				method: "POST",
				form: { token: this.session.token }
			})

			this.scriptList = res.data;
		}

		this.script.thisPageList.innerHTML = "";
		this.script.undependList.innerHTML = "";
		this.script.availableList.innerHTML = "";

		for (let key of Object.keys(this.scriptList)) {
			let item = this.scriptList[key];

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
					itemBox.addEventListener("click", e => this.scriptPreInit(e.currentTarget.dataset.target));
				}

				this.script.undependList.appendChild(itemBox);
			} else if ((new RegExp(item.match)).test(this.page.url.hostname + this.page.url.pathname)) {
				if (item.allow) {
					itemBox.dataset.soundhover = "";
					itemBox.dataset.soundselect = "";
					sounds.applySound(itemBox);

					itemBox.dataset.target = item.id;
					itemBox.addEventListener("click", e => this.scriptPreInit(e.currentTarget.dataset.target));
				}

				this.script.thisPageList.appendChild(itemBox);
			}

			this.script.availableList.appendChild(itemBox.cloneNode(true));
		}
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
			item.removeChild(box);

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
	},

	subScreen: {
		container: $("#subScreen"),

		show(node = document.createElement("span"), layout = "blank") {
			this.container.innerHTML = "";
			this.container.setAttribute("layout", layout);
			this.container.append(...node.childNodes);
			window.resizeTo(1340, window.outerHeight);
			this.container.classList.add("show");
		},

		hide() {
			this.container.classList.remove("show");
			this.container.innerHTML = "";
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

	async reload(hard = false) {
		if (hard) {
			await this.findTarget();
		}

		await this.fetchScriptList(hard);
	},

	async scriptPreInit(id) {
		if (this.scriptIniting)
			return false;

		clog("INFO", "Call to scriptPreInit ScriptID", id);
		_gaq.push(["_trackEvent", "runScript", id, `Run Script ID ${id}`]);
		this.scriptIniting = true;
		this.changeLayout(4);
		sounds.confirm();

		this.script.settings.header.message.innerText = "Đang khởi chạy";
		let response = {};

		try {
			response = await myajax({
				url: SERVER_ADDR + API.script.fetch,
				method: "POST",
				form: {
					id: id,
					token: this.session.token
				},
				type: "text"
			});
		} catch(e) {
			this.scriptIniting = false;
			errorHandler(e);
			return;
		}

		// A little cooldown
		await delayAsync(500);
		this.scriptIniting = false;

		(async () => {
			/* javascript-obfuscator:disable */ 
			const createInput = (type, id, label, value, required = false) => {
				let formGroup = document.createElement("div");
				formGroup.classList.add("formGroup");
				formGroup.dataset.soundhoversoft = "";
				formGroup.dataset.soundselectsoft = "";
				sounds.applySound(formGroup);
		
				let formField = document.createElement(type === "textarea" ? type : "input");
				formField.type = type;
				formField.id = id;
				formField.classList.add("formField");
				formField.placeholder = label;
				formField.value = value;

				if (required)
					formField.required = true;

				if (type === "textarea") {
					formField.style.fontFamily = "Consolas";
					formField.style.fontWeight = "bold";
					formField.style.fontSize = "15px";
				}
		
				let formLabel = document.createElement("label");
				formLabel.htmlFor = id;
				formLabel.classList.add("formLabel");
				formLabel.innerText = label;
		
				formGroup.appendChild(formField);
				formGroup.appendChild(formLabel);
		
				return { group: formGroup, input: formField }
			}
		
			const createSwitch = (text, color, value, type = "checkbox") => {
				let container = document.createElement("div");
				container.classList.add("switchContainer");
				container.dataset.soundhoversoft = "";
				sounds.applySound(container);
		
				let title = document.createElement("span");
				title.innerHTML = text;
		
				let label = document.createElement("label");
				label.classList.add("sq-checkbox", color);
		
				let input = document.createElement("input");
				input.type = type;
				input.checked = value;
				input.dataset.soundcheck = "";
				sounds.applySound(input);
		
				let mark = document.createElement("span");
				mark.classList.add("checkmark");
		
				label.appendChild(input);
				label.appendChild(mark);
				container.appendChild(title);
				container.appendChild(label);
		
				return { group: container, input: input }
			}
		
			const createBtn = (text, color = "blue") => {
				let btn = document.createElement("button");
				btn.type = "button";
				btn.innerText = text;
				btn.classList.add("sq-btn", color);
				btn.dataset.soundhover = "";
				btn.dataset.soundselect = "";
				sounds.applySound(btn);
		
				return btn;
			}

			const priceFormat = (num) => num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

			var scriptCancelHandler = async () => {};
			const onCancel = (f) => scriptCancelHandler = f;

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

			const setup = async (settingList, { confirm = "Bắt đầu", cancel = "Hủy" } = {}) => {
				return new Promise((resolve, reject) => {
					this.script.settings.formList.innerHTML = "";

					for (let key of Object.keys(settingList)) {
						let item = settingList[key];
						let input = null;

						if (["text", "textarea", "number", "date", "time"].includes(item.type)) {
							input = createInput(
								item.type,
								`scriptSetting_${key}`,
								item.label,
								item.value || "",
								item.required || false
							)

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
							input = createSwitch(item.label, item.color || "pink", item.value || false);
							
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
							
							let _i = createSwitch(item.label, item.color || "blue", item.value || false, "radio");
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
								let btn = createSwitch(_i.name, _i.color || "blue", false, "radio");
								btn.input.name = `ssr_${key}`;
								btn.input.value = _i.value;
								btn.input.required = item.required || false;
								btn.input.checked = _i.checked || false;
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

						if (item.depend) {
							let _t = item;
							let _i = input.input;

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

						this.script.settings.formList.appendChild(input.group);

						if (input.input)
							settingList[key].inputElement = input.input;
						else
							delete settingList[key];
					}

					this.script.settings.formSubmit.innerText = confirm;
					this.script.settings.formCancel.innerText = cancel;
					this.script.settings.formCancel.onmouseup = e => { scriptCancelHandler(true); this.changeLayout(3) }
					this.changeLayout(5);

					// Form submit action
					this.script.settings.form.onsubmit = (e) => {
						e.preventDefault();
						let returnData = {};
						
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
						}
						
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
					title: "Đã dừng phản hồi!",
					description: reason,
					level: "info",
					buttonList: {
						contact: { text: "Báo Lỗi", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") },
						back: { text: "Quay lại", color: "green" },
					}
				});

				this.changeLayout(3);
			}

			const triggerError = async (error) => {
				await scriptCancelHandler(true);
				heartbeat({ color: "red", beat: false });

				await errorHandler(error, true);
				this.changeLayout(3);
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
				this.script.cancelButton.onclick = () => { scriptCancelHandler(true); this.changeLayout(3); }
				this.changeLayout(6);
			}

			const run = () => {
				runInfo({ status: "Đang chạy" });
				heartbeat();
				sounds.confirm(1);
				preRunInit();
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
					this.script.status.current.classList.remove("price");
					this.script.status.target.classList.remove("price");

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
				runInfo({ status: "Đã chạy xong!" })
				this.script.status.container.dataset.triColor = "purple";
				this.script.cancelButton.innerText = "Đóng";
				this.script.cancelButton.classList.add("rainbow");
				this.script.cancelButton.classList.remove("yellow");
			}

			const writeLog = (text) => {
				clog("INFO", {
					text: id,
					color: flatc("green"),
					padding: 6,
					seperate: true
				}, text);

				let logItem = document.createElement("li");
				logItem.innerHTML = text;
				this.script.logs.appendChild(logItem);
				this.script.logs.scrollTop = this.script.logs.scrollHeight;
			}

			const command = async (command, data = {}) => (await this.sendCommand(command, data)).data;

			// Clear logs
			this.script.logs.innerHTML = "";
			// Start executing the script
			try {
				eval(response);
			} catch(e) {
				await scriptCancelHandler(true);
				await errorHandler(e, true);
				this.changeLayout(3);
			}

			this.script.settings.header.message.innerText = "Đang chờ thông tin phản hồi";
			/* javascript-obfuscator:enable */ 
		})().catch(async e => { scriptCancelHandler(true); await errorHandler(e, true); this.changeLayout(3) });
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

	async generateKey() {
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

		return hashHex;
	},

	async auth() {
		await delayAsync(700);

		try {
			var response = await myajax({
				url: SERVER_ADDR + API.auth,
				method: "POST",
				form: { key: this.uniqueKeys },
				changeState: false
			});
		} catch (e) {
			if (e.code === 106) {
				splash.change({ description: "Lỗi đã sảy ra! Vui lòng khởi động lại công cụ!" });
				await popup.show({
					title: "Không thể kết nối tới máy chủ!",
					description: "Oops! Máy chủ có vẻ như đang <b>Offline</b>! Vui lòng thử lại sau!<br>Nếu bạn thấy đây là một lỗi, vui lòng báo cáo lỗi tới Admin để được giải quyết trong thời gian sớm nhất!",
					level: "offline",
					buttonList: {
						contact: { text: "Báo lỗi", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") }
					}
				})

				return false;
			}

			switch (e.data.code) {
				case 50:
					var keyBox = document.createElement("pre");
					keyBox.classList.add("dark", "break", "center");
					keyBox.innerText = e.data.data.key;
					keyBox.style.fontSize = "16px";
					keyBox.style.margin = "unset";

					splash.change({ description: "Đăng nhập thất bại!" });
					await popup.show({
						title: "Chưa đăng kí bản quyền!",
						description: "Xin lỗi! Bản copy này của <b>Deal Hunter Suite</b> chưa được đăng kí bản quyền trên máy bạn!<br>Vui lòng gửi mã đăng kí ở phía dưới tới Admin để thực hiện đăng kí sản phẩm!",
						level: "warning",
						additionalNode: keyBox,
						buttonList: {
							contact: { text: "Liên Hệ Đăng Kí", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") },
							reload: { text: "Kiểm Tra Lại", color: "blue" }
						}
					})
	
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
					liveTime(timeBox, e.data.data.expire, { prefix: "Đã hết hạn ", surfix: " trước" })
					
					var keyBox = document.createElement("pre");
					keyBox.classList.add("dark", "break", "center");
					keyBox.innerText = e.data.data.key;
					keyBox.style.fontSize = "16px";
					keyBox.style.margin = "4px 0 0 0";

					box.appendChild(timeBox);
					box.appendChild(keyBox);

					splash.change({ description: "Đăng nhập thất bại!" });
					await popup.show({
						title: "Bản quyền đã hết hạn!",
						description: "Xin lỗi! Bản quyền <b>Deal Hunter Suite</b> của máy bạn đã hết hạn!<br>Vui lòng liên hệ với Admin để gia hạn sản phẩm!",
						level: "warning",
						additionalNode: box,
						buttonList: {
							contact: { text: "Liên Hệ", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") },
							reload: { text: "Kiểm Tra Lại", color: "blue" }
						}
					})
					return false;

				default:
					var infoBox = document.createElement("pre");
					infoBox.classList.add("dark", "break", "center");
					infoBox.innerText = `[${e.data.code}] ${e.data.status} ${e.data.description}` + (e.data.data.code ? `\nat ${e.data.data.file}:${e.data.data.line}` : "");
					infoBox.style.fontSize = "15px";
					infoBox.style.margin = "unset";

					splash.change({ description: "Lỗi không rõ!" });
					await popup.show({
						title: "Oops!",
						description: "Xin lỗi! Có lỗi không mong muốn đã sảy ra khi đăng nhập vào máy chủ <b>Deal Hunter Suite</b>!",
						level: "error",
						additionalNode: infoBox,
						buttonList: {
							contact: { text: "Liên Hệ", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") },
							reload: { text: "Thử Lại", color: "blue" }
						}
					})
					
					return false;
			}
		}

		this.session = response.data;
		clog("OKAY", "Login success");
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
		this.indicator.innerHTML = "";
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
	title: $("#splashTitle"),
	description: $("#splashDescription"),
	progress: $("#splashProgress"),
	progressInfo: $("#splashProgressInfo"),
	button: $("#splashButton"),

	change({
		title = null,
		description = null
	}) {
		if (title !== null)
			this.title.innerHTML = title;
		
		if (description !== null)
			this.description.innerHTML = description;
	},

	set({
		p = null,
		i = null
	}) {
		if (p !== null)
			this.progress.style.width = `${p}%`;

		if (i !== null)
			this.progressInfo.innerText = i;
	},

	confirm({
		text = "Sample Text",
		color = "pink"
	}) {
		return new Promise((resolve, reject) => {
			this.button.innerText = text;
			this.button.className = `sq-btn ${color} sound`;
			this.button.style.display = "block";

			this.button.onclick = async (e) => {
				await resolve();
				this.button.style.display = "none";
			}
		});
	}
}

const errorHandler = async (error, returnable = false) => {
	clog("ERRR", error);

	let e = error.code ? `[${error.code}]` : error.name || error.data.name || `${error.data.data.file}:${error.data.data.line}`;
	let d = error.description || error.message || error.data.message || error.data.description || error.description;
	let returnBtn = {}

	if (returnable)
		returnBtn.back = { text: "Quay lại", color: "green" }

	let errorBox = document.createElement("pre");
	errorBox.classList.add("dark", "break");
	errorBox.innerText = `${e} >>> ${d}`;
	errorBox.style.fontSize = "16px";

	splash.change({ description: "Lỗi đã sảy ra!" });
	await popup.show({
		windowTitle: "Error Handler",
		title: "Oops!",
		message: "EXCEPTION OCCURED",
		description: "Một lỗi không mong muốn đã sảy ra!",
		level: "error",
		additionalNode: errorBox,
		buttonList: {
			contact: { text: "Báo Lỗi", color: "pink", resolve: false, onClick: () => window.open(CONTACT_ADDR, "_blank") },
			...returnBtn
		}
	})

	splash.change({ description: `Cấp phép cho: <b>${core.session.keyData.name}</b>` });
}

window.addEventListener(
	"DOMContentLoaded",
	(e) => core.init().catch(errorHandler)
);