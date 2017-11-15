/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Sample transaction processor function.
 * @param {org.acme.sample.ValidateTransaction} tx The sample transaction instance.
 * @transaction
 */
function ValidateTransaction(tx) {

    var validationFlag = false;

    // Get the asset registry for the asset.
    return getAssetRegistry('org.acme.sample.ContractAsset')
        .then(function (ContractAssetRegistry) {
            
            // check contract asset is present or not.
            return ContractAssetRegistry.exists(tx.lookupkeyhash);
            
        })
        .then(function (IsExists) {
            // If contract asset is present set the ValidationFlag
            if (IsExists == true) {
                validationFlag = true;          
            }
            return getAssetRegistry('org.acme.sample.TransactionAsset');
            

        })
        .then(function(TransactionAssetRegistry) {
            //var factory = getFactory()
            var transactionAsset = getFactory().newResource('org.acme.sample', 'TransactionAsset', tx.transactionId);
            transactionAsset.client = getFactory().newRelationship('org.acme.sample','ClientParticipant',tx.client);
            transactionAsset.publisher = getFactory().newRelationship('org.acme.sample','PartnerParticipant',tx.publisher);
            transactionAsset.DSP = getFactory().newRelationship('org.acme.sample','PartnerParticipant',tx.DSP);
            transactionAsset.Adserver = getFactory().newRelationship('org.acme.sample','PartnerParticipant',tx.Adserver);
            transactionAsset.FusionSeven = getFactory().newRelationship('org.acme.sample','PartnerParticipant',tx.FusionSeven);
            transactionAsset.lookupkeyhash = tx.lookupkeyhash;
            transactionAsset.country_code = tx.country_code;
            transactionAsset.date = tx.date;
            transactionAsset.account_id = tx.account_id;
            transactionAsset.account_name = tx.account_name;
            transactionAsset.advertiser_id = tx.advertiser_id;
            transactionAsset.advertiser_name = tx.advertiser_name;
            transactionAsset.campaign_id = tx.campaign_id;
            transactionAsset.campaign_name = tx.campaign_name;
            transactionAsset.currency_code = tx.currency_code;
            transactionAsset.impressions = tx.impressions;
            transactionAsset.clicks = tx.clicks;
            transactionAsset.cpc = tx.cpc;
            transactionAsset.ctr = tx.ctr;
            transactionAsset.ecpm = tx.ecpm;
            transactionAsset.media_cost = tx.media_cost;
            transactionAsset.data_cost = tx.data_cost;
            transactionAsset.total_cost = tx.total_cost;
            transactionAsset.rowkeys = tx.rowkeys;
            if (validationFlag == true) {
                transactionAsset.is_valid = true;
            }
            else {
                transactionAsset.is_valid = false;
            }
            return TransactionAssetRegistry.add(transactionAsset);
        });

}
