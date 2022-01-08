var util = require('util');

var CarrierSystem = {
    Init() {
        var listSpecialContainer = [util.constant.idContainerNearController, util.constant.idRoom2.container_near_upgrader];
        for (var i in listSpecialContainer) {
            var container = Game.getObjectById(listSpecialContainer[i]);
            if (container) {
                container.memory.isContainerNearUpgrader = true;
            }
        }
    },

    UpdateStructureStatus(room) {
        // for each structure that may need energy, update obj.memory.needEnergy
        // spawn & extensions always need energy if they are not full
        
        var structures = room.find(FIND_STRUCTURES);
        for (var i in structures) {
            var structure = structures[i];
            if (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) {
                structure.memory.needEnergy = structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            } else if (structure.structureType == STRUCTURE_TOWER) {
                var lim = structure.store.getCapacity(RESOURCE_ENERGY);
                var cur = structure.store[RESOURCE_ENERGY];
                if (cur >= lim * 0.9) {
                    structure.memory.needEnergy = false;
                } else if (cur < lim * 0.6) {
                    structure.memory.needEnergy = true;
                }
            } else if (structure.structureType == STRUCTURE_CONTAINER) {
                if (structure.memory.isContainerNearUpgrader) {
                    var lim = structure.store.getCapacity(RESOURCE_ENERGY);
                    var cur = structure.store[RESOURCE_ENERGY];
                    if (cur >= lim * 0.9) {
                        structure.memory.needEnergy = false;
                    } else if (cur < lim * 0.6) {
                        structure.memory.needEnergy = true;
                    }
                }
            } else if (structure.structureType == STRUCTURE_LAB) {
                structure.memory.needEnergy = structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        }
    }
}

module.exports = CarrierSystem;
