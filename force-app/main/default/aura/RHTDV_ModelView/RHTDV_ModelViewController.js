({
    afterScriptsLoaded: function(component, _, helper) {
        helper.initThreeJsScene(component);
    },
    /**
     * Upload-Vorgang abbrechen
     */
    handleCancelClick: function(component) {
        component.set('v.isUploading', false);
    },
    /**
     * Prüft Berechtigungen beim Initialisieren der Komponente
     */
    handleInit: function(component, _, helper) {
        // Prüfen, ob der Benutzer die Komponente überhaupt sehen darf
        var canViewAction = component.get("c.canUserViewModel");
        canViewAction.setCallback(this, $A.getCallback(function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Komponente sichtbar machen
                component.set('v.canView', response.getReturnValue());
                // Prüfen, ob der Benutzer den Upload-Button sehen darf
                var canUploadAction = component.get("c.canUserEditModel");
                canUploadAction.setCallback(this, $A.getCallback(function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        component.set('v.canUpload', response.getReturnValue());
                    }
                }));
                $A.enqueueAction(canUploadAction);
                // Modell laden
                helper.loadModel(component);
            }
        }));
        $A.enqueueAction(canViewAction);
    },
    /**
     * Upload-Vorgang starten und Dateiauswahlfeld anzeigen
     */
    handleUploadClick: function(component) {
        component.set('v.isUploading', true);
    },
    /**
     * Zeigt den Upload-Button nach erfolgtem Upload wieder an
     * und reinitialisiert das 3D Modell.
     */
    handleUploadFinished: function(component, event, helper) {
        var successToastEvent = $A.get("e.force:showToast");
        successToastEvent.setParams({ type: 'success', title: $A.get("$Label.HaeR.RHTDV_SuccessTitle"), message: $A.get("$Label.HaeR.RHTDV_UploadSuccessfulText") });
        successToastEvent.fire();
        component.set('v.isUploading', false);
    },
})