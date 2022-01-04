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

        console.log('[DEBUG] ' + taskList.length);

        return taskList;
    }
};