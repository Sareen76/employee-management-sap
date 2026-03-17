sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel"
], function (BaseController, Historym, JSONModel) {
    "use strict";

    return BaseController.extend("com.capgemini.employeefs.controller.EmployeeDetails", {
        onInit: function () {
            const oVM = new JSONModel({
                "mode" : "",
                "dialogTitle" : ""
            })

            this.getView().setModel(oVM, "vm");

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

        onUpdate : function(){
            const dlgModel = new JSONModel({
                
            })
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