sap.ui.define([], function () {
  "use strict";
  return {
    edit: function (oController) {
      if (!oController._edit) {
        oController._edit = sap.ui.xmlfragment(
          "Nathan.Shaw.view.edit",
          oController
        );
        oController.getView().addDependent(oController._edit);
      }
      return oController._edit;
    },
    add: function (oController) {
      if (!oController._add) {
        oController._add = sap.ui.xmlfragment(
          "Nathan.Shaw.view.addPress",
          oController
        );
        oController.getView().addDependent(oController._add);
      }
      return oController._add;
    },

    delete: function (oController) {
      if (!oController._delete) {
        oController._delete = sap.ui.xmlfragment(
          "Nathan.Shaw.view.delete",
          oController
        );
        oController.getView().addDependent(oController._delete);
      }
      return oController._delete;
    },
    chart: function (oController) {
      if (!oController._chart) {
        oController._chart = sap.ui.xmlfragment(
          "Nathan.Shaw.view.chart",
          oController
        );
        oController.getView().addDependent(oController._chart);
      }
      return oController._chart;
    },
    taskDetails: function (oController) {
      if (!oController._taskDetails) {
        oController._taskDetails = sap.ui.xmlfragment(
          "Nathan.Shaw.view.taskDetails",
          oController
        );
        oController.getView().addDependent(oController._taskDetails);
      }
      return oController._taskDetails;
    },
  };
});
