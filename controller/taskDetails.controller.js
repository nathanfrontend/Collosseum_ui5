sap.ui.define(
  [
    "Nathan/Shaw/controller/baseController",
    "sap/ui/model/json/JSONModel",
    "Nathan/Shaw/util/dataOperations",
  ],
  function (baseController, JSONModel, dataOperations, MessageBox) {
    "use strict";

    return baseController.extend("Nathan.Shaw.controller.taskDetails", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */
      onInit: function () {
        var oRouter = this.getRouter();
        oRouter
          .getRoute("taskDetails")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      //   _onRouteMatched: function (oEvent) {
      // var oArgs, oView;

      // oArgs = oEvent.getParameter("arguments").taskId;
      // oView = this.getView();

      // oView.bindElement({
      //   path: "/(" + oArgs.taskId + ")",
      // });
      //     var oArgs, oView;
      // //     oArgs = oEvent.getParameter("arguments");
      // //     oView = this.getView();

      // //     oView.bindElement({
      // //       path: "/Id(" + oArgs.taskId + ")",
      // //       model: "myService",

      // //       events: {
      // //         change: this._onBindingChange.bind(this),
      // //         dataRequested: function (oEvent) {
      // //           oView.setBusy(true);
      // //         },
      // //         dataReceived: function (oEvent) {
      // //           oView.setBusy(false);
      // //         },
      // //       },
      // //     });
      // //   },
      // //   _onBindingChange: function (oEvent) {
      // //     // No data for the binding
      // //     if (!this.getView().getBindingContext()) {
      // //       this.getRouter().getTargets().display("notFound");
      // //     }
      // //     this.byId("taskId").getModel("oDataModel");
      // //   },

      _onRouteMatched: function (oEvent) {
        var sTaskId = oEvent.getParameter("arguments").taskId;
        this.getModel("myService")
          .metadataLoaded(true)
          .then(
            function () {
              var sPath = this.getModel("myService").createKey("ToDoListSet", {
                Id: sTaskId,
              });
              console.log("attachmached");
              this._bindView("/" + sPath);
            }.bind(this)
          );
        this.setItemsModel(sTaskId);
        // this. method that reads the data(sPath here)
      },

      setItemsModel: function (sortKey, sortDescending) {
        dataOperations
          .returnTodoItems(this, sortKey, sortDescending)
          .then(
            function (oData) {
              var oDataModel = new JSONModel(oData);
              this.getView().setModel(oDataModel, "oDataModel");
            }.bind(this)
          )
          .catch(
            function (oError) {
              console.error(oError);
              MessageBox.error(oError);
            }.bind(this)
          );
      },

      _bindView: function (sPath) {
        var oView = this.getView();

        this.getView().bindElement({
          path: sPath,
          model: "myService",
          events: {
            dataRequested: function () {
              oView.setBusy(true);
            },
            dataReceived: function () {
              oView.setBusy(false);
            },
          },
        });
      },
      oDataCall: function () {
        this.getView()
          .getModel("myService")
          .read("/ToDoListSet", {
            success: function (data) {
              var todoListModel = new JSONModel(data);
              this.getView().setModel(todoListModel, "myItems");
            },
          });
      },

      /**
       * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
       * (NOT before the first rendering! onInit() is used for that one!).
       */
      onBeforeRendering: function () {},

      /**
       * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
       * This hook is the same one that SAPUI5 controls get after being rendered.
       */
      onAfterRendering: function () {},

      /**
       * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
       */
      onExit: function () {},
    });
  }
);
