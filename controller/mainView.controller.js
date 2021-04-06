sap.ui.define([
	"Nathan/Shaw/controller/baseController",
	"Nathan/Shaw/util/fragmentManager",
	"Nathan/Shaw/util/dataOperations",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"jquery.sap.global"
	// When using these sap models/controller - pass through original function to then be used later when needed, need to be in order
], function (baseController, fragmentManager, dataOperations, JSONModel, MessageToast, MessageBox, jQuery) {
	"use strict";

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
				"date": new Date(),
				"description": "",

			};

			// We instantiate the JSON Model
			var oLocalModel = new JSONModel(oLocalValues);
			// sets a model for our XML view, and pass it through our newly created model - 'localValueModel'
			this.getView().setModel(oLocalModel, "localValueModel");

			this.setItemsModel();
			this.getRouter().getRoute("main"); //.attachMatched(this._onRouteMatched, this);

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
				.catch(function (oError) {
					console.error(oError);
					MessageBox.error(oError);
				}.bind(this));
		},
		navToTaskDetails: function (oEvent) {
			var item = oEvent.getSource().getBindingContext("oDataModel").getObject();
			var taskId = item.Id;
			this.getRouter().navTo("taskDetails", {
				"taskId": taskId
			
			});
			console.log(taskId);
		},
		
		// _onRouteMatched: function (oEvent) {
		// 	console.log("routeMatched!");
		// 	var myModel = this.getOwnerComponent().getModel("");
        //     myModel.attachRequestCompleted(function(oEvent){
		// 		this.setItemsModel();
        //     }.bind(this));
		// },
		// onPressViewDetails: function (oEvent) {
		// 	var sObject = oEvent.getSource().getBindingContext("oDataModel").getObject();
		// 	var detailsModel = new JSONModel(sObject);
		// 	var taskDetails = fragmentManager.taskDetails(this);
		// 	taskDetails.setModel(detailsModel, "details");
		// 	taskDetails.open();
		// },



		onBeforeRendering: function () {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 */
		onAfterRendering: function () {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 */
		onExit: function () {

		},

		onAddPress: function(oEvent){
			var editToDo = fragmentManager.add(this)
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
			
			
			var sMessage = "Item Added: " + ' ' + sNewValue + ' ' + "by " + sCreatedBy;
			if (sNewValue.length && sCreatedBy.length  > 0) {
				fragmentManager.add(this).close();
			
				
				//create a new task to add to our array
				var oTask = {
				Title: sNewValue,
					Createdby: sCreatedBy,
					Duedate: dDatePicked ,
					Description:dDescription,
					Listname: "Shaw"


				};
				oTask.Duedate = new Date(oTask.Duedate);
				//debugger;
			
				dataOperations.
					createTodoItem(this, oTask)
					.then(function (oData) {
						MessageToast.show(sMessage);
						oLocalModel.setProperty("/new-task-input", "");
						oLocalModel.setProperty("/new-created-by", "");
						oLocalModel.setProperty("/date", "");
						oLocalModel.setProperty("/description", "");

						// do something with the data
					}).catch(function (oError) {
						// what if it errors???
						MessageBox.error(oError);


					})


				//oModel.setProperty("/results", aTask);





			}
			else {
				MessageToast.show("Input every Field!")
			}



		},
		onCancelAddPress: function(){
			fragmentManager.add(this).close();

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
			oTask.Duedate= new Date(oTask.Duedate);
			oTaskOriginal.Duedate= new Date(oTaskOriginal.Duedate);
			
			if (oTaskOriginal.Title !== oTask.Title || oTaskOriginal.Createdby !== oTask.Createdby  || oTaskOriginal.Description !== oTask.Description ||oTaskOriginal.Duedate !== oTask.Duedate  ) {
				fragmentManager.edit(this).close();
				aTasks[iIndex] = oTask;
				
				dataOperations.
				updateTodoItem(this, oTask)
				.then(function (oData) {
					
					oLocalModel.setProperty("/results", aTasks);
					MessageToast.show("Task updated");
					
				}).catch(function (oError) {
			
					MessageBox.error(oError);
				})
		
			
			}
		else{
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
			deleteTodo.setModel(deleteModel , "deleteTodo");
            deleteTodo.open();

			// dataOperations.
			// deleteTodoItem(this, oTask)
			// .then(function (oData) {
			// 	MessageToast.show("This is where things get deleted!");

				
			// }).catch(function (oError) {
		
			// 	MessageBox.error(oError);
			// })
	
	
		
		
	



		},


		onSubmitDeletePress: function (oEvent) {
        var odeleteModel = fragmentManager.delete(this).getModel("deleteTodo");
		var oData = odeleteModel.getData();
		var iIndex = oData.index;
		var oLocalModel = this.getView().getModel("oDataModel");
		var aTasks = oLocalModel.getProperty("/results", aTasks);
		// aTasks.splice(iIndex, 1);
		
		dataOperations.
			deleteTodoItem(this, aTasks[iIndex])
			.then(function (oData) {
				MessageToast.show("This is where things get deleted!");
				oLocalModel.setProperty("/results", aTasks);
			
				
			}).catch(function (oError) {
		
				MessageBox.error(oError);
			})

		fragmentManager.delete(this).close();
	
	
		},

		onCancelDeletePress: function(oEvent){
			fragmentManager.delete(this).close();
			MessageToast.show("Nothing was deleted, not to worry")
		}




	});
});

// Get binding context from oEvent and get the "object"

// Add fragments folder in "view" and share edit fragment

// Add util folder and fragmentManager.js

// Update click handler to create model and set to the fragment

// how can this be refactored? what happens if we edit a todo item more than once, it will overwrite the model and recreate the fragment

// Write cancel & save changes handlers for the pop-up

// Do it all again for the delete button!

