/*
   Copyright 2018 Smart-Tech Controle e Automação

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
"use strict";
/*jshint esversion: 6, node: true*/  

/**
 * @name MID0101
 * @class
 * @param {object} MID0101
 * @param {number} MID0101.numberOfSpindles
 * @param {string} MID0101.vinNumber
 * @param {string} MID0101.jobId
 * @param {number} MID0101.parameterSetId
 * @param {number} MID0101.batchSize
 * @param {number} MID0101.batchCounter
 * @param {number} MID0101.batchStatus
 * @param {number} MID0101.torqueMinLimit
 * @param {number} MID0101.torqueMaxLimit
 * @param {number} MID0101.torqueFinalTarget
 * @param {number} MID0101.angleMin
 * @param {number} MID0101.angleMax
 * @param {number} MID0101.angleTarget
 * @param {string} MID0101.timeStampLastChange
 * @param {string} MID0101.timeStamp
 * @param {number} MID0101.syncTighteningId
 * @param {number} MID0101.syncOverall
 * @param {object} MID0101.spindleStatus
 */

const helpers = require("../helpers.js");
const processParser = helpers.processParser;
const processKey = helpers.processKey;
const serializerKey = helpers.serializerKey;
const serializerField = helpers.serializerField;
const codes = require('../constants.json');
const encoding = codes.defaultEncoder;

function parser(msg, opts, cb) {

    let buffer = msg.payload;
    msg.payload = {};

    let status = true;

    let position = {
        value: 0
    };

    msg.revision = msg.revision || 1;

    switch (msg.revision) {

        case 1:
            status = processKey(msg, buffer, "numberOfSpindles", 1, 2, position, cb) &&
                processParser(msg, buffer, "numberOfSpindles", "number", 2, position, cb) &&
                processKey(msg, buffer, "vinNumber", 2, 2, position, cb) &&
                processParser(msg, buffer, "vinNumber", "string", 25, position, cb) &&
                processKey(msg, buffer, "jobId", 3, 2, position, cb) &&
                processParser(msg, buffer, "jobId", "string", 2, position, cb) &&
                processKey(msg, buffer, "parameterSetId", 4, 2, position, cb) &&
                processParser(msg, buffer, "parameterSetId", "number", 3, position, cb) &&
                processKey(msg, buffer, "batchSize", 5, 2, position, cb) &&
                processParser(msg, buffer, "batchSize", "number", 4, position, cb) &&
                processKey(msg, buffer, "batchCounter", 6, 2, position, cb) &&
                processParser(msg, buffer, "batchCounter", "number", 4, position, cb) &&
                processKey(msg, buffer, "batchStatus", 7, 2, position, cb) &&
                processParser(msg, buffer, "batchStatus", "number", 1, position, cb) &&
                processKey(msg, buffer, "torqueMinLimit", 8, 2, position, cb) &&
                processParser(msg, buffer, "torqueMinLimit", "number", 6, position, cb) &&
                processKey(msg, buffer, "torqueMaxLimit", 9, 2, position, cb) &&
                processParser(msg, buffer, "torqueMaxLimit", "number", 6, position, cb) &&
                processKey(msg, buffer, "torqueFinalTarget", 10, 2, position, cb) &&
                processParser(msg, buffer, "torqueFinalTarget", "number", 6, position, cb) &&
                processKey(msg, buffer, "angleMin", 11, 2, position, cb) &&
                processParser(msg, buffer, "angleMin", "number", 5, position, cb) &&
                processKey(msg, buffer, "angleMax", 12, 2, position, cb) &&
                processParser(msg, buffer, "angleMax", "number", 5, position, cb) &&
                processKey(msg, buffer, "angleTarget", 13, 2, position, cb) &&
                processParser(msg, buffer, "angleTarget", "number", 5, position, cb) &&
                processKey(msg, buffer, "timeStampLastChange", 14, 2, position, cb) &&
                processParser(msg, buffer, "timeStampLastChange", "string", 19, position, cb) &&
                processKey(msg, buffer, "timeStamp", 15, 2, position, cb) &&
                processParser(msg, buffer, "timeStamp", "string", 19, position, cb) &&
                processKey(msg, buffer, "syncTighteningId", 16, 2, position, cb) &&
                processParser(msg, buffer, "syncTighteningId", "number", 5, position, cb) &&
                processKey(msg, buffer, "syncOverall", 17, 2, position, cb) &&
                processParser(msg, buffer, "syncOverall", "number", 1, position, cb) &&
                processKey(msg, buffer, "spindleStatus", 18, 2, position, cb) &&
                processSpindleStatusArrayParser(msg, buffer, "spindleStatus", "spindleStatus", 18 * msg.payload.numberOfSpindles, position, cb);

            if(status) {

                msg.payload._batchStatus = msg.payload.batchStatus;
                msg.payload.batchStatus = checkOK(msg.payload.batchStatus);

                msg.payload.torqueMinLimit = (msg.payload.torqueMinLimit / 100);

                msg.payload.torqueMaxLimit = (msg.payload.torqueMaxLimit / 100);

                msg.payload.torqueFinalTarget = (msg.payload.torqueFinalTarget / 100);

                msg.payload._syncOverall = msg.payload.syncOverall;
                msg.payload.syncOverall = checkOK(msg.payload.syncOverall);


                for (let i = 0; i < msg.payload.spindleStatus.length; i++) {
                    const spindleStatus = msg.payload.spindleStatus[i];

                    msg.payload.spindleStatus[i].number = 0;

                    msg.payload.spindleStatus[i].empty = 0;

                    msg.payload.spindleStatus[i]._status = msg.payload.spindleStatus[i].status;
                    msg.payload.spindleStatus[i].status = checkOK(msg.payload.spindleStatus[i].status);

                    msg.payload.spindleStatus[i]._torqueStatus = msg.payload.spindleStatus[i].torqueStatus;
                    msg.payload.spindleStatus[i].torqueStatus = checkTorqueStatus(msg.payload.spindleStatus[i].torqueStatus);

                    msg.payload.spindleStatus[i].torque = (msg.payload.spindleStatus[i].torque / 100);

                    msg.payload.spindleStatus[i]._angleStatus = msg.payload.spindleStatus[i].angleStatus;
                    msg.payload.spindleStatus[i].angleStatus = checkOK(msg.payload.spindleStatus[i].angleStatus);
                }

                cb(null, msg);
            }
            break;

        default:
            cb(new Error(`[Parser MID${msg.mid}] invalid revision [${msg.revision}]`));
            break;

    }
}

