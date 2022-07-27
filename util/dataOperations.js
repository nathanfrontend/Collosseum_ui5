sap.ui.define(["Nathan/Shaw/util/filters"], function (filterList) {
  "use strict";
  return {
    returnTodoItems: function (oController, sortKey, sortDescending) {
      return new Promise(function (resolve, reject) {
        var listName = "Shaw";

        if (listName) {
          var listNameFilter = [
            filterList.returnListNameFilter(listName),
            filterList.returnDeletedItemsFilter(false),
          ];
        } else {
          var listNameFilter = [filterList.returnDeletedItemsFilter(false)];
        }
        if (sortKey && typeof sortDescending === "boolean") {
          var mySorter = [new sap.ui.model.Sorter(sortKey, sortDescending)];
        } else {
          var mySorter = [];
        }

        // talk to the parent of the controller (component) and then get the Model from that which is "myservice" which is in manifest(global scoper)
        var oModel = oController.getOwnerComponent().getModel("myService");
        oModel.read("/RequestSet", {
          filters: listNameFilter,
          sorters: mySorter,
          success: function (data) {
            resolve(data);
          },
          error: function (oError) {
            reject(oError);
          },
        });
      });
    },

    createTodoItem: function (oController, oData) {
      return new Promise(function (resolve, reject) {
        var oModel = oController.getOwnerComponent().getModel("myService");
        //debugger;
        oModel.create("/ToDoListSet", oData, {
          success: function (data) {
            resolve(data);
          },
          error: function (oError) {
            reject(oError);
          },
        });
      });
    },
    updateTodoItem: function (oController, oData) {
      return new Promise(function (resolve, reject) {
        var sPath = "/ToDoListSet(" + oData.Id + ")";
        var oModel = oController.getOwnerComponent().getModel("myService");
        oModel.update(sPath, oData, {
          success: function (data) {
            resolve(data);
          },
          error: function (oError) {
            reject(oError);
          },
        });
      });
    },

    deleteTodoItem: function (oController, oData) {
      return new Promise(function (resolve, reject) {
        var sPath = "/ToDoListSet(" + oData.Id + ")";
        var oModel = oController.getOwnerComponent().getModel("myService");
        oModel.remove(sPath, {
          success: function (data) {
            resolve(data);
          },
          error: function (oError) {
            reject(oError);
          },
        });
      });
    },
  };
});
