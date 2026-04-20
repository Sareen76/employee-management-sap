sap.ui.define(
  [
    "./BaseController",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "com/capgemini/employeefs/util/PDFExport",
  ],
  function (BaseController, MessageToast, Fragment, JSONModel, PDFExport) {
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
        onSearch: function (oEvent) {
          console.log(oEvent);
        },
        onSortAsc: function () {
          this._applySort("FirstName", true);
        },
        onSortDesc: function () {
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
              title: "Filter",
              content: [
                new sap.m.Input("filterName", {
                  placeholder: "Filter by First Name",
                }),
                new sap.m.Input("filterJobTitle", {
                  placeholder: "Filter by Job Title",
                }),
              ],
              beginButton: new sap.m.Button({
                text: "Apply",
                press: () => this._applyFilter(),
              }),
              endButton: new sap.m.Button({
                text: "Cancel",
                press: () => this._filterDialog.close(),
              }),
            });
          }
          this._filterDialog.open();
        },

        _applyFilter: function () {
          const aFilters = [];
          const sName = sap.ui.getCore().byId("filterName").getValue();
          const sJobTitle = sap.ui.getCore().byId("filterJobTitle").getValue();
          console.log(sName);

          // Filter by First Name
          if (sName) {
            aFilters.push(
              new sap.ui.model.Filter(
                "FirstName",
                sap.ui.model.FilterOperator.Contains,
                sName,
              ),
            );
          }
          // Filter by Job Title is Given
          if (sJobTitle) {
            aFilters.push(
              new sap.ui.model.Filter(
                "JobTitle",
                sap.ui.model.FilterOperator.Contains,
                sJobTitle,
              ),
            );
          }

          const oTable = this.byId("empTable");
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
          this.getView()
            .getModel("vm")
            .setProperty("/dialogTitle", "Create Employee");

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

        onUploadExcel: async function () {
          if (!this._excelDialog) {
            this._excelDialog = await Fragment.load({
              id: this.getView().getId(),
              name: "com.capgemini.employeefs.view.ExcelUpload",
              controller: this,
            });

            this.getView().addDependent(this._excelDialog);
          }

          this._excelDialog.open();
        },
        onFileChange: function (oEvent) {
          const aFiles = oEvent.getParameter("files");
          console.log(aFiles)
          if (!aFiles || aFiles.length === 0) {
            console.error("No file selected");
            return;
          }

          const oFile = aFiles[0];

          // Store for further upload
          this._selectedFile = oFile;
        },

        onUploadExcelConfirm: function () {
          if (!this._selectedFile) {
            sap.m.MessageToast.show("Please choose a file first.");
            return;
          }

          const reader = new FileReader();

          // Just reader Definition
          reader.onload = (e) => {
            const bin = e.target.result;

            const workbook = XLSX.read(bin, { type: "binary" }); // create a clsx file object from binary string asw e go from the target or user uploads
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const excelData = XLSX.utils.sheet_to_json(sheet);

            console.log("Parsed Excel:", excelData);

            this._uploadEmployees(excelData);
            this._excelDialog.close();
          };

          // Now we say that reader to read the xlsx file in binary string format
          reader.readAsArrayBuffer(this._selectedFile);
        },
        _uploadEmployees: async function (excelData) {
          const oModel = this.getView().getModel(); // OData V4 model

          if (!excelData.length) {
            sap.m.MessageToast.show("No rows to upload.");
            return;
          }

          /**
           * ✅ BATCH REQUEST (Recommended)
           * All create operations are queued and sent in ONE single $batch request.
           * This is much faster and reduces backend load.
           */
          const oListBinding = oModel.bindList(
            "/Employees",
            undefined,
            undefined,
            undefined,
            {
              $$updateGroupId: "batchUploadGroup",
            },
          );

          try {
            // Queue all create operations
            excelData.forEach((row) => {
              oListBinding.create(row); // deferred create
            });

            // ✅ Send everything in ONE batch
            await oModel.submitBatch("batchUploadGroup");

            sap.m.MessageToast.show(
              "All employees uploaded in a single batch!",
            );
            console.log("Batch upload success:", excelData);
            this.byId("empTable").getBinding("items").refresh();
          } catch (err) {
            console.error("Batch upload error:", err);
            sap.m.MessageToast.show("Batch upload failed. Check console.");
          }

          /**
           * ❌ NON-BATCH VERSION (NOT RECOMMENDED)
           * Keeping this commented for future reference.
           * This version sends MANY separate network requests.
           *
           * try {
           *     for (const row of excelData) {
           *         await oListBinding.create(row).created();
           *         console.log("Uploaded:", row);
           *     }
           *
           *     sap.m.MessageToast.show("All employees uploaded successfully!");
           * } catch (err) {
           *     console.error("Upload error:", err);
           *     sap.m.MessageToast.show("Upload failed. See console.");
           * }
           */
        },
        onDialogCancel: function () {
          this._excelDialog.close();
        },

        onBatchDelete: async function () {
          const oTable = this.byId("empTable");
          const aSelectedContexts = oTable.getSelectedContexts();
          if (!aSelectedContexts.length) {
            return sap.m.MessageToast.show("Select at least one employee.");
          }
          const oModel = this.getView().getModel();

          try {
            // Queue deletes (group ID is passed as STRING)
            aSelectedContexts.forEach((oCtx) => oCtx.delete("BatchDelete"));

            // One $batch submit
            await oModel.submitBatch("BatchDelete");

            sap.m.MessageToast.show("Employees deleted successfully!");
            this.byId("empTable").getBinding("items").refresh();
          } catch (err) {
            console.error("Delete failed:", err);
            sap.m.MessageToast.show("Delete failed");
          }
        },

        onDownloadPDF: function () {
          const oTable = this.byId("empTable");

          // ✅ 1. Extract VISIBLE column labels dynamically

          const aColumnLabels = oTable.getColumns().map((col) => {
            const oHeader = col.getHeader(); // ALWAYS exists
            return oHeader?.getText?.() || "";
          });

          console.log(aColumnLabels);

          // ✅ 2. Extract bound property names dynamically
          // Read binding from template (ColumnListItem)
          const oTemplate = oTable.getBindingInfo("items").template;
          const aCells = oTemplate.getCells();
          const aColumnProperties = aCells.map((cell) =>
            cell.getBindingPath("text"),
          );

          // ✅ Build dynamic column definitions used by PDF util
          const aColumns = aColumnLabels.map((label, i) => ({
            label: label,
            property: aColumnProperties[i],
          }));

          // ✅ 3. Extract row data dynamically
          const aContexts = oTable.getBinding("items").getContexts();
          const aRows = aContexts.map((ctx) => ctx.getObject());

          // ✅ 4. Export to PDF
          PDFExport.exportTableToPDF(aColumns, aRows, "Employee_List");
        },

        onExit: function () {
          // Good hygiene: detach the handler to avoid duplicates/leaks
          var oRouter = this.getOwnerComponent().getRouter();
          if (this._fnOnRouteMatched) {
            oRouter
              .getRoute("RouteEmployee")
              .detachPatternMatched(this._fnOnRouteMatched, this);
            this._fnOnRouteMatched = null;
        },
      },
    );
  },
);

          }