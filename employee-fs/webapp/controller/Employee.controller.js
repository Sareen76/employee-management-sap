sap.ui.define(
  ["./BaseController", "sap/m/MessageToast"],
  function (BaseController, MessageToast) {
    "use strict";

    return BaseController.extend(
      "com.capgemini.employeefs.controller.Employee",
      {
        onInit: function () {
          // Attach once when this controller is created
          var oRouter = this.getOwnerComponent().getRouter();

          const oVM = new sap.ui.model.json.JSONModel({
            mode: "",
            dialogTitle: "",
          });

          this.getView().setModel(oVM, "vm");

          // Save the bound handler so you can detach later if needed
          this._fnOnRouteMatched = this._onRouteMatched.bind(this);
          oRouter
            .getRoute("RouteEmployee")
            .attachPatternMatched(this._fnOnRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
          MessageToast.show("RouteEmployee matched");
        },

        onItemPress: function (oEvent) {
          const oModel = oEvent.getParameter("listItem").getBindingContext();
          const id = oModel.getProperty("ID");
          this.getOwnerComponent()
            .getRouter()
            .navTo(`RouteEmployeeDetails`, { ID: encodeURIComponent(id) });
        },

        onCreate: function () {

          //Dialog Model
          const dlgModel = new sap.ui.model.json.JSONModel({
            FirstName: "",
            LastName: "",
            Email: "",
            JobTitle: "",
            Status: "",
            HireDate: "",
            Department_ID: "",
          });

          this.getView().setModel(dlgModel, "dlg");

          // set the mode in vm model
          this.getView().getModel("vm").setProperty("/mode", "CREATE");
          this.getView().getModel("vm").setProperty("/dialogTitle", "Create Employee");

          this.getDialog().open();
        },
        onCreateSave: async function () {
          const oData = this.getView().getModel("dlg").getData(); // dialog JSON model
          const oModel = this.getView().getModel(); // OData V4 Model
          const oListBinding = oModel.bindList("/Employees"); // entity set

          try {
            await oListBinding.create(oData); // OData V4 CREATE → CAP POST

            sap.m.MessageToast.show("Employee Created Successfully!");
            this.getDialog().close();
            this.byId("empTable").getBinding("items").refresh();
          } catch (e) {
            sap.m.MessageBox.error("Failed to create employee");
          }
        },

        onExit: function () {
          // Good hygiene: detach the handler to avoid duplicates/leaks
          var oRouter = this.getOwnerComponent().getRouter();
          if (this._fnOnRouteMatched) {
            oRouter
              .getRoute("RouteEmployee")
              .detachPatternMatched(this._fnOnRouteMatched, this);
            this._fnOnRouteMatched = null;
          }
        },
      },
    );
  },
);
