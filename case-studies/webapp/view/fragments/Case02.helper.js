sap.ui.define(["sap/ui/model/Filter", "sap/m/MessageToast", "sap/ui/model/FilterOperator"], function (Filter, MessageToast, FilterOperator) {
  "use strict";

  return {
    onProductSearch: function (oEvent, oView) {
      const sQuery = (oEvent.getParameter("newValue") || "").trim();

      const oTable = oView.byId(
        sap.ui.core.Fragment.createId(oView.getId(), "productsTable")
      );

      if (!oTable) {
        return;
      }

      const oBinding = oTable.getBinding("items");
      if (!oBinding) {
        MessageToast.show(
          "Search is currently unavailable. Please reload the page."
        );

        return;
      }

      // Clear filters when search is empty
      if (!sQuery) {
        oBinding.filter([]);
        MessageToast.show("Please Enter a Value to Search");
        return;
      }

      // OR-based filters across multiple fields
      const aFilters = [
        new Filter("ProductName", FilterOperator.Contains, sQuery),
        new Filter("QuantityPerUnit", FilterOperator.Contains, sQuery)
      ];

      const oCombinedFilter = new Filter({
        filters: aFilters,
        and: false// OR
      });

      oBinding.filter(oCombinedFilter);
    }
  };
});
