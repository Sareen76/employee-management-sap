sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel"], (Controller,
	JSONModel) => {
  "use strict";

  return Controller.extend("com.capgemini.casestudies.controller.Dashboard", {
    onInit() {
      const CASE_STUDIES = [
        {
          caseId: "case01",
          title:
            "Build a SAPUI5 app to display Materials in a table using OData V2 service",
        },
        {
          caseId: "case02",
          title:
            "Create a UI5 app with search field and live filtering on Product List",
        },
        {
          caseId: "case03",
          title: "Develop a Master-Detail application for Sales Orders",
        },
        {
          caseId: "case04",
          title:
            "Implement sorting, filtering and grouping on responsive table",
        },
        { caseId: "case05", title: "Add value help dialog with multi-select" },
        {
          caseId: "case06",
          title: "Download table data to Excel using client-side export",
        },
        { caseId: "case07", title: "Show busy indicator for long OData calls" },
        {
          caseId: "case08",
          title: "Add formatter functions for currency and date fields",
        },
        { caseId: "case09", title: "Display Material Stock on Google Maps" },
        {
          caseId: "case10",
          title: "Create dashboard with KPIs using VizFrame charts",
        },
        { caseId: "case11", title: "Implement CRUD operations using OData V2" },
        {
          caseId: "case12",
          title: "Create Purchase Requisition form with validations",
        },
        { caseId: "case13", title: "File upload to backend OData service" },
        { caseId: "case14", title: "Wizard-based Customer onboarding" },
        { caseId: "case15", title: "OData V4 with side effects" },
        { caseId: "case16", title: "Upload collection for attachments" },
        {
          caseId: "case17",
          title: "Message pop-up and MessageManager integration",
        },
        { caseId: "case18", title: "Live OData suggest search" },
        { caseId: "case19", title: "Handle OData batch requests" },
        {
          caseId: "case20",
          title: "Backend error display using MessageManager",
        },
        { caseId: "case21", title: "Create List Report using CDS annotations" },
        {
          caseId: "case22",
          title: "Extend standard Fiori app using Adaptation Editor",
        },

        {
          caseId: "case23",
          title: "Add custom field via Key User Extensibility",
        },
        { caseId: "case24", title: "Create Object Page with multiple facets" },
        { caseId: "case25", title: "Draft-enabled transactional application" },
        { caseId: "case26", title: "Analytical List Page with KPIs" },
        { caseId: "case27", title: "Custom action on Object Page" },
        { caseId: "case28", title: "Reuse component integration" },
        { caseId: "case29", title: "Inline editing in table rows" },
        { caseId: "case30", title: "Freestyle UI5 extension for custom logic" },
      ];
      const oCasesModel = new JSONModel(CASE_STUDIES);
      this.getView().setModel(oCasesModel, "cases");
    },

    onCasePress: function (oEvent) {
      const sCaseId = oEvent.getSource().data("caseId");
      this.getOwnerComponent().getRouter().navTo("CaseDetails", {
        caseId: sCaseId,
      });
    },
  });
});
