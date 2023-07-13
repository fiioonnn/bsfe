// class Editor {
// 	constructor() {
// 		this.fields = [];
// 		this.init();
// 	}

// 	init() {
// 		$(".editor").on("click", (e) => {
// 			// if target is not .fields or .editor__inner return
// 			if (!$(e.target).is(".fields") && !$(e.target).is(".editor__inner"))
// 				return;

// 			Fields.unselect();
// 			$("#fields > .field").removeClass("field--active");
// 		});
// 	}

// 	registerFields() {
// 		$("#fields > .field").each(function () {
// 			if (this.fields.includes(this)) return;

// 			$(this).on("click", () => {
// 				console.log("Selected", $(this).attr("id"));
// 			});

// 			fields.push(this);
// 		});
// 	}
// }

// export default new Editor();
