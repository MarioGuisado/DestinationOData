sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
],
function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.Edit", {
        onInit: function() {
            this.user=undefined;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Edit").attachPatternMatched(this._onRouteMatched, this);
            this.objId = undefined;
        },
        _onRouteMatched: function(oEvent){
            this.objId = oEvent.getParameter("arguments").objectId;
        },
        onSaveChanges: function() {

            if (this.getView().byId("ID1").getValue() == "" || this.getView().byId("ID2").getValue() == "") {
                sap.m.MessageToast.show("Please complete the form");
                return;
            }

            /*var oUpdatedData = this.getView().getModel("editModel").getData();
            var aData = this.getView().getModel("localModel").getProperty("/results");
            var iIndex = aData.findIndex(item => item.userId === oUpdatedData.userId);
            aData[iIndex] = oUpdatedData;

            this.getView().getModel("localModel").setProperty("/results", aData);*/

            var oDataModel = this.getOwnerComponent().getModel("SFDemo");
            var object = "/User('" + this.objId + "')";

            var data = {
                userId: this.objId,
                firstName: this.getView().byId("ID1").getValue(),
                lastName: this.getView().byId("ID2").getValue()
            };

            console.log(data);

            oDataModel.update(object, data, {});
            sap.m.MessageToast.show("Row edited!", {
                duration: 5000,                 
                animationDuration: 5000
            });
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },        
        onNavBack: function(){
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },
    });
});
