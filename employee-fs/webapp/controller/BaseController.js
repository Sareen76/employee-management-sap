sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox"],
  function (Controller, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend(
      "com.capgemini.employeefs.controller.BaseController",
      {
        getDialog: function () {
          if (!this._oDialog) {
            this._oDialog = sap.ui.xmlfragment(
              this.getView().getId(),
              "com.capgemini.employeefs.view.CreateEdit", // fragment path
              this,
            );
            this.getView().addDependent(this._oDialog);
          }
          return this._oDialog;
        },
        onDialogSave: function () {
    const mode = this.getView().getModel("vm").getProperty("/mode");

    if (mode === "CREATE") {
        return this.onCreateSave(); 
    } else {
        return this.onUpdateSave(); 
    }
},
        
        onDialogCancel: function(){
          this.getDialog().close();
        }
      },
    );
  },
);
