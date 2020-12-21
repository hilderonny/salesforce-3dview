/**
 * Wenn ein Dokument an ein Produkt hochgeladen wird, und
 * das Dokument eine ZIP-Datei ist und der Benutzer das
 * RHTDV_ModelEditor Permission Set hat,
 * dann legt dieser Trigger das Dokument als 3D Modell am Produkt fest
 */
trigger RHTDV_ContentDocumentTrigger on ContentDocumentLink (after insert) {
    // Prüfen, ob der Benutzer überhaupt Schreibrechte hat, ansonsten können wir gleich aufhören
    if (!Schema.sObjectType.Product2.fields.HaeR__RHTDV_ModelDocument__c.isUpdateable()) return;
    Map<Id, ContentDocumentLink> documentsToCheck = new Map<Id, ContentDocumentLink>();
    for (ContentDocumentLink link : Trigger.new) {
        String objectName = link.LinkedEntityId.getSObjectType().getDescribe().getName();
        // Nur Dokumente handhaben, die an Produkte gehangen wurden, weil wir nur dort das 3D Modell Feld haben
        if (objectName != 'Product2') continue;
        documentsToCheck.put(link.ContentDocumentId, link);
    }
    // Dokumente bzw. deren Versionen holen, um deren Dateierweiterungen zu prüfen
    Map<Id, Id> productsToProcess = new Map<Id, Id>();
    for (ContentVersion contentVersion : [SELECT Id, ContentDocumentId, FileExtension FROM ContentVersion WHERE ContentDocumentId in :documentsToCheck.keySet()]) {
        // Nur ZIP-Dateien behandeln
        if (contentVersion.FileExtension?.toUpperCase() != 'zip') continue;
        productsToProcess.put(documentsToCheck.get(contentVersion.ContentDocumentId).LinkedEntityId, contentVersion.Id);
    }
    // Jetzt die Produkte holen und die ContetnVersion dranhängen
    List<Product2> productsToUpdate = [SELECT Id, HaeR__RHTDV_ModelDocument__c FROM Product2 WHERE Id in :productsToProcess.keySet()];
    for (Product2 product : productsToUpdate) {
        product.HaeR__RHTDV_ModelDocument__c = productsToProcess.get(product.Id);
    }
    update productsToUpdate;
}