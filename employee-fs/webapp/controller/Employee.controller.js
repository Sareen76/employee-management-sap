sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function (Controller, MessageToast) {
  "use strict";

  return Controller.extend("com.capgemini.employeefs.controller.Employee", {
    onInit: function () {
      // Attach once when this controller is created
      var oRouter = this.getOwnerComponent().getRouter();
      // Save the bound handler so you can detach later if needed
      this._fnOnRouteMatched = this.onRouteMatched.bind(this);
      oRouter.getRoute("RouteEmployee").attachPatternMatched(this._fnOnRouteMatched, this);
    },

    onRouteMatched: function (oEvent) {

      MessageToast.show("RouteEmployee matched");
    },

    onItemPress: function(oEvent){
      alert('pressed');
        const oModel = oEvent.getParameter('listItem').getBindingContext();
        const id = oModel.getProperty("ID");
        this.getOwnerComponent().getRouter().navTo(`RouteEmployeeDetails`, { ID: encodeURIComponent(id) })
    },

    onExit: function () {
      // Good hygiene: detach the handler to avoid duplicates/leaks
      var oRouter = this.getOwnerComponent().getRouter();
      if (this._fnOnRouteMatched) {
        oRouter.getRoute("RouteEmployee").detachPatternMatched(this._fnOnRouteMatched, this);
        this._fnOnRouteMatched = null;
      }
    },

    
  });
});