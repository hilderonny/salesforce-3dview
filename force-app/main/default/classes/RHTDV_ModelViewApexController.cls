public with sharing class RHTDV_ModelViewApexController {
    
    /**
     * Gibt true zurück, wenn der angelemdete Benutzer das PermissionSet RHTDV_ModelViewer hat.
     * Steuert in Aura Komponente RHTDV_ModelView, ob diese an sich angezeigt wird.
     */
    @AuraEnabled
    public static Boolean canUserViewModel() {
        Schema.DescribeFieldResult dfr = Product2.HaeR__RHTDV_ModelDocument__c.getDescribe();
        return dfr.isAccessible();
    }
    
    
    /**
     * Gibt true zurück, wenn der angelemdete Benutzer das PermissionSet RHTDV_ModelEditor hat.
     * Steuert in Aura Komponente RHTDV_ModelView, ob der Modell-Upload-Button angezeigt wird.
     */
    @AuraEnabled
    public static Boolean canUserEditModel() {
        Schema.DescribeFieldResult dfr = Product2.HaeR__RHTDV_ModelDocument__c.getDescribe();
        return dfr.isUpdateable();
    }
    
}
