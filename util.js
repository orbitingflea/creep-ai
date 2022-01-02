var utilConstant = require('util.constant');

var util = {
    getObjectType: function(obj) {
        var str = obj.toString();
        if (str.indexOf("[creep ") == 0) {
            return 'creep';
        }
        var l = 1, r = str.indexOf(' #');
        if (str[0] == '[' && r != -1) {
            return str.substring(l, r);
        } else {
            return 'unknown';
        }
    },

    getStructureIdListMayNeedEnergy: function(room) {
        return room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER);
            }
        }).map((obj) => obj.id);
    },

    myRoom: function() {
        return Game.spawns['Spawn1'].room;
    },

    tryToSpawnCreep: function(body, name, memory) {
        var res = Game.spawns['Spawn1'].spawnCreep(body, name, {
            memory: memory
        });
        return res == 0;
    },

    closestObjectWithTopPriority: function(targetList, priorityFunction, pos) {
        var targetListSorted = _.sortBy(targetList, priorityFunction).reverse();
        const n = targetListSorted.length;
        for (var i = 0; i < n; ) {
            var j = i + 1;
            while (j < n && priorityFunction(targetListSorted[j]) == priorityFunction(targetListSorted[i])) {
                j++;
            }
            var closest = pos.findClosestByPath(targetListSorted.slice(i, j));
            if (closest) {
                return closest;
            }
            i = j;
        }
        return null;
    },

    closestTaskWithTopPriority: function(taskList, pos) {
        var tasks = _.sortBy(taskList, (task) => (task.priority)).reverse();
        const n = tasks.length;
        for (var i = 0; i < n; ) {
            var j = i + 1;
            while (j < n && tasks[i].priority == tasks[j].priority) {
                j++;
            }
            var closest = pos.findClosestByPath(tasks.slice(i, j).map((task) => Game.getObjectById(task.targetId)));
            if (closest) {
                for (var k = i; k < j; k++) {
                    if (tasks[k].targetId == closest.id) {
                        return tasks[k];
                    }
                }
                console.log('runtime error');
                return null;
            }
            i = j;
        }
        return null;
    },

    getCreepCost: function(body) {
        var cost = 0;
        for (var i = 0; i < body.length; i++) {
            cost += BODYPART_COST[body[i]];
        }
        return cost;
    },

    constant: utilConstant,

    resourceTypeList: utilConstant.resourceTypeList,
};

module.exports = util;