function processSpindleStatusArrayParser(message, buffer, parameter, parameterType, parameterLength, position, cb) {

    let length = parameterLength;
    parameterLength = position.value + parameterLength;

    switch (parameterType) {
        case "spindleStatus":
            message.payload[parameter] = [];

            const spindleAmount = length / 18;

            for (let i = 0; i < spindleAmount; i++) {
                const dummyMessage = {payload: {}};
                processParser(dummyMessage, buffer, "number", "number", 2, position, cb) &&
                processParser(dummyMessage, buffer, "empty", "string", 2, position, cb) &&
                processParser(dummyMessage, buffer, "status", "number", 1, position, cb) &&
                processParser(dummyMessage, buffer, "torqueStatus", "number", 1, position, cb) &&
                processParser(dummyMessage, buffer, "torque", "number", 6, position, cb) &&
                processParser(dummyMessage, buffer, "angleStatus", "number", 1, position, cb) &&
                processParser(dummyMessage, buffer, "angle", "number", 5, position, cb);
                message.payload[parameter].push(dummyMessage.payload);
            }

            break;

        default:
            cb(new Error(`invalid parameterType`));
            return false;

    }

    position.value = parameterLength;

    return true;
}

function serializer(msg, opts, cb) {

    let buf;
    let statusprocess = false;

    let position = {
        value: 0
    };

    msg.revision = msg.revision || 1;

    switch (msg.revision) {
        default:
            cb(new Error(`[Serializer MID${msg.mid}] invalid revision [${msg.revision}]`));
            break;
    }
}

function revision() {
    return [1];
}

function checkOK(value) {
    switch (value) {
        case 0:
            return "NOK";
        case 1:
            return "OK";
        default:
            return "NOT USED";
    }
}

function checkTorqueStatus(value) {
    switch (value) {
        case 0:
            return "LOW";
        case 1:
            return "OK";
        case 2:
            return "HIGH";
        default:
            return "NOT USED";
    }
}

module.exports = {
    parser,
    serializer,
    revision
};
