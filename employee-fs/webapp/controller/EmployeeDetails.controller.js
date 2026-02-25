sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("com.capgemini.employeefs.controller.Employee", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("RouteEmployeeDetails").attachPatternMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function (oEvent) {

            var sId = oEvent.getParameter("arguments").ID;
            var sPath = `/Employees(${sId})`;

            this.getView().bindElement({
                path: sPath,
                parameters: {
                    $expand: "Department"
                }
            });

            console.log(this.getView().getBindingContext);
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPrevHash = oHistory.getPreviousHash();

            if (sPrevHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteEmployee", {}, true)
        }

    }
});
});