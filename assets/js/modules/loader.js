class Loader {
	constructor() {
		this.loader = document.querySelector(".loader");
		this.loaderText = document.querySelector(".loader__text");
		this.init();
	}

	init() {
		if (!this.loader || this.loader === null) return;
	}

	set(props = {}) {
		this.loaderText.innerHTML = props.text;
		this.loader.classList.add("loader--show");
		if (props.event) {
			window.addEventListener(props.event, () => {
				this.hide();
			});
		}
		if (props.duration) {
			setTimeout(() => {
				this.hide();
			}, props.duration);
		}
	}

	hide() {
		this.loader.classList.remove("loader--show");
	}
}

export default new Loader();
