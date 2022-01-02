var util = require('util');

var creepCommon = {
    // 定义若干常用的方法
    // 每个方法形如 (creep) => { func }
    // source、target 方法返回 true 就说明需要更换 working 状态
    // wait 方法在 source、target 均不能执行时运行，该状态不会被保存，wait 方法没有返回值

    waitGotoPark: (creep) => {
        creep.moveTo(util.parkPosition(), { range: 1 });
    },
};