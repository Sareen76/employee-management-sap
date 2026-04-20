sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  return Controller.extend("com.capgemini.casestudies.controller.Case03", {
    onOrderPress: function (oEvent) {
      const oItem = oEvent.getSource();
      const sOrderID = oItem.getBindingContext().getProperty("OrderID");
      this.getOwnerComponent().getRouter().navTo("Case03Details", {
        OrderID: sOrderID
      });
    }
  });
});
