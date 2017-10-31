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

    var validationFlag = false

    // Get the asset registry for the asset.
    return getAssetRegistry('org.acme.sample.ContractAsset')
        .then(function (ContractAssetRegistry) {
            
            // check contract asset is present or not.
            return ContractAssetRegistry.exists(tx.asset.lookupkeyhash)
            
        })
        .then(function (IsExists) {
            // If contract asset is present set the ValidationFlag
            if (IsExists == true) {
                validationFlag = true            
            }
            return getAssetRegistry('org.acme.sample.TransactionAsset')
            

        })
        .then(function(TransactionAssetRegistry) {
            if (validationFlag == true) {
                tx.asset.is_valid = true
            }
            else {
                tx.asset.is_valid = false
            }
            return TransactionAssetRegistry.update(tx.asset);
        })
        .then(function(){
            // Emit an event for the modified asset.
            var event = getFactory().newEvent('org.acme.sample', 'SampleEvent');
            if (validationFlag == true) {
                event.message = "Transaction is valid"
            }
            else {
                event.message = "Transaction is invalid"
            }
            event.asset = tx.asset;
            emit(event);
        });

}
