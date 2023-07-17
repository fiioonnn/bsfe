import Alerts from "../modules/alerts.js";
import Block from "./block.class.js";

class Export {
	constructor() {
		this.exportDownloadBtn = document.querySelector("#exportDownloadBtn");
		this.exportJSON = document.querySelector("#exportJSON");
		this.exportRefreshPreview = document.querySelector("#exportRefreshPreview");
	}

	init() {
		this.exportJSON.setAttribute("contenteditable", true);
		this.registerButtons();
		setTimeout(() => this.updatePreview(false), 100);
	}

	registerButtons() {
		// Click refresh button
		this.exportRefreshPreview.onclick = () => {
			this.updatePreview();
		};
		// Click export button
		this.exportDownloadBtn.onclick = () => {
			const data = Block.generate();
			const file = new Blob([data], { type: "text/plain" });
			const a = document.createElement("a");
			const url = URL.createObjectURL(file);

			a.href = url;
			a.download = "block.json";
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			}, 0);

			let fileSize = (file.size / 1024).toFixed(2);

			Alerts.create({
				type: "success",
				message: `Block downloaded! (${fileSize} KB)`,
			});
		};
		// Hover export button
		this.exportDownloadBtn.onmouseover = function () {
			const data = Block.generate();
			const file = new Blob([data], { type: "text/plain" });

			let fileSize = (file.size / 1024).toFixed(2);

			this.innerHTML = `<i class="fa-solid fa-download"></i> Download Block (${fileSize} KB)`;
		};
	}

	updatePreview(showAlert = true) {
		if (this.exportJSON.textContent == Block.generate()) {
			return Alerts.create({
				type: "error",
				message: "Preview is already up to date!",
			});
		}
		this.exportJSON.innerHTML = Prism.highlight(
			Block.generate(),
			Prism.languages.json,
			"json"
		);

		if (!showAlert) return;

		Alerts.create({
			type: "info",
			message: "Preview updated!",
		});
	}
}

export default new Export();
