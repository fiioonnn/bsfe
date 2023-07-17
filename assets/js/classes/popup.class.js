import Settings from "../modules/settings.js";

class Popup {
	constructor() {}

	show(props = {}) {
		const icon = props.icon || "fa-circle-info";
		const title = props.title || "BFSE";
		const message = props.message || "N/A";
		let text = "";
		Array.isArray(message)
			? message.forEach((line) => {
					text += `<p>${line}</p>`;
			  })
			: (text = `<p>${message}</p>`);

		text = text.replace(/►/g, "<span>►</span>");

		const buttonEl = document.createElement("button");
		const popupEl = document.createElement("div");

		const popups = document.querySelectorAll(".popup");

		if (popups.length > 0) {
			popups.forEach((popup) => {
				document.body.removeChild(popup);
			});
		}

		buttonEl.classList.add("button");
		popupEl.classList.add("popup");

		buttonEl.innerHTML = "OK";
		popupEl.innerHTML = `
			<div class="popup__inner">
				<div class="popup__head">
					<div class="popup__icon">
						<i class="fa-solid ${icon}"></i>
					</div>
					<p class="popup__title">${title}</p>
				</div>
				<div class="popup__body">
					<div class="popup__text">${text}</div>
					<div class="popup__button"></div>
				</div>
			</div>`;

		document.body.appendChild(popupEl);

		const buttonContainer = document.querySelector(".popup__button");
		buttonContainer.appendChild(buttonEl);

		buttonEl.onclick = () => {
			document.body.removeChild(popupEl);
			Settings.set("firstTime", true);
		};
	}
}

export default new Popup();
