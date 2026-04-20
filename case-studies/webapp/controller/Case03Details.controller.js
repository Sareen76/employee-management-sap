sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend(
    "com.capgemini.casestudies.controller.Case03Details",
    {
      onInit: function () {
        this.getOwnerComponent()
          .getRouter()
          .getRoute("Case03Details")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {

        const sOrderID = oEvent.getParameter("arguments").OrderID;
        console.log(sOrderID)

        this.getView().bindElement({
          path: `/Orders(${sOrderID})`,
          parameters: {
            expand: "Order_Details,Order_Details/Product"
          }
        });
      }
    }
  );
});
