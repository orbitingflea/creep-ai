// 本文件定义了用能量进行工作的 worker，最主要的工作是建造、维修，闲时负责升级任务
// args.sourceId 定义了获取能量的地方，通常是 storage id
// args.taskList 定义了当前这个 worker 需要完成的任务列表，每个任务包含三个元素：
// 1. targetId
// 2. action: 'build' / 'repair' / 'upgrade'
// 3. priority
// 工作的时候会在 priority 并列最高的任务中找到最近的，然后执行

var util = require('util');
var creepCommon = require('creep.common');

module.exports = (args) => ({
    source: creepCommon.sourceById(args.sourceId),

    target: creep => {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            return true;
        }
        const taskList = _.filter(args.taskList, (task) => {
            return Game.getObjectById(task.targetId)
        });
        for (var i = 0; i < taskList.length; i++) {
            console.log('[DEBUG] ' + taskList[i].action);
        }
        var task = util.closestTaskWithTopPriority(taskList, creep.pos);
        if (!task) {
            creep.say('No Task');
            return false;
        }
        var target = Game.getObjectById(task.targetId);
        var goalRange = 3;
        if (!creep.pos.inRangeTo(target, goalRange)) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, range: goalRange});
            return false;
        }
        var result;
        switch (task.action) {
            case 'build':
                result = creep.build(target);
                break;
            case 'repair':
                result = creep.repair(target);
                break;
            case 'upgrade':
                result = creep.upgradeController(target);
                break;
            case 'harvest':
                result = creep.harvest(target);
                break;
            default:
                creep.say('Unknown Action');
        }
        if (result != OK) {
            creep.say(result);
            return false;
        }
        return false;
    },

    wait: creepCommon.waitGotoPark2(),
});
