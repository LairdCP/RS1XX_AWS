/******************************************************************************
 * Cayenne Low-power Payload Decoder
 *
 * @author Ashu Joshi @ AWS
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 *****************************************************************************/
const AWS = require('aws-sdk');
const decode = require('./library_cayenne');
const sensor_types_cayenne = require('./sensor_types_cayenne');

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
    
    data = {};
    
    // Add an incoming timestamp in the Lambda
    data.timestamp = new Date().getTime();
    data.deviceId = event.WirelessDeviceId;
    data.devEUI = event.WirelessMetadata.LoRaWAN.DevEui;
    data.datetime = event.WirelessMetadata.LoRaWAN.Timestamp;

    values.forEach(function (sensorEntry){

        switch(sensorEntry.type) {
            // CNT field being sent in DigitalInput
            case (sensor_types_cayenne.SENSOR_TYPE_DIGITAL_INPUT):
                data.count = sensorEntry.value;
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_DIGITAL_OUTPUT):
                data.count = sensorEntry.value;
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_ANALOG_INPUT):
                data.voltage = sensorEntry.value;
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_ANALOG_OUTPUT):
                data.voltage = sensorEntry.value;
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_ILLUMINANCE):
                data.lux = sensorEntry.value;
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_PRESENCE):
                data.presence = sensorEntry.value;
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_TEMPERATURE):
                data.temperature = sensorEntry.value;
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_HUMIDITY):
                data.humidity = sensorEntry.value;
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_PRESSURE):
                data.pressure = sensorEntry.value;
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_ACCELEROMETER):
                var accel = {};
                accel.x = sensorEntry.value.x;
                accel.y = sensorEntry.value.y;
                accel.z = sensorEntry.value.z;
                data.accel = accel;
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_GYROSCOPE):
                var gyro = {};
                gyro.x = sensorEntry.value.x;
                gyro.y = sensorEntry.value.y;
                gyro.z = sensorEntry.value.z;
                data.gyro = gyro;
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_GPS):
                var loc = {};
                loc.lat = sensorEntry.value.latitude;
                loc.lng = sensorEntry.value.longitude;
                loc.alt = sensorEntry.value.altitude;
                data.loc = loc;
                break;
            default:
                console.log('Something messed up, type not handled.');
                break;
        }
    });

    console.log(data);
    return(data); 
};
