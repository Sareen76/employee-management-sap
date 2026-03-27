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
          this.byId("empTable").getBinding("items").refresh();
          MessageToast.show("RouteEmployee matched");
        },
onSearch : function(oEvent){
  console.log(oEvent);
},
onSortAsc : function(){
  this._applySort("FirstName", true);
},
onSortDesc : function(){
  this._applySort("FirstName", false);
},

_applySort: function (path, ascending) {
    const oTable = this.byId("empTable");
    const oBinding = oTable.getBinding("items");
    const oSorter = new sap.ui.model.Sorter(path, !ascending);
    oBinding.sort(oSorter);
},

onFilterDialog: function () {
  if (!this._filterDialog) {
    this._filterDialog = new sap.m.Dialog({
      title: 'Filter',
      content: [
        new sap.m.Input("filterName", {
          placeholder: "Filter by First Name"
        }),
        new sap.m.Input("filterJobTitle", {
          placeholder: "Filter by Job Title"
        })
      ],
      beginButton: new sap.m.Button({
        text: "Apply",
        press: () => this._applyFilter()
      }),
      endButton: new sap.m.Button({
        text: "Cancel",
        press: () => this._filterDialog.close()
      })
    });
  }
  this._filterDialog.open();
},

_applyFilter: function () {
  const aFilters = [];  

  const sName = this.byId("filterName").getValue();
  const sJobTitle = this.byId("filterJobTitle").getValue();

  // Filter by First Name
  if (sName) {
    aFilters.push(new sap.ui.model.Filter(
      "FirstName",
      sap.ui.model.FilterOperator.Contains,
      sName
    ));
  }

  // ✅ Fixed: use sJobTitle instead of wrong variable
  if (sJobTitle) {
    aFilters.push(new sap.ui.model.Filter(
      "JobTitle",
      sap.ui.model.FilterOperator.Contains,
      sJobTitle
    ));
  }

  const oTable = this.byId("myTable");
  const oBinding = oTable.getBinding("items");
  console.log(aFilters);

  oBinding.filter(aFilters);
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
