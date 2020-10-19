const primitive = require('./primitive.js');
const Block = require('./block.js');
const common = require('./common.js');

// Constants used during serialization and deserialization
const INPUT_SAME_BLOCK_SHADOW = 1; // unobscured shadow
const INPUT_BLOCK_NO_SHADOW = 2; // no shadow
const INPUT_DIFF_BLOCK_SHADOW = 3; // obscured shadow

/**
 * Serialize the fields of a block in a more compact form.
 * @param {object} fields The fields object to serialize
 * @return {object} An object representing the serialized fields
 */
const serializeFields = function (fields) {
    const obj = Object.create(null);
    for (const fieldName in fields) {
        if (!hasOwnProperty.call(fields, fieldName)) continue;
        obj[fieldName] = [fields[fieldName].value];
        if (fields[fieldName].hasOwnProperty('id')) {
            obj[fieldName].push(fields[fieldName].id);
        }
    }
    return obj;
};

/**
 * Serializes the inputs field of a block in a compact form using
 * constants described above to represent the relationship between the
 * inputs of this block (e.g. if there is an unobscured shadow, an obscured shadow
 * -- a block plugged into a droppable input -- or, if there is just a block).
 * Based on this relationship, serializes the ids of the block and shadow (if present)
 *
 * @param {object} inputs The inputs to serialize
 * @return {object} An object representing the serialized inputs
 */
const serializeInputs = function (inputs) {
    const obj = Object.create(null);
    for (const inputName in inputs) {
        if (!hasOwnProperty.call(inputs, inputName)) continue;
        // if block and shadow refer to the same block, only serialize one
        if (inputs[inputName].template.flags.includes('primitive')) {
          obj[inputName] = [
              INPUT_SAME_BLOCK_SHADOW,
              inputs[inputName].uuid,
          ];
        } else if (inputs[inputName].template.flags.includes('reporter')) {
          obj[inputName] = [
              INPUT_BLOCK_NO_SHADOW,
              inputs[inputName].uuid,
          ];
        } else {
          throw new common.Error(`input [${inputName}] is not primitive or reporter`);
        }
    }
    return obj;
};

function serialize(block) {
  // serialize with primitive.serialize if possible
  const serializedPrimitive = primitive.serialize(block);
  if (serializedPrimitive) return serializedPrimitive;

  const obj = Object.create(null);

  obj.opcode = block.opcode;

  obj.fields = serializeFields(block.fields);
  obj.inputs = serializeInputs(block.inputs);

  obj.next = block.next? block.next.uuid:null;
  obj.parent = block.parent? block.parent.uuid:null;
  obj.shadow = block.template.flags.includes('shadow');

  if (block.topLevel) {
    obj.topLevel = true;
    obj.x = block.x ? Math.round(block.x) : 0;
    obj.y = block.y ? Math.round(block.y) : 0;
  } else {
    obj.topLevel = false;
  }

  if (block.mutation.length) obj.mutation = block.mutation;
  if (block.comment) obj.comment = block.comment;
  return obj;
}

/**
* Serialize all children, by calling serializeAllChildren on them
* add the serialized result to target
* @param {object} in the block to serialize
* @param {object} target
*/
function serializeAllChildren(block, target) {
  if (block.uuid in target) throw new common.Error(`Target block object already contains block ${block.uuid}`)
  // serialize all inputs and fields
  Object.values(block.fields).forEach((item) => {
    if (item instanceof Block) serializeAllChildren(item, target)
  });
  Object.values(block.inputs).forEach((item) => {
    if (item instanceof Block) serializeAllChildren(item ,target)
  });
  if (block.child) serializeAllChildren(block.child, target);
  // serialize myself
  const serializedBlock = serialize(block);
  target[block.uuid] = serializedBlock;
  // serialize next
  if (block.next) serializeAllChildren(block.next, target);
}

module.exports = {
  serialize,
  serializeAllChildren,
}
