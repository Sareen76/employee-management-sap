sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "com/capgemini/casestudies/view/fragments/Case02.helper",
  ],
  (Controller, MessageToast, JSONModel, Case02Helper) => {
    "use strict";

    return Controller.extend(
      "com.capgemini.casestudies.controller.CaseDetails",
      {
        onInit: function () {
          const oViewModel = new JSONModel({
            title: "Case Details : ",
            case: ""
          });

          // Maintaining Fragments Cache
          this._mFragments = {}; // .Fragment cache to solve Back n Forth
          this.CASE_REGISTRY = {
            case01: {
              fragment: "Case01",
              render: "Fragment",
              title: "Case 01 Materials Table"
            },
            case02: {
              fragment: "Case02",
              render: "Fragment",
              title: "Case 02 Search & Filter"
            },
            case03: {
              view: "Case03",
              render: "View",
              title: "Case 03 Master-Detail Page"
            }
          };

          this.getView().setModel(oViewModel, "viewModel");
          this.getOwnerComponent()
            .getRouter()
            .getRoute("CaseDetails")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
          const sCaseId = oEvent.getParameter("arguments").caseId;
          const oViewModel = this.getView().getModel("viewModel");

          const sFormattedCase = sCaseId.replace("case", "Case ").toUpperCase();
          oViewModel.setProperty("/title", "Case Details : " + sFormattedCase);
          oViewModel.setProperty("/case", sCaseId);

          this._loadCase(sCaseId);
        },

        _loadCase: function (sCaseId) {
          this.byId("caseContent").removeAllItems();

          const oCase = this.CASE_REGISTRY[sCaseId];

          if (!oCase) {
            MessageToast.show("Unknown case : " + sCaseId);
            return;
          }

          if (oCase.render === "Fragment") {
            this._loadFragmentForCase(oCase.fragment);
          } else if (oCase.render === "View") {
            this.getOwnerComponent().getRouter().navTo(oCase.view);
          }
        },

        _loadFragmentForCase: async function (sCaseId) {
          const oContainer = this.byId("caseContent");

          // remove current content from layout
          oContainer.removeAllItems();

          // load fragment only once
          if (!this._mFragments[sCaseId]) {
            this._mFragments[sCaseId] = await this.loadFragment({
              name: "com.capgemini.casestudies.view.fragments." + sCaseId
            });
          }

          // reuse existing fragment instance
          oContainer.addItem(this._mFragments[sCaseId]);
        },
        
        // Functionalities Logics

        onProductSearch: function (oEvent) {
          Case02Helper.onProductSearch(oEvent, this.getView());
        },
      },
    );
  },
);
