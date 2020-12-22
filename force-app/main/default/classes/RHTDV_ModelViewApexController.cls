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

    /**
     * Ermittelt für ein Produkt das 3D Modell und liefert die URL dafür zum Doanload zurück.
     * Gibt null zurück, wenn entweder das Produkt nicht gefunden wurde oder das Produkt kein
     * Modell hat oder für die ID am Produkt keine Modelldatei (mehr) existiert.
     * @param productId ID des Produktes, für welches das 3D Modell ermittelt werden soll
     */
    @AuraEnabled
    public static String getModelData(String productId) {
        List<Product2> products = [SELECT RHTDV_ModelDocument__c FROM Product2 WHERE Id = :productId];
        if (products.size() < 1) return null;
        Product2 product = products.get(0);
        if (String.isBlank(product.RHTDV_ModelDocument__c)) return null;
        List<ContentVersion> contentVersions = [SELECT VersionData FROM ContentVersion WHERE Id = :product.RHTDV_ModelDocument__c];
        if (contentVersions.size() < 1) return null;
        String data = EncodingUtil.base64Encode(contentVersions.get(0).VersionData);
        return data;
    }
    
}
