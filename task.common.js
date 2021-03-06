var util = require('util');

module.exports = {
    GetWorkerTasks: function(room) {
        var taskList = [];

        // build structures
        taskList = taskList.concat(room.find(FIND_MY_CONSTRUCTION_SITES).map((obj) => ({
            targetId: obj.id,
            action: 'build',
            priority: 100
        })));

        // repair structures
        /*
        taskList = taskList.concat(room.find(FIND_STRUCTURES, {
            filter: (structure) => (structure.hits < structure.hitsMax - 10 &&
                structure.structureType != STRUCTURE_RAMPART &&
                structure.structureType != STRUCTURE_WALL)
        }).map((obj) => ({
            targetId: obj.id,
            action: 'repair',
            priority: 100
        })));
        */

        // repair ramparts
        taskList = taskList.concat(room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_RAMPART && structure.hits < util.constant.hitsMaxRampart);
            }
        }).map((obj) => ({
            targetId: obj.id,
            action: 'repair',
            priority: 50
        })));

        // upgrade controller
        taskList.push({
            targetId: room.controller.id,
            action: 'upgrade',
            priority: 1
        });

        return taskList;
    },

    GetRecyclerTargets: function(room) {
        const droppedList = room.find(FIND_DROPPED_RESOURCES);
        const tombList = room.find(FIND_TOMBSTONES, {
            filter: (tomb) => {
                return tomb.store.getUsedCapacity() > 0;
            }
        });
        const ruinList = room.find(FIND_RUINS, {
            filter: (ruin) => {
                return ruin.store.getUsedCapacity() > 0;
            }
        });
        return droppedList.concat(tombList).concat(ruinList).map((obj) => obj.id);
    },
};