sap.ui.define([
	"Nathan/Shaw/controller/baseController",
	
], function (baseController, JSONModel, fragmentManager, dataOperations, MessageBox) {
	"use strict";

	return baseController.extend("Nathan.Shaw.controller.taskDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 */
		onInit: function () {

			this.getRouter().getRoute("taskDetails");//.attachMatched(this._onRouteMatched, this);

		},

		// _onRouteMatched: function(oEvent){
		// 	//Bind element here probably.
		// 	var sTaskId =  oEvent.getParameter("arguments").taskId;
		// 	this.getModel("myService").metadataLoaded().then( function() {
		// 		var sObjectPath = this.getModel("myService").createKey("ToDoListSet", {
		// 			Id :  sTaskId
		// 		});
		// 		this._bindView("/" + sObjectPath);
		// 	}.bind(this));
		// },

		// _bindView : function (sObjectPath) {
		// 	// Set busy indicator during view binding
		// 	//var oViewModel = this.getModel("detailView");

		// 	// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
		// 	//oViewModel.setProperty("/busy", false);

		// 	this.getView().bindElement({
		// 		path : sObjectPath,
		// 		model: "myService", //only required if using a named model, remove if not using.
		// 		events: {
		// 			dataRequested : function () {
		// 				//oViewModel.setProperty("/busy", true);
		// 			},
		// 			dataReceived: function () {
		// 				//oViewModel.setProperty("/busy", false);
		// 			}
		// 		}
		// 	});
		// },

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 */
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

		}
	});
});