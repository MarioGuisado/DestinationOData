sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit: function() {   
            this.oFilters = {
                userId: null,
                firstName: null,
                lastName: null,
                managerLastName: null
                };     

                var oDataModel = this.getOwnerComponent().getModel("SFDemo");
    
                oDataModel.read("/User", {
                    urlParameters: {
                        $expand: "manager"
                    },
                    success: function(oData) {
                        var oLocalModel = new sap.ui.model.json.JSONModel(oData);
                        this.getOwnerComponent().setModel(oLocalModel, "localModel");
                        var oTable = this.byId("ajaxTable");
                        oTable.bindItems({
                            path: "localModel>/results",
                            template: oTable.getBindingInfo("items").template
                        });
                    }.bind(this),
                    error: function(oError) {
                        console.error("Error: ", oError);
                    }
                });
            },
            onEdit: function(oEvent){
                var oEditModel = new sap.ui.model.json.JSONModel(oEvent.getSource().getBindingContext("localModel").getObject());
                this.getOwnerComponent().setModel(oEditModel, "editModel");
                var index = oEvent.getSource().getBindingContext("localModel").getProperty("userId");
                this.getOwnerComponent().getRouter().navTo("Edit",{
                    objectId: index
                });
            },
            onFilter: function (oEvent) {
                var sQuery = oEvent.getParameter("query");
                var oButton = oEvent.getSource();

                var sExtraValue = oButton.data("extraValue");
                
                if(sExtraValue == "userId"){
                    this.oFilters.userId = new sap.ui.model.Filter("userId", sap.ui.model.FilterOperator.Contains, sQuery);
                    if(!sQuery){
                        this.oFilters.userId = null;
                    }
                }
                if(sExtraValue == "firstName"){
                    this.oFilters.firstName = new sap.ui.model.Filter("firstName", sap.ui.model.FilterOperator.Contains, sQuery);
                    if(!sQuery){
                        this.oFilters.firstName = null;
                    }
                }
                if(sExtraValue == "lastName"){
                    this.oFilters.lastName = new sap.ui.model.Filter("lastName", sap.ui.model.FilterOperator.Contains, sQuery);
                    if(!sQuery){
                        this.oFilters.lastName = null;
                    }
                }
                if(sExtraValue == "managerLastName"){
                    this.oFilters.managerLastName = new sap.ui.model.Filter("manager/firstName", sap.ui.model.FilterOperator.Contains, sQuery);
                    if(!sQuery){
                        this.oFilters.managerLastName = null;
                    }
                }
            
                this._applyCombinedFilters();
            },
            
            _applyCombinedFilters: function () {
                var aFilter = [];
            
                if (this.oFilters.userId) {
                    aFilter.push(this.oFilters.userId);
                }
                if (this.oFilters.firstName) {
                    aFilter.push(this.oFilters.firstName);
                }
                if (this.oFilters.lastName) {
                    aFilter.push(this.oFilters.lastName);
                }
                if (this.oFilters.managerLastName) {
                    aFilter.push(this.oFilters.managerLastName);
                }
            
                var oTable = this.byId("ajaxTable");
                var oBinding = oTable.getBinding("items");
            
                oBinding.filter(aFilter, "Application");
                oBinding.refresh();
            }
    });
});
