sap.ui.define(["sap/ui/model/Filter"], function (Filter) {
	"use strict";
	return {
		returnListNameFilter: function (listName) {
			return new Filter("Listname", "EQ", listName);
		},

		returnDeletedItemsFilter: function (deletedFlag) {
			return new Filter("Deleted", "EQ", deletedFlag);
		}
	};
});
