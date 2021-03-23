sap.ui.define([], function () {
    "use strict";
    return {
        edit: function (oController) 
        {
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

        }
    };
});