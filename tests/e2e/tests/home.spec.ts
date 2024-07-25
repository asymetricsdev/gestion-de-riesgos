describe("The Home Page", () => {
	it("successfully loads", () => {
		cy.visit("/");
		cy.findByRole("heading", {
			name: "⚡ Gestion de Riesgos",
		}).should("exist");
	});
});
