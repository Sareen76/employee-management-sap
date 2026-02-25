sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
  "use strict";

  return Controller.extend("com.capgemini.employeefs.controller.Dashboard", {
    onInit: function () {
      // JSON model holds UI state (backend choice). Default to CAP.
      var oUi = new JSONModel({ backend: "CAP" });
      this.getView().setModel(oUi, "ui");

      // Restore last choice from localStorage, if available and valid
      try {
        var serverLast = window.localStorage.getItem("backend");
        var allowed = ["CAP", "SEGW"];
        if (allowed.indexOf(serverLast) !== -1) {
          oUi.setProperty("/backend", serverLast);
        }
      } catch (e) {
        // Ignore storage errors (e.g., blocked storage)
      }

      // Apply the effective backend on startup
      this._applyBackend(oUi.getProperty("/backend"));
    },

    onBackendChange: function (oEvent) {
      var serverKey = oEvent.getSource().getSelectedKey(); // "CAP" | "SEGW"
      
      // TODO: remove this early return when feature is ready
      if (true) {
        
var oSelect = oEvent.getSource(); // sap.m.Select
  oSelect.setSelectedKey("CAP");  

        MessageToast.show("Service Under Construction");
        return;
      }

      // Persist choice
      try {
        window.localStorage.setItem("backend", serverKey);
      } catch (e) {
        // Ignore storage errors
      }

      // Apply app behavior for selected backend
      this._applyBackend(serverKey);

      // Notify user
      MessageToast.show("Backend switched to " + serverKey);
    },

    /**
     * Switch app behavior depending on backend.
     * Implement your switching logic here (e.g., reconfigure models/routes).
     * @param {"CAP"|"SEGW"} serverKey
     */
    _applyBackend: function (serverKey) {
      // Example skeleton:
      // if (serverKey === "CAP") {
      //   // Recreate/rebind models to CAP services
      // } else {
      //   // Recreate/rebind models to SEGW services
      // }
    },

    onOpenEmployees: function (oEvent){      this.getOwnerComponent().getRouter().navTo("RouteEmployee");
    }

  });
});