const Block = require('./block.js');
const BlockTemplate = require('./blocktemplate.js');
const common = require('./common.js');

// lots of code from LLK/scratch-vm /src/serialization/sb3.js

// Constants used during serialization and deserialization
const INPUT_SAME_BLOCK_SHADOW = 1; // unobscured shadow
const INPUT_BLOCK_NO_SHADOW = 2; // no shadow
const INPUT_DIFF_BLOCK_SHADOW = 3; // obscured shadow

// Constants referring to 'primitive' blocks that are usually shadows,
// or in the case of variables and lists, appear quite often in projects
// math_number
const MATH_NUM_PRIMITIVE = 4; // there's no reason these constants can't collide
// math_positive_number
const POSITIVE_NUM_PRIMITIVE = 5; // with the above, but removing duplication for clarity
// math_whole_number
const WHOLE_NUM_PRIMITIVE = 6;
// math_integer
const INTEGER_NUM_PRIMITIVE = 7;
// math_angle
const ANGLE_NUM_PRIMITIVE = 8;
// colour_picker
const COLOR_PICKER_PRIMITIVE = 9;
// text
const TEXT_PRIMITIVE = 10;
// event_broadcast_menu
const BROADCAST_PRIMITIVE = 11;
// data_variable
const VAR_PRIMITIVE = 12;
// data_listcontents
const LIST_PRIMITIVE = 13;

// Map block opcodes to the above primitives and the name of the field we can use
// to find the value of the field
const primitiveOpcodeInfoMap = {
  math_number: [MATH_NUM_PRIMITIVE, 'NUM'],
  math_positive_number: [POSITIVE_NUM_PRIMITIVE, 'NUM'],
  math_whole_number: [WHOLE_NUM_PRIMITIVE, 'NUM'],
  math_integer: [INTEGER_NUM_PRIMITIVE, 'NUM'],
  math_angle: [ANGLE_NUM_PRIMITIVE, 'NUM'],
  colour_picker: [COLOR_PICKER_PRIMITIVE, 'COLOUR'],
  text: [TEXT_PRIMITIVE, 'TEXT'],
  event_broadcast_menu: [BROADCAST_PRIMITIVE, 'BROADCAST_OPTION'],
  data_variable: [VAR_PRIMITIVE, 'VARIABLE'],
  data_listcontents: [LIST_PRIMITIVE, 'LIST']
};

const primitiveBlockTemplates = {
  math_number: new BlockTemplate('math_number', ['NUM'], [],[], ['primitive']),
  math_positive_number: new BlockTemplate('math_positive_number', ['NUM'], [],[], ['primitive']),
  math_whole_number: new BlockTemplate('math_whole_number', ['NUM'], [],[], ['primitive']),
  math_angle: new BlockTemplate('math_angle', ['NUM'], [],[], ['primitive']),
  colour_picker: new BlockTemplate('colour_picker', ['COLOUR'], [],[], ['primitive']),
  text: new BlockTemplate('text', ['TEXT'], [],[], ['primitive']),
  event_broadcast_menu: new BlockTemplate('event_broadcast_menu', ['BROADCAST_OPTION'], [],[], ['primitive']),
  data_variable: new BlockTemplate('data_variable', ['VARIABLE'], [],[], ['primitive']),
  data_listcontents: new BlockTemplate('data_listcontents', ['LIST'], [],[], ['primitive']),
}
const templates = Object.values(primitiveBlockTemplates)

/**
* Serializes primitives described above into a more compact format
* @param {object} block the block to serialize
* @return {array} An array representing the information in the block,
* or null if the given block is not one of the primitives described above.
*/
function serializePrimitiveBlock(block) {
    // Returns an array represeting a primitive block or null if not one of
    // the primitive types above
    if (hasOwnProperty.call(primitiveOpcodeInfoMap, block.opcode)) {
        const primitiveInfo = primitiveOpcodeInfoMap[block.opcode];
        const primitiveConstant = primitiveInfo[0];
        const fieldName = primitiveInfo[1];
        const field = block.fields[fieldName];
        const primitiveDesc = [primitiveConstant, field.value];
        if (block.opcode === 'event_broadcast_menu') {
            primitiveDesc.push(field.id);
        } else if (block.opcode === 'data_variable' || block.opcode === 'data_listcontents') {
            primitiveDesc.push(field.id);
            if (block.topLevel) {
                primitiveDesc.push(block.x ? Math.round(block.x) : 0);
                primitiveDesc.push(block.y ? Math.round(block.y) : 0);
            }
        }
        return primitiveDesc;
    }
    return null;
};

function stringPrimitive(data) {
  return primitiveBlockTemplates['text'].instance({value: data});
}
function numberPrimitive(data) {
  return primitiveBlockTemplates['math_number'].instance({value: data});
}
function variablePrimitive(data) {
  return primitiveBlockTemplates['data_variable'].instance(data);
}
function listPrimitive(data) {
  return primitiveBlockTemplates['data_listcontents'].instance(data);
}

/**
* automaticly create a primitive
* @param {Object} Sb3
* @param {string|number|Sb3.Variable|Sb3.List} data
* @return {Block}
*/
function primitive(Sb3, data) {
  if (typeof data === 'string') return stringPrimitive(data);
  if (typeof data === 'number') return numberPrimitive(data);
  if (data instanceof Sb3.Variable) return variablePrimitive(data);
  if (data instanceof Sb3.List) return listPrimitive(data);
  throw new common.Error(`${data} is not string, number, Sb3.Variable, or Sb3.List`, 'NOTPRIM');
}

primitive.templates = templates;
primitive.serialize = serializePrimitiveBlock;

module.exports = primitive;
