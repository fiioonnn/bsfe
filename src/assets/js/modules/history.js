class History {
	constructor() {
		this.history = [];
	}

	add(entry) {
		entry.date = new Date().toLocaleString();
		this.history.push(entry);
		this.update();
	}

	update() {
		// remove all from #history but the first one
		$("#history")
			.children()
			.each(function (i) {
				if (i === 0) return;
				$(this).remove();
			});

		this.history.forEach((entry) => {
			$(`
				<li class="nav__item nav__item--entry">
					<p>${entry.date}</p>
					<p>${entry.text}</p>
				</li>`).insertAfter("#history > li:first-child", "test");
		});
	}
}

export default new History();
