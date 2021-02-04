/******************************************************************************
 * Laird Payload Decoder
 *
 * @author Greg Leach @ Laird Connectivity
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 *****************************************************************************/
const AWS = require('aws-sdk');
const decode = require('./library_laird');
const messages = require('./messages_laird');

/******************************************************************************
 * LoRaWan for AWS event handler
 *
 * @param event: Event details.
 * @param context: Application context details.
 *****************************************************************************/
exports.handler = async function(event, context) {

    var PayloadData = event.PayloadData;
    var data = Buffer.from(PayloadData, 'base64');
    var values = Object.values(decode(data));
    var data = {};
    
    // Add an incoming timestamp in the Lambda
    data.timestamp = new Date().getTime();
    data.DeviceId = event.DeviceId;
    data.ApplicationId = event.ApplicationId;
    data.DevEUI = event.Metadata.LoRaWAN.DevEUI;
    data.datetime = event.Metadata.LoRaWAN.Timestamp;
    values.forEach(function (sensorEntry){

        switch(sensorEntry.type) {
            case (messages.LAIRD_MSG_TEXT_TYPE_TEMP_RH):
                data.temperature = sensorEntry.value.temperature;
                data.humidity = sensorEntry.value.humidity;
                break;
            case (messages.LAIRD_MSG_TEXT_TYPE_AGG_TEMP_RH):
                data.values = sensorEntry.value;
                break;
            case (messages.LAIRD_MSG_TEXT_TYPE_SIMPLE_CONFIG):
                data.batteryType = sensorEntry.value.batteryType;
                data.sensorReadPeriod = sensorEntry.value.sensorReadPeriod;
                data.aggregateCount = sensorEntry.value.aggregateCount;
                data.tempAlarmsEnabled = sensorEntry.value.tempAlarmsEnabled;
                data.humidityAlarmsEnabled = sensorEntry.value.humidityAlarmsEnabled;
                break;
            case (messages.LAIRD_MSG_TEXT_TYPE_FW_VERSION):
                data.releaseDate = sensorEntry.value.releaseDate;
                data.releaseNumber = sensorEntry.value.releaseNumber;
                data.partNumber = sensorEntry.value.partNumber;
                break;
            case (messages.LAIRD_MSG_TEXT_TYPE_CONTACT_SENSOR_STATE):
                data.contactSensorState = sensorEntry.value;
                break;
            case (messages.LAIRD_MSG_TEXT_TYPE_TEMP_EXT):
                data.temperature = sensorEntry.value;
                break;
            case (messages.LAIRD_MSG_TEXT_TYPE_AGG_TEMP_EXT):
                data.values = sensorEntry.value;
                break;
            default:
                console.log('Something messed up, type not handled.')
                break;
        };
    });

    console.log(data);

    return data;
}
