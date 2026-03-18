sap.ui.define(
  [
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
  ],
  function (BaseController, History, JSONModel) {
    "use strict";

    return BaseController.extend(
      "com.capgemini.employeefs.controller.EmployeeDetails",
      {
        onInit: function () {
          const oVM = new JSONModel({
            mode: "",
            dialogTitle: "",
          });

          this.getView().setModel(oVM, "vm");

          this.getOwnerComponent()
            .getRouter()
            .getRoute("RouteEmployeeDetails")
            .attachPatternMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function (oEvent) {
          const sId = oEvent.getParameter("arguments").ID;
          var sPath = `/Employees(${sId})`;

          this.getView().bindElement({
            path: sPath,
            parameters: {
              $expand: "Department",
            },
          });

          console.log(this.getView().getBindingContext);
        },

        onUpdate: function () {
          const src = this.getView().getBindingContext().getObject();

          // PRECISE: include only editable fields
          const dlgData = {
            FirstName: src.FirstName,
            LastName: src.LastName,
            Email: src.Email,
            JobTitle: src.JobTitle,
            Status: src.Status,
            HireDate: src.HireDate,
            Department_ID: src.Department_ID,
          };

          this.getView().setModel(
            new sap.ui.model.json.JSONModel(dlgData),
            "dlg",
          );

          const vm = this.getView().getModel("vm");
          vm.setProperty("/mode", "UPDATE");
          vm.setProperty("/dialogTitle", "Update Employee");

          this._editPath = this.getView().getBindingContext().getPath();
          this.getDialog().open();
        },
        onUpdateSave: async function () {
          const updatedData = this.getView().getModel("dlg").getData();
          const originalData = this.getView().getBindingContext().getObject();
          const oModel = this.getView().getModel();
          const oContext = oModel.bindContext(this._editPath).getBoundContext();

          const skip = new Set(["ID", "CreatedAt", "ModifiedAt", "Department"]);
          let changed = 0;

          // Build minimal PATCH (only changed primitive fields)
          for (const [key, val] of Object.entries(updatedData)) {
            // Skip non-editable / server-managed / navigation properties
            if (skip.has(key)) continue;

            // Skip nested objects (OData V4 does NOT allow them in PATCH)
            if (val !== null && typeof val === "object") continue;

            // Only PATCH when value actually changed
            if (originalData[key] !== val) {
              oContext.setProperty(key, val);
              changed++;
            }
          }

          // No changes → no PATCH
          if (!changed) {
            sap.m.MessageToast.show("No Changes To Update.");
            this.getDialog().close();
            return;
          }

          try {
            // Send the PATCH (batch submit)
            await oModel.submitBatch(
              oModel.getUpdateGroupId ? oModel.getUpdateGroupId() : "$auto",
            );

            sap.m.MessageToast.show("Employee Details Updated Successfully");
            this.getDialog().close();

            // Refresh detail page binding
            const detailCtx = this.getView().getBindingContext();
            if (detailCtx) detailCtx.refresh();
          } catch (e) {
            console.error(e);
            sap.m.MessageBox.error("Update Failed");
          }
        },
       onDelete: function () {
  const oModel = this.getOwnerComponent().getModel();  // OData V4 model
  const oCtx   = this.getView().getBindingContext();   // Context for /Employees(<id>)

  sap.m.MessageBox.warning("Are you sure you want to delete this employee?", {
    actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
    emphasizedAction: sap.m.MessageBox.Action.DELETE,
    onClose: async (action) => {
      if (action === sap.m.MessageBox.Action.DELETE) {
        try {
          await oCtx.delete("$auto");                   // <-- call delete on Context
          sap.m.MessageToast.show("Employee Deleted Successfully");
          this.onNavBack();                             // your existing nav back
        } catch (e) {
          console.error(e);
          sap.m.MessageBox.error("Delete failed");
        }
      }
    }
  });
},

        onNavBack: function () {
          var oHistory = History.getInstance();
          var sPrevHash = oHistory.getPreviousHash();

          if (sPrevHash !== undefined) {
            window.history.go(-1);
          } else {
            this.getOwnerComponent()
              .getRouter()
              .navTo("RouteEmployee", {}, true);
          }
        },
      },
    );
  },
);
