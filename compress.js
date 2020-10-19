/**
* Note: this function modifies the given blocks object in place
* @param {object} block The block with inputs to compress
* @param {objec} blocks The object containing all the blocks currently getting serialized
* @return {object} The serialized block with compressed inputs
*/
const compressInputTree = function (block, blocks) {
    // This is the second pass on the block
    // so the inputs field should be an object of key - array pairs
    const serializedInputs = block.inputs;
    for (const inputName in serializedInputs) {
        // don't need to check for hasOwnProperty because of how we constructed
        // inputs
        const currInput = serializedInputs[inputName];
        // traverse currInput skipping the first element, which describes whether the block
        // and shadow are the same
        for (let i = 1; i < currInput.length; i++) {
            if (!currInput[i]) continue; // need this check b/c block/shadow can be null
            const blockOrShadowID = currInput[i];
            // replace element of currInput directly
            // (modifying input block directly)
            const blockOrShadow = blocks[blockOrShadowID];
            if (Array.isArray(blockOrShadow)) {
                currInput[i] = blockOrShadow;
                // Modifying blocks in place!
                delete blocks[blockOrShadowID];
            }
        }
    }
    return block;
};

module.exports.compressInputTree = compressInputTree;
