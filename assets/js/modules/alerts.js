class Alert {
	constructor() {
		this.types = {
			error: "fa-exclamation-circle",
			warning: "fa-exclamation-triangle",
			success: "fa-circle-check",
			info: "fa-circle-info",
			tipp: "fa-lightbulb",
		};
	}
	create(props = {}) {
		const alertTitle = props.title || props.type || "BFSE";
		const alertMessage = props.message || null;
		const alertType = props.type || "info";
		const alertIcon = this.types[alertType] || this.types.info;
		const alertDuration = props.duration || 1000;

		const alert = document.createElement("div");

		$(alert).addClass(["alert", `alert--${alertType}`]);
		$(alert).html(`
			<div class="alert__icon">
				<i class="fa-solid ${alertIcon}"></i>
			</div>
			<div class="alert__text">
				<p><strong>${alertTitle}</strong></p>
				${alertMessage ? `<p>${alertMessage}</p>` : ""}
			</div>
		`);

		$("#alerts").append(alert);

		// Remove after duration
		$(alert)
			.delay(1)
			.queue(function (next) {
				$(this).addClass("alert--show");
				next();
			})
			.delay(alertDuration)
			.queue(function (next) {
				$(this).removeClass("alert--show");
				next();
			})
			.delay(300)
			.queue(function () {
				$(this).remove();
			});

		// Remove on click
		$(alert).on("click", function () {
			$(this).removeClass("alert--show");

			$(this)
				.delay(300)
				.queue(function () {
					$(this).remove();
				});
		});
	}
}

export default new Alert();
