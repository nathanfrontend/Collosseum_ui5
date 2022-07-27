sap.ui.define(
  [
    "Nathan/Shaw/controller/baseController",
    "Nathan/Shaw/util/fragmentManager",
    "Nathan/Shaw/util/dataOperations",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "jquery.sap.global",
    "sap/ui/table/library",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "Nathan/Shaw/util/xlsx",

    // When using these sap models/controller - pass through original function to then be used later when needed, need to be in order
  ],
  function (
    baseController,
    fragmentManager,
    dataOperations,
    JSONModel,
    MessageToast,
    MessageBox,
    jQuery,
    library,
    Sorter,
    Filter,
    FilterOperator,
    xlsx
  ) {
    "use strict";
    var SortOrder = library.SortOrder;

    return baseController.extend("Nathan.Shaw.controller.mainView", {
      /**
       * Called when a controller is instantiated and its View controls (if available) are already created.
       * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
       */

      onInit: function () {
        // Object created to then be used as a JSONModel
        var oLocalValues = {
          "new-task-input": "",
          "new-created-by": "",
          date: new Date(),
          description: "",
        };

        // We instantiate the JSON Model
        var oLocalModel = new JSONModel(oLocalValues);
        // sets a model for our XML view, and pass it through our newly created model - 'localValueModel'
        this.getView().setModel(oLocalModel, "localValueModel");
        console.log(this.getView().getModel("localValueModel"));
        var h = this.getView().getModel("mockDataModel");
        this.setItemsModel();
        this.getRouter().getRoute("main");

        // var loading = google.charts.load("current", {
        //   packages: ["corechart"],
        // });

        // loading.then(
        //   function () {
        //     this.drawChart();
        //   }.bind(this)
        // );
      },

      // If the promise created in dataOperations succeeds when called then fulfil this promise - else the catch is then operated. When it gets a response it will create a new JSON model with the data and asign it to a new model.

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
      navToTaskDetails: function (oEvent) {
        var item = oEvent
          .getSource()
          .getBindingContext("oDataModel")
          .getObject();
        var taskId;
        this.getRouter().navTo("taskDetails", {
          taskId: item.Id,
        });

        // console.log(detailsModel.oData);
      },

      onBeforeRendering: function () {},

      /**n
       * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
       * This hook is the same one that SAPUI5 controls get after being rendered.
       */
      onAfterRendering: function () {
        var loading = google.charts.load("current", {
          packages: ["corechart"],
        });
        var myDataCall = this.getMyData();

        Promise.all([loading, myDataCall]).then(
          function (promiseResolves) {
            this.drawChartWithData(promiseResolves[1]);
          }.bind(this)
        );
      },
      returnDeletedItemsFilter: function (deletedFlag) {
        return new Filter("Deleted", "EQ", deletedFlag);
      },

      /**
       * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
       */
      getMyData: function () {
        return new Promise(
          function (resolve, reject) {
            var myDeletedFlag = myDeletedFlag === true ? true : false;
            var filters = [this.returnDeletedItemsFilter(myDeletedFlag)];

            this.getView()
              .getModel("myService")
              .read("/ToDoListSet", {
                filters: filters,
                success: function (data) {
                  resolve(data);
                }.bind(this),
                error: function (oError) {
                  console.log(oError);
                },
              });
          }.bind(this)
        );
      },
      drawChartWithData: function (data) {
        // Create the data table.
        var tasksPerList = this.returnListNamesWithNumberOfTasks(data.results);

        var data = new google.visualization.DataTable();
        data.addColumn("string", "Listname");
        data.addColumn("number", "NumberOfTasks");
        data.addRows(Object.entries(tasksPerList));

        // Set chart options
        var options = {
          title: "Existing tasks within UI5 Team",
          width: 1027,
          height: 300,
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(
          this.getView().byId("myHBox").getDomRef()
        );
        chart.draw(data, options);
      },
      returnDeletedItemsFlag: function (results) {},
      returnListNamesWithNumberOfTasks: function (results) {
        var uniqueListNames = {};
        results.forEach(function (item) {
          var listName = item.Listname;
          listName = listName.toLowerCase();
          uniqueListNames[listName] = 1 + (uniqueListNames[listName] || 0);
        });
        return uniqueListNames;
      },
      onAddPress: function (oEvent) {
        var editToDo = fragmentManager.add(this);
        editToDo.open();
      },
      onSaveAddPress: function (oEvent) {
        //this.addDialog = sap.ui.xmlfragment("Nathan.Shaw.view.createdBy", this);
        //this.addDialog.open();

        var oLocalModel = this.getView().getModel("localValueModel");
        var sNewValue = oLocalModel.getProperty("/new-task-input");
        var sCreatedBy = oLocalModel.getProperty("/new-created-by");
        var dDatePicked = oLocalModel.getProperty("/date");
        var dDescription = oLocalModel.getProperty("/description");

        var sMessage =
          "Item Added: " + " " + sNewValue + " " + "by " + sCreatedBy;
        if (sNewValue.length && sCreatedBy.length > 0) {
          fragmentManager.add(this).close();

          //create a new task to add to our array
          var oTask = {
            Title: sNewValue,
            Createdby: sCreatedBy,
            Duedate: dDatePicked,
            Description: dDescription,
            Listname: "Shaw",
          };
          oTask.Duedate = new Date(oTask.Duedate);
          //debugger;

          dataOperations
            .createTodoItem(this, oTask)
            .then(function (oData) {
              MessageToast.show(sMessage);
              oLocalModel.setProperty("/new-task-input", "");
              oLocalModel.setProperty("/new-created-by", "");
              oLocalModel.setProperty("/date", "");
              oLocalModel.setProperty("/description", "");

              // do something with the data
            })
            .catch(function (oError) {
              // what if it errors???
              MessageBox.error(oError);
            });

          //oModel.setProperty("/results", aTask);
        } else {
          MessageToast.show("Input every Field!");
        }
      },
      onCancelAddPress: function () {
        fragmentManager.add(this).close();
        var oLocalModel = this.getView().getModel("localValueModel");
        oLocalModel.setProperty("/new-task-input", "");
        console.log(oLocalModel.getProperty("/new-created-by"));
        oLocalModel.setProperty("/date", "");
        oLocalModel.setProperty("/description", "");
        console.log(this.getView().getModel("localValueModel"));
      },
      onEditPress: function (oEvent) {
        //Getting the source of the event - and then the binding context that is associted to it
        //- so in this case, the button is bound to a propogated property/parent - mockDataModel
        var oContext = oEvent.getSource().getBindingContext("oDataModel");
        var sPath = oContext.getPath();
        var iIndex = parseInt(sPath.match(/\d+/)[0]);
        // you can use Object.assign() for shallow-copies, use JSON parse and stringify for deep copies
        var oTodo = Object.assign({}, oContext.getObject());

        // fragment stuff...
        var editTodo = fragmentManager.edit(this);
        var oActualData = {
          index: iIndex,
          Title: oTodo,
        };

        var editModel = new JSONModel(oActualData);
        editTodo.setModel(editModel, "editTodo");

        editTodo.open();
      },
      onSaveEditPress: function (oEvent) {
        // get editTodo model
        var oEditModel = fragmentManager.edit(this).getModel("editTodo");
        // get data from EditTodo model
        var oData = oEditModel.getData();
        var iIndex = oData.index;
        var oTask = oData.Title;

        // update mockDataModel (get model, get data, update data, update model)
        var oLocalModel = this.getView().getModel("oDataModel");
        var aTasks = oLocalModel.getProperty("/results");

        //? bonus round: has any data changed?

        var oTaskOriginal = aTasks[iIndex];
        oTask.Duedate = new Date(oTask.Duedate);
        oTaskOriginal.Duedate = new Date(oTaskOriginal.Duedate);

        if (
          oTaskOriginal.Title !== oTask.Title ||
          oTaskOriginal.Createdby !== oTask.Createdby ||
          oTaskOriginal.Description !== oTask.Description ||
          oTaskOriginal.Duedate !== oTask.Duedate
        ) {
          fragmentManager.edit(this).close();
          aTasks[iIndex] = oTask;

          dataOperations
            .updateTodoItem(this, oTask)
            .then(function (oData) {
              oLocalModel.setProperty("/results", aTasks);
              MessageToast.show("Task updated");
            })
            .catch(function (oError) {
              MessageBox.error(oError);
            });
        } else {
          MessageToast.show("No changes made");
        }
      },

      onCancelEditBtnPress: function (oEvent) {
        //Closes the dialog box
        fragmentManager.edit(this).close();
      },

      onDeletePress: function (oEvent) {
        var oContext = oEvent.getSource().getBindingContext("oDataModel");
        var sPath = oContext.getPath();
        var iIndex = parseInt(sPath.match(/\d+/)[0]);
        var oTodo = Object.assign({}, oContext.getObject());

        // fragment stuff...
        var deleteTodo = fragmentManager.delete(this);
        var oActualData = {
          index: iIndex,
          Title: oTodo,
        };

        var deleteModel = new JSONModel(oActualData);
        deleteTodo.setModel(deleteModel, "deleteTodo");
        deleteTodo.open();
      },

      onSubmitDeletePress: function (oEvent) {
        var odeleteModel = fragmentManager.delete(this).getModel("deleteTodo");
        var oData = odeleteModel.getData();
        var iIndex = oData.index;
        var oLocalModel = this.getView().getModel("oDataModel");
        var aTasks = oLocalModel.getProperty("/results", aTasks);
        // aTasks.splice(iIndex, 1);
        console.log(oData.index);
        this.setItemsModel();

        dataOperations
          .deleteTodoItem(this, aTasks[iIndex])
          .then(function (oData) {
            MessageToast.show("This is where things get deleted!");
            oLocalModel.setProperty("/results", aTasks);
          })
          .catch(function (oError) {
            MessageBox.error(oError);
          });

        fragmentManager.delete(this).close();
      },

      onCancelDeletePress: function (oEvent) {
        fragmentManager.delete(this).close();
        MessageToast.show("Nothing was deleted, not to worry");
      },

      onSearch: function (oEvent) {
        var oFilter = [];
        var sQuery = oEvent.getParameter("query");
        if (sQuery) {
          oFilter.push(Filter("Title", FilterOperator.Contains, sQuery));
        }
        var oTable = this.byId("table");
        var oBinding = oTable.getBinding("items");
        oBinding.filter(oFilter);
      },
      onPressExcelExport: function (oEvent) {
        var myDataModel = this.getView().getModel("oDataModel");

        var myResultsArray = myDataModel.getProperty("/results");

        var workSheet = XLSX.utils.json_to_sheet(myResultsArray);
        console.log(workSheet);
        // new workbook

        var workBook = XLSX.utils.book_new();

        // new sheet and append workbook
        XLSX.utils.book_append_sheet(workBook, workSheet, "My Data Export");
        var sFileName = "My Data Export.xlsx";
        XLSX.writeFile(workBook, sFileName);
        // debugger;
      },

      // chart: function () {
      //   // Create the data table.
      //   var data = new google.visualization.DataTable();
      //   data.addColumn("string", "Topping");
      //   data.addColumn("number", "Slices");
      //   data.addRows([
      //     ["Mushrooms", 3],
      //     ["Onions", 1],
      //     ["Olives", 1],
      //     ["Zucchini", 1],
      //     ["Pepperoni", 2],
      //   ]);
      //   // Set chart options
      //   var options = {
      //     title: "How Much Pizza I Ate Last Night",
      //     width: 400,
      //     height: 300,
      //   };
      //   var HBoxDomRef = this.getView().byId("myHBox").getDomRef();
      //   // Instantiate and draw our chart, passing in our HBox.
      //   var chart = new google.visualization.PieChart(HBoxDomRef);
      //   chart.draw(data, options);
      // },
      onExit: function () {},
    });
  }
);
