// args = {extractorId, targetId}
var util = require('util');

module.exports = (args) => ({
    source: creep => {
        const extractor = Game.getObjectById(args.extractorId);
        if (creep.store.getUsedCapacity() == creep.store.getCapacity()) {
            return true;
        }
        if (!creep.pos.inRangeTo(extractor, 1)) {
            creep.moveTo(extractor, {visualizePathStyle: {stroke: '#ffaa00'}, range: 1});
            return false;
        }
        var result = creep.harvest(extractor);
        if (result != OK) {
            creep.say(result);
        }
        return false;
    },

    target: creep => {
        if (creep.store.getUsedCapacity() == 0) {
            return true;
        }
        const target = Game.getObjectById(args.targetId);
        if (!creep.pos.inRangeTo(target, 1)) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, range: 1});
            return false;
        }
        var result = creep.transfer(target, RESOURCE_LEMERGIUM);
        return false;
    }
});
