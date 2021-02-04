/******************************************************************************
 * Laird Protocol Payload Library
 *
 * @author Greg Leach @ Laird Connectivity
 * Decoding courtesy of T.J. Crowder @ Farsight Software Ltd
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 *****************************************************************************/
const messages = require('./messages_laird');

/******************************************************************************
 * Message type identifiers
 *****************************************************************************/
const LAIRD_MSG_TYPE_TEMP_RH = 0x1;
const LAIRD_MSG_TYPE_AGG_TEMP_RH = 0x2;
const LAIRD_MSG_TYPE_SIMPLE_CONFIG = 0x5;
const LAIRD_MSG_TYPE_FW_VERSION = 0x7;
const LAIRD_MSG_TYPE_CONTACT_SENSOR_STATE = 0x9;
const LAIRD_MSG_TYPE_TEMP_EXT = 0xB;
const LAIRD_MSG_TYPE_AGG_TEMP_EXT = 0xD;

/******************************************************************************
 * Message type lengths
 *****************************************************************************/
const LAIRD_MSG_TYPE_TEMP_RH_LENGTH = 11;
const LAIRD_MSG_TYPE_SIMPLE_CONFIG_LENGTH = 8;
const LAIRD_MSG_TYPE_FW_VERSION_LENGTH = 11;
const LAIRD_MSG_TYPE_CONTACT_SENSOR_STATE_LENGTH = 6;
const LAIRD_MSG_TYPE_TEMP_EXT_LENGTH = 11;

/******************************************************************************
 * Common Message parameters
 *****************************************************************************/
const LAIRD_MSG_TYPE_INDEX = 0;
const LAIRD_FRACTIONAL_DATA_START_INDEX = 0;
const LAIRD_DECIMAL_DATA_EIGHT_BIT_SIZE = 1;
const LAIRD_FRACTIONAL_DATA_EIGHT_BIT_SIZE = 1;
const LAIRD_DECIMAL_DATA_SIXTEEN_BIT_SIZE = 2;
const LAIRD_FRACTIONAL_DATA_SIXTEEN_BIT_SIZE = 2;

/******************************************************************************
 * Specific Message parameters - Temp/RH
 *****************************************************************************/
const LAIRD_MSG_TYPE_TEMP_RH_HUMIDITY_INDEX = 2;
const LAIRD_MSG_TYPE_TEMP_RH_TEMPERATURE_INDEX = 4;
const LAIRD_MSG_TYPE_TEMP_RH_HUMIDITY_SIZE = 2;
const LAIRD_MSG_TYPE_TEMP_RH_TEMPERATURE_SIZE = 2;

/******************************************************************************
 * Specific Message parameters - Aggregate Temp/RH
 *****************************************************************************/
const LAIRD_MSG_TYPE_AGG_TEMP_RH_BASE_LENGTH = 11;
const LAIRD_MSG_TYPE_AGG_TEMP_RH_COUNT_INDEX = 6;
const LAIRD_MSG_TYPE_AGG_TEMP_RH_FIRST_READING_INDEX = 11;
const LAIRD_MSG_TYPE_AGG_TEMP_RH_HUMIDITY_SIZE = 2;
const LAIRD_MSG_TYPE_AGG_TEMP_RH_TEMPERATURE_SIZE = 2;
const LAIRD_MSG_TYPE_AGG_TEMP_RH_READINGS_LENGTH = 4;

/******************************************************************************
 * Specific Message parameters - Simple Config
 *****************************************************************************/
const LAIRD_MSG_TYPE_SIMPLE_CONFIG_BATTERY_TYPE_ALKALINE = 1;
const LAIRD_MSG_TYPE_SIMPLE_CONFIG_BATTERY_TYPE_LITHIUM = 2;
const LAIRD_MSG_TYPE_SIMPLE_CONFIG_BATTERY_TYPE_INDEX = 2;
const LAIRD_MSG_TYPE_SIMPLE_CONFIG_READ_SENSOR_PERIOD_INDEX = 3;
const LAIRD_MSG_TYPE_SIMPLE_CONFIG_SENSOR_AGGREGATE_INDEX = 5;
const LAIRD_MSG_TYPE_SIMPLE_CONFIG_TEMP_ALARMS_ENABLED_INDEX = 6;
const LAIRD_MSG_TYPE_SIMPLE_CONFIG_HUMIDITY_ALARMS_ENABLED_INDEX = 7;

/******************************************************************************
 * Specific Message parameters - Firmware Version
 *****************************************************************************/
const LAIRD_MSG_TYPE_FW_VERSION_YEAR_INDEX = 2;
const LAIRD_MSG_TYPE_FW_VERSION_MONTH_INDEX = 3;
const LAIRD_MSG_TYPE_FW_VERSION_DAY_INDEX = 4;
const LAIRD_MSG_TYPE_FW_VERSION_MAJOR_INDEX = 5;
const LAIRD_MSG_TYPE_FW_VERSION_MINOR_INDEX = 6;
const LAIRD_MSG_TYPE_FW_VERSION_PART_NUMBER_INDEX = 7;
const LAIRD_MSG_TYPE_FW_VERSION_PART_NUMBER_LENGTH = 4;

/******************************************************************************
 * Specific Message parameters - Open/Closed
 *****************************************************************************/
const LAIRD_MSG_TYPE_CONTACT_SENSOR_STATE_INDEX = 3;

/******************************************************************************
 * Specific Message parameters - Extended Temperature
 *****************************************************************************/
const LAIRD_MSG_TYPE_TEMP_EXT_TEMPERATURE_INDEX = 2;
const LAIRD_MSG_TYPE_TEMP_EXT_TEMPERATURE_SIZE = 4;

/******************************************************************************
 * Specific Message parameters - Aggregated Extended Temperature
 *****************************************************************************/
const LAIRD_MSG_TYPE_AGG_TEMP_EXT_BASE_LENGTH = 11;
const LAIRD_MSG_TYPE_AGG_TEMP_EXT_COUNT_INDEX = 6;
const LAIRD_MSG_TYPE_AGG_TEMP_EXT_READINGS_LENGTH = 4;
const LAIRD_MSG_TYPE_AGG_TEMP_EXT_FIRST_READING_INDEX = 11;

/******************************************************************************
 * Laird Protocol Payload Decoder - Public interface.
 *
 * @param payload: array of bytes.
 * @return: JSON
 *****************************************************************************/
function decode(payload) {

    var sensors = [];
    var message = {};
    var s_value;

    if (payload == null){

    }
    else if (payload[LAIRD_MSG_TYPE_INDEX] == LAIRD_MSG_TYPE_TEMP_RH){
        s_value = decodeLairdMsgTypeTempRH(payload);
        if (s_value != null){
            message = {'type': messages.LAIRD_MSG_TEXT_TYPE_TEMP_RH,
                       'value': s_value};
        }
    }
    else if (payload[LAIRD_MSG_TYPE_INDEX] == LAIRD_MSG_TYPE_AGG_TEMP_RH){
        s_value = decodeLairdMsgTypeAggTempRH(payload);
        if (s_value != null){
            message = {'type': messages.LAIRD_MSG_TEXT_TYPE_AGG_TEMP_RH,
                       'value': s_value };
        }
    }
    else if (payload[LAIRD_MSG_TYPE_INDEX] == LAIRD_MSG_TYPE_SIMPLE_CONFIG){
        s_value = decodeLairdMsgSimpleConfig(payload);
        if (s_value != null){
            message = {'type': messages.LAIRD_MSG_TEXT_TYPE_SIMPLE_CONFIG,
                       'value': s_value };
        }
    }
    else if (payload[LAIRD_MSG_TYPE_INDEX] == LAIRD_MSG_TYPE_FW_VERSION){
        s_value = decodeLairdMsgTypeFirmwareVersion(payload);
        if (s_value != null){
            message = {'type': messages.LAIRD_MSG_TEXT_TYPE_FW_VERSION,
                       'value': s_value};
        }
    }
    else if (payload[LAIRD_MSG_TYPE_INDEX] == LAIRD_MSG_TYPE_CONTACT_SENSOR_STATE){
        s_value = decodeLairdMsgTypeContactSensorState(payload);
        if (s_value != null){
            message = {'type': messages.LAIRD_MSG_TEXT_TYPE_CONTACT_SENSOR_STATE,
                       'value': s_value };
        }
    }
    else if (payload[LAIRD_MSG_TYPE_INDEX] == LAIRD_MSG_TYPE_TEMP_EXT){
        s_value = decodeLairdMsgTypeTempExt(payload);
        if (s_value != null){
            message = {'type': messages.LAIRD_MSG_TEXT_TYPE_TEMP_EXT,
                       'value': s_value };
        }
    }
    else if (payload[LAIRD_MSG_TYPE_INDEX] == LAIRD_MSG_TYPE_AGG_TEMP_EXT){
        s_value = decodeLairdMsgTypeAggTempExt(payload);
        if (s_value != null){
            message = {'type': messages.LAIRD_MSG_TEXT_TYPE_AGG_TEMP_EXT,
                       'value' : s_value };
        }
    }
    if (message != null){
        sensors.push(message);
    }
    return(sensors);
}

/******************************************************************************
 * Decoder for messages of type LAIRD_MSG_TYPE_TEMP_RH
 *
 * @param payload - the message data
 * @return: JSON data
 *****************************************************************************/
function decodeLairdMsgTypeTempRH(payload){

    var s_value = null;

    if (payload.length == LAIRD_MSG_TYPE_TEMP_RH_LENGTH) {
        s_value = {
            'humidity': TwoBytesToFloat(payload.slice(
                LAIRD_MSG_TYPE_TEMP_RH_HUMIDITY_INDEX,
                LAIRD_MSG_TYPE_TEMP_RH_HUMIDITY_INDEX +
                LAIRD_MSG_TYPE_TEMP_RH_HUMIDITY_SIZE)),
            'temperature': TwoBytesToFloat(payload.slice(
                LAIRD_MSG_TYPE_TEMP_RH_TEMPERATURE_INDEX,
                LAIRD_MSG_TYPE_TEMP_RH_TEMPERATURE_INDEX +
                LAIRD_MSG_TYPE_TEMP_RH_TEMPERATURE_SIZE))
        };
    }
    return(s_value);
}

/******************************************************************************
 * Decoder for messages of type LAIRD_MSG_TYPE_AGG_TEMP_RH
 *
 * @param payload - the message data
 * @return: JSON data
 *****************************************************************************/
function decodeLairdMsgTypeAggTempRH(payload){

    var s_value = null;
    var readingsByteIndex;
    var readingsIndex = 0;
    var humidity;
    var temperature;

    if (payload.length > LAIRD_MSG_TYPE_AGG_TEMP_RH_BASE_LENGTH) {
        var readingsBytesLength = payload[LAIRD_MSG_TYPE_AGG_TEMP_RH_COUNT_INDEX] *
            LAIRD_MSG_TYPE_AGG_TEMP_RH_READINGS_LENGTH;
        if (payload.length == readingsBytesLength + LAIRD_MSG_TYPE_AGG_TEMP_RH_BASE_LENGTH) {

            readingsByteIndex = LAIRD_MSG_TYPE_AGG_TEMP_RH_FIRST_READING_INDEX;
            s_value = new Array([payload[LAIRD_MSG_TYPE_AGG_TEMP_RH_COUNT_INDEX]]);

            for (; readingsBytesLength; 
		readingsBytesLength -= LAIRD_MSG_TYPE_AGG_TEMP_RH_READINGS_LENGTH) {

                humidity = TwoBytesToFloat(payload.slice(
                    readingsByteIndex,
                    readingsByteIndex +
                    LAIRD_MSG_TYPE_AGG_TEMP_RH_HUMIDITY_SIZE));
                readingsByteIndex += LAIRD_MSG_TYPE_AGG_TEMP_RH_HUMIDITY_SIZE;
                temperature = TwoBytesToFloat(payload.slice(
                    readingsByteIndex,
                    readingsByteIndex +
                    LAIRD_MSG_TYPE_AGG_TEMP_RH_TEMPERATURE_SIZE));
                readingsByteIndex += LAIRD_MSG_TYPE_AGG_TEMP_RH_TEMPERATURE_SIZE;

                s_value[readingsIndex++] = {
                    'humidity': humidity,
                    'temperature': temperature
                };
            }
        }
    }
    return(s_value);
}

/******************************************************************************
 * Decoder for messages of type LAIRD_MSG_TYPE_SIMPLE_CONFIG
 *
 * @param payload - message data
 * @return: JSON data
 *****************************************************************************/
function decodeLairdMsgSimpleConfig(payload){

    var s_value = null;
    var batteryType = "Unknown";
    var sensorReadPeriod;
    var aggregateCount;
    var tempAlarmsEnabled = "true";
    var humidityAlarmsEnabled = "true";

    if (payload.length == LAIRD_MSG_TYPE_SIMPLE_CONFIG_LENGTH){
        if (payload[LAIRD_MSG_TYPE_SIMPLE_CONFIG_BATTERY_TYPE_INDEX] ==
            LAIRD_MSG_TYPE_SIMPLE_CONFIG_BATTERY_TYPE_ALKALINE){
            batteryType = "Alkaline";
        }
        else if (payload[LAIRD_MSG_TYPE_SIMPLE_CONFIG_BATTERY_TYPE_INDEX] ==
            LAIRD_MSG_TYPE_SIMPLE_CONFIG_BATTERY_TYPE_LITHIUM){
            batteryType = "Lithium";
        }
        sensorReadPeriod = TwoBytesToUInt16(payload.slice(
                    LAIRD_MSG_TYPE_SIMPLE_CONFIG_READ_SENSOR_PERIOD_INDEX,
                    LAIRD_MSG_TYPE_SIMPLE_CONFIG_READ_SENSOR_PERIOD_INDEX + 2));
        aggregateCount = payload[LAIRD_MSG_TYPE_SIMPLE_CONFIG_SENSOR_AGGREGATE_INDEX];
        if (payload[LAIRD_MSG_TYPE_SIMPLE_CONFIG_TEMP_ALARMS_ENABLED_INDEX] == 0){
            tempAlarmsEnabled = "false";
        }
        if (payload[LAIRD_MSG_TYPE_SIMPLE_CONFIG_HUMIDITY_ALARMS_ENABLED_INDEX] == 0){
            humidityAlarmsEnabled = "false";
        }
        s_value = {
            'batteryType': batteryType,
            'sensorReadPeriod': sensorReadPeriod,
            'aggregateCount': aggregateCount,
            'tempAlarmsEnabled': tempAlarmsEnabled,
            'humidityAlarmsEnabled': humidityAlarmsEnabled
        };
    }
    return(s_value);
}

/******************************************************************************
 * Decoder for messages of type LAIRD_MSG_TYPE_FW_VERSION
 *
 * @param payload - message data
 * @return: JSON data
 *****************************************************************************/
function decodeLairdMsgTypeFirmwareVersion(payload) {

    var s_value = null;
    var releaseDate;
    var releaseNumber;
    var partNumber;

    if (payload.length == LAIRD_MSG_TYPE_FW_VERSION_LENGTH) {

        releaseDate = payload[LAIRD_MSG_TYPE_FW_VERSION_YEAR_INDEX].toString() +
                      '/' +
                      payload[LAIRD_MSG_TYPE_FW_VERSION_MONTH_INDEX].toString() +
                      '/' +
                      payload[LAIRD_MSG_TYPE_FW_VERSION_DAY_INDEX].toString();

        releaseNumber = payload[LAIRD_MSG_TYPE_FW_VERSION_MAJOR_INDEX].toString() +
                        '.' +
                        payload[LAIRD_MSG_TYPE_FW_VERSION_MINOR_INDEX].toString();

        partNumber = FourBytesToUInt32(payload.slice(
                        LAIRD_MSG_TYPE_FW_VERSION_PART_NUMBER_INDEX,
                        LAIRD_MSG_TYPE_FW_VERSION_PART_NUMBER_INDEX +
                        LAIRD_MSG_TYPE_FW_VERSION_PART_NUMBER_LENGTH));

        s_value = {
            'releaseDate': releaseDate,
            'releaseNumber': releaseNumber,
            'partNumber': partNumber
        };
    }
    return(s_value);
}

/******************************************************************************
 * Decoder for messages of type LAIRD_MSG_TYPE_CONTACT_SENSOR_STATE
 *
 * @param payload - message data
 * @return: JSON data
 *****************************************************************************/
function decodeLairdMsgTypeContactSensorState(payload){

    var s_value = null;

    if (payload.length == LAIRD_MSG_TYPE_CONTACT_SENSOR_STATE_LENGTH) {
        s_value = payload[LAIRD_MSG_TYPE_CONTACT_SENSOR_STATE_INDEX];
    }
    return(s_value);
}

/******************************************************************************
 * Decoder for messages of type LAIRD_MSG_TYPE_TEMP_EXT
 *
 * @param payload - message data
 * @return: JSON data
 *****************************************************************************/
function decodeLairdMsgTypeTempExt(payload){

    var s_value = null;

    if (payload.length == LAIRD_MSG_TYPE_TEMP_EXT_LENGTH) {
        s_value = FourBytesToFloat(payload.slice(
            LAIRD_MSG_TYPE_TEMP_EXT_TEMPERATURE_INDEX,
            LAIRD_MSG_TYPE_TEMP_EXT_TEMPERATURE_INDEX +
            LAIRD_MSG_TYPE_TEMP_EXT_TEMPERATURE_SIZE));
    }
    return(s_value);
}

/******************************************************************************
 * Decoder for messages of type LAIRD_MSG_TYPE_AGG_TEMP_EXT
 *
 * @param payload - message data
 * @return: JSON data
 *****************************************************************************/
function decodeLairdMsgTypeAggTempExt(payload){

    var s_value = null;
    var readingsByteIndex;
    var readingsIndex = 0;
    var temperature;

    if (payload.length > LAIRD_MSG_TYPE_AGG_TEMP_EXT_BASE_LENGTH) {

        var readingsBytesLength = payload[LAIRD_MSG_TYPE_AGG_TEMP_EXT_COUNT_INDEX] *
            LAIRD_MSG_TYPE_AGG_TEMP_EXT_READINGS_LENGTH;

        if (payload.length == 
		readingsBytesLength + LAIRD_MSG_TYPE_AGG_TEMP_EXT_BASE_LENGTH) {

            readingsByteIndex = LAIRD_MSG_TYPE_AGG_TEMP_EXT_FIRST_READING_INDEX;
            s_value = new Array([payload[LAIRD_MSG_TYPE_AGG_TEMP_EXT_COUNT_INDEX]]);

            for (; readingsBytesLength; 
		readingsBytesLength -= LAIRD_MSG_TYPE_AGG_TEMP_EXT_READINGS_LENGTH) {

                temperature = FourBytesToFloat(payload.slice(
                    readingsByteIndex,
                    readingsByteIndex +
                    LAIRD_MSG_TYPE_AGG_TEMP_EXT_READINGS_LENGTH));
                readingsByteIndex += LAIRD_MSG_TYPE_AGG_TEMP_EXT_READINGS_LENGTH;

                s_value[readingsIndex++] = {
                    'temperature': temperature
                };
            }
        }
    }
    return(s_value);
}

/******************************************************************************
 * Converts a pair of bytes to the equivalent float value
 *
 * @param stream: array of bytes.
 * @return: The resultant float value
 *****************************************************************************/
function TwoBytesToFloat(stream) {

    var result;
    var fractionalData = stream.slice(0,1);
    var decimalData = stream.slice(1,2);
    var fractionalView = new DataView(new ArrayBuffer(
                                LAIRD_FRACTIONAL_DATA_EIGHT_BIT_SIZE));
    var decimalView = new DataView(new ArrayBuffer(
                                LAIRD_DECIMAL_DATA_EIGHT_BIT_SIZE));
    var fractionalResult;
    var decimalResult;

    for (var i = 0; i < stream.length; i++) {
        if (stream[i] > 0xFF) {
            throw 'Byte value overflow!';
        }
    }

    fractionalData.forEach(function (b,i) {
        fractionalView.setUint8(i, b);
    });
    fractionalResult = fractionalView.getInt8(0);

    decimalData.forEach(function (b,i) {
        decimalView.setUint8(i, b);
    });
    decimalResult = decimalView.getInt8(0);

    result = decimalResult + (fractionalResult/100.0);
    return(result);
}

/******************************************************************************
 * Converts two pairs of bytes to the equivalent float value
 *
 * @param stream: array of bytes.
 * @return: The resultant float value
 *****************************************************************************/
function FourBytesToFloat(stream){

    var result;
    var fractionalData = stream.slice(LAIRD_FRACTIONAL_DATA_START_INDEX,
                                      LAIRD_FRACTIONAL_DATA_SIXTEEN_BIT_SIZE);
    var decimalData = stream.slice(LAIRD_FRACTIONAL_DATA_SIXTEEN_BIT_SIZE,
                                   LAIRD_FRACTIONAL_DATA_SIXTEEN_BIT_SIZE+
                                   LAIRD_DECIMAL_DATA_SIXTEEN_BIT_SIZE);
    var fractionalView = new DataView(new ArrayBuffer(
                                    LAIRD_FRACTIONAL_DATA_SIXTEEN_BIT_SIZE));
    var decimalView = new DataView(new ArrayBuffer(
                                    LAIRD_DECIMAL_DATA_SIXTEEN_BIT_SIZE));
    var fractionalResult;
    var decimalResult;

    for (var i = 0; i < stream.length; i++) {
        if (stream[i] > 0xFF) {
            throw 'Byte value overflow!';
        }
    }
    fractionalData.forEach(function (b,i) {
        fractionalView.setUint8(i, b);
    });
    fractionalResult = fractionalView.getInt16(0);

    decimalData.forEach(function (b,i) {
        decimalView.setUint8(i, b);
    });
    decimalResult = decimalView.getInt16(0);

    result = decimalResult + (fractionalResult/100.0);
    return(result);
}

/******************************************************************************
 * Converts a pair of bytes to the equivalent UInt16 value
 *
 * @param stream: array of bytes.
 * @return: The resultant UInt16 value
 *****************************************************************************/
function TwoBytesToUInt16(stream) {

    var uInt16Data = stream.slice(0,2);
    var uInt16View = new DataView(new ArrayBuffer(2));
    var uInt16Result;

    for (var i = 0; i < stream.length; i++) {
        if (stream[i] > 0xFF) {
            throw 'Byte value overflow!';
        }
    }

    uInt16Data.forEach(function (b,i) {
        uInt16View.setUint8(i, b);
    });
    uInt16Result = uInt16View.getUint16(0);
    return(uInt16Result);
}

/******************************************************************************
 * Converts four bytes to the equivalent UInt32 value
 *
 * @param stream: array of bytes.
 * @return: The resultant UInt32 value
 *****************************************************************************/
function FourBytesToUInt32(stream) {

    var uInt32Data = stream.slice(0,4);
    var uInt32View = new DataView(new ArrayBuffer(4));
    var uInt32Result;

    for (var i = 0; i < stream.length; i++) {
        if (stream[i] > 0xFF) {
            throw 'Byte value overflow!';
        }
    }

    uInt32Data.forEach(function (b,i) {
        uInt32View.setUint8(i, b);
    });
    uInt32Result = uInt32View.getUint32(0);
    return(uInt32Result);
}

/******************************************************************************
 * Test code for the above
 *
 * @param
 * @return:
 *****************************************************************************/
function test() {
    var result;
    var message = {};
    var check = 0;
    // TwoBytesToFloat checks
    // 1.
    check++;
    testData = [0x0,0x0];
    result = TwoBytesToFloat(testData);
    if (result != 0.0){
        console.log("Check " + check +  " failed!");
    }
    // 2.
    check++;
    testData = [0x36,0x1B];
    result = TwoBytesToFloat(testData);
    if (result != 27.54){
        console.log("Check " + check +  " failed!");
    }
    // 3.
    check++;
    testData = [0xCF,0xF6];
    result = TwoBytesToFloat(testData);
    if (result != -10.49){
        console.log("Check " + check +  " failed!");
    }
    // FourBytesToFloat checks
    // 4.
    check++;
    testData = [0x0,0x0,0x0,0x0];
    result = FourBytesToFloat(testData);
    if (result != 0.0){
        console.log("Check " + check +  " failed!");
    }
    // 5.
    check++;
    testData = [0x0,0x01,0x0,0x21];
    result = FourBytesToFloat(testData);
    if (result != 33.01){
        console.log("Check " + check +  " failed!");
    }
    // 6.
    check++;
    testData = [0x0,0x48,0x12,0x33];
    result = FourBytesToFloat(testData);
    if (result != 4659.72){
        console.log("Check " + check +  " failed!");
    }
    // 7.
    check++;
    testData = [0x00,0x12,0x32,0x13];
    result = FourBytesToFloat(testData);
    if (result != 12819.18){
        console.log("Check " + check +  " failed!");
    }
    // 8.
    check++;
    testData = [0xFF,0xF6,0xFF,0xEC];
    result = FourBytesToFloat(testData);
    if (result != -20.10){
        console.log("Check " + check +  " failed!");
    }
    // 9.
    check++;
    testData = [0xFF,0xE4,0xFE,0x77];
    result = FourBytesToFloat(testData);
    if (result != -393.28){
        console.log("Check " + check +  " failed!");
    }
    // 10. TwoBytesToUInt16 checks
    check++;
    testData = [0xFF,0xFF];
    result = TwoBytesToUInt16(testData);
    if (result != 65535){
        console.log("Check " + check +  " failed!");
    }
    // 11.
    check++;
    testData = [0x0,0x1];
    result = TwoBytesToUInt16(testData);
    if (result != 1){
        console.log("Check " + check +  " failed!");
    }
    // 12.
    check++;
    testData = [0x1,0x0];
    result = TwoBytesToUInt16(testData);
    if (result != 256){
        console.log("Check " + check +  " failed!");
    }
    // 13. Four Bytes to UInt32 Checks
    check++;
    testData = [0xFF,0xFE,0xFD,0xFC];
    result = FourBytesToUInt32(testData);
    if (result != 4294901244){
        console.log("Check " + check +  " failed!");
    }
    // 14.
    check++;
    testData = [0x0,0x1,0x2,0x3];
    result = FourBytesToUInt32(testData);
    if (result != 66051){
        console.log("Check " + check +  " failed!");
    }
    // 15. Decode TH Checks
    check++;
    testData = [0x01,0x0,0x21,0x34,0x43,0x62,0x05,0x00,0x00,0x00];
    message = decodeLairdMsgTypeTempRH(testData);
    if (message != null){
        console.log("Check " + check +  " failed!");
    }
    // 16.
    check++;
    testData = [0x01,0x0,0x21,0x34,0x43,0x62,0x05,0x00,0x00,0x00,0x00];
    message = decodeLairdMsgTypeTempRH(testData);
    if ((message.humidity != "52.33") ||
        (message.temperature != "98.67")){
        console.log("Check " + check +  " failed!");
    }
    // 17. Decode Simple Config Checks
    check++;
    testData = [0x5,0x0,0x0,0x0,0x1,0x5,0x0,0x1];
    message = decodeLairdMsgSimpleConfig(testData);
    if ((message.batteryType != "Unknown")||
        (message.sensorReadPeriod != 0x1)||
        (message.aggregateCount != 0x5)||
        (message.tempAlarmsEnabled != "false")||
        (message.humidityAlarmsEnabled != "true")){
        console.log("Check " + check +  " failed!");
    }
    // 18.
    check++;
    testData = [0x5,0x0,0x1,0x1,0x0,0x0,0x1,0x0];
    message = decodeLairdMsgSimpleConfig(testData);
    if ((message.batteryType != "Alkaline")||
        (message.sensorReadPeriod != 0x100)||
        (message.aggregateCount != 0x0)||
        (message.tempAlarmsEnabled != "true")||
        (message.humidityAlarmsEnabled != "false")){
        console.log("Check " + check +  " failed!");
    }
    // 19.
    check++;
    testData = [0x5,0x0,0x2,0xFF,0xFF,0x0,0x0,0x0];
    message = decodeLairdMsgSimpleConfig(testData);
    if ((message.batteryType != "Lithium")||
        (message.sensorReadPeriod != 0xFFFF)||
        (message.aggregateCount != 0x0)||
        (message.tempAlarmsEnabled != "false")||
        (message.humidityAlarmsEnabled != "false")){
        console.log("Check " + check +  " failed!");
    }
    // 20. Decode Firmware Version Checks
    check++;
    testData = [0x7,0x0,0x14,0xB,0x5,0x6,0x1,0x1,0x2,0x3,0x4];
    message = decodeLairdMsgTypeFirmwareVersion(testData);
    if ((message.releaseDate != '20/11/5')||
        (message.releaseNumber != '6.1')||
        (message.partNumber != 16909060)){
        console.log("Check " + check +  " failed!");
    }
    // 21. Decode Contact Sensor Checks
    check++;
    testData = [0x09,0x00,0x00,0x01,0x01];
    message = decodeLairdMsgTypeContactSensorState(testData);
    if (message != null){
        console.log("Check " + check +  " failed!");
    }
    // 22.
    check++;
    testData = [0x09,0x00,0x00,0x01,0x01,0x01];
    message = decodeLairdMsgTypeContactSensorState(testData);
    if (message != "1"){
        console.log("Check " + check +  " failed!");
    }
    // 23. Decode Ext Temperature Checks
    check++;
    testData = [0x0B,0x0,0xFF,0x9F,0xFE,0xFE,0x05,0x00,0x00,0x00];
    message = decodeLairdMsgTypeTempExt(testData);
    if (message != null){
        console.log("Check " + check +  " failed!");
    }
    // 24.
    check++;
    testData = [0x0B,0x0,0xFF,0x9F,0xFE,0xFE,0x05,0x00,0x00,0x00,0x00];
    message = decodeLairdMsgTypeTempExt(testData);
    if (message != "-258.97"){
        console.log("Check " + check +  " failed!");
    }
    // 25. Decode Agg Temp RH Checks
    check++;
    testData = [0x02,0x00,0x00,0x00,0x00];
    message = decodeLairdMsgTypeAggTempRH(testData);
    if (message != null){
        console.log("Check " + check +  " failed!");
    }
    // 26.
    check++;
    testData = [0x02,0x00,0x00,0x00,0x00,0x05,0x02,0x00,0x00,0x00,0x00,
		0x21,0x34,0x43,0x62,
		0x22,0x35,0x44,0x63];
    message = decodeLairdMsgTypeAggTempRH(testData);
    if (message.length != 2){
        console.log("Check " + check +  " failed!");
    }
    if ((message[0].humidity != "52.33") ||
        (message[0].temperature != "98.67") ||
        (message[1].humidity != "53.34") ||
        (message[1].temperature != "99.68")){
        console.log("Check " + check +  " failed!");
    }
    // 27.
    check++;
    testData = [0x02,0x00,0x00,0x00,0x00,0x05,0x0A,0x00,0x00,0x00,0x00,
                0x21,0x34,0x43,0x62,
                0x22,0x35,0x44,0x63,
                0x23,0x36,0x45,0x64,
                0x24,0x37,0x46,0x65,
                0x25,0x38,0x47,0x66,
                0x26,0x39,0x48,0x67,
                0x27,0x3A,0x49,0x68,
                0x28,0x3B,0x4A,0x69,
                0x29,0x3C,0x4B,0x6A,
                0x2A,0x3D,0x4C,0x6B];
    message = decodeLairdMsgTypeAggTempRH(testData);
    if (message.length != 10){
        console.log("Check " + check +  " failed!");
    }
    if ((message[0].humidity != "52.33") ||
        (message[0].temperature != "98.67") ||
        (message[1].humidity != "53.34") ||
        (message[1].temperature != "99.68")||
        (message[2].humidity != "54.35") ||
        (message[2].temperature != "100.69") ||
        (message[3].humidity != "55.36") ||
        (message[3].temperature != "101.70")||
        (message[4].humidity != "56.37") ||
        (message[4].temperature != "102.71") ||
        (message[5].humidity != "57.38") ||
        (message[5].temperature != "103.72")||
        (message[6].humidity != "58.39") ||
        (message[6].temperature != "104.73") ||
        (message[7].humidity != "59.40") ||
        (message[7].temperature != "105.74")||
        (message[8].humidity != "60.41") ||
        (message[8].temperature != "106.75") ||
        (message[9].humidity != "61.42") ||
        (message[9].temperature != "107.76")){
        console.log("Check " + check +  " failed!");
    }
    // 28. Decode Agg Ext Temp Checks
    check++;
    testData = [0x0D,0x00,0x00,0x00,0x00];
    message = decodeLairdMsgTypeAggTempExt(testData);
    if (message != null){
        console.log("Check " + check +  " failed!");
    }
    // 29.
    check++;
    testData = [0x0D,0x00,0x00,0x00,0x00,0x05,0x02,0x00,0x00,0x00,0x00,
                0xFF,0xF6,0xFF,0xEC,
                0xFF,0xE4,0xFE,0x77];
    message = decodeLairdMsgTypeAggTempExt(testData);
    if (message.length != 2){
        console.log("Check " + check +  " failed!");
    }
    if ((message[0].temperature != "-20.10") ||
        (message[1].temperature != "-393.28")){
        console.log("Check " + check +  " failed!");
    }
    // 30.
    check++;
    testData = [0x0D,0x00,0x00,0x00,0x00,0x05,0x0A,0x00,0x00,0x00,0x00,
        0x0,0x01,0x1,0x21,
        0x0,0x02,0x2,0x22,
        0x0,0x03,0x3,0x23,
        0x0,0x04,0x4,0x24,
        0x0,0x05,0x5,0x25,
        0x0,0x06,0x6,0x26,
        0x0,0x07,0x7,0x27,
        0x0,0x08,0x8,0x28,
        0x0,0x09,0x9,0x29,
        0x0,0x0A,0xA,0x2A,
    ];
    message = decodeLairdMsgTypeAggTempExt(testData);
    if (message.length != 10){
        console.log("Check " + check +  " failed!");
    }
    if ((message[0].temperature != "289.01") ||
        (message[1].temperature != "546.02") ||
        (message[2].temperature != "803.03") ||
        (message[3].temperature != "1060.04") ||
        (message[4].temperature != "1317.05") ||
        (message[5].temperature != "1574.06") ||
        (message[6].temperature != "1831.07") ||
        (message[7].temperature != "2088.08") ||
        (message[8].temperature != "2345.09") ||
        (message[9].temperature != "2602.1")){
        console.log("Check " + check +  " failed!");
    }
    // Decode checks
    // 31 - Internal TH.
    check++;
    testData = [0x01,0x0,0x21,0x34,0x43,0x62,0x05,0x00,0x00,0x00,0x00];
    message = decode(testData);
    if ((message[0].type != messages.LAIRD_MSG_TEXT_TYPE_TEMP_RH) ||
        (message[0].value.humidity != "52.33") ||
        (message[0].value.temperature != "98.67")){
        console.log("Check " + check +  " failed!");
    }
    // 32 - Contact Sensor
    check++;
    testData = [0x09,0x00,0x00,0x01,0x01,0x01];
    message = decode(testData);
    if ((message[0].type != messages.LAIRD_MSG_TEXT_TYPE_CONTACT_SENSOR_STATE) ||
        (message[0].value != "1")){
        console.log("Check " + check +  " failed!");
    }
    // 33 - Ext Temperature
    check++;
    testData = [0x0B,0x0,0xFF,0x9F,0xFE,0xFE,0x05,0x00,0x00,0x00,0x00];
    message = decode(testData);
    if ((message[0].type != messages.LAIRD_MSG_TEXT_TYPE_TEMP_EXT) ||
        (message[0].value != "-258.97")){
        console.log("Check " + check +  " failed!");
    }
    // 34 - Aggregate Internal TH
    check++;
    testData = [0x02,0x00,0x00,0x00,0x00,0x05,0x02,0x00,0x00,0x00,0x00,
		0x21,0x34,0x43,0x62,
		0x21,0x34,0x43,0x62];
    message = decode(testData);
    if ((message[0].type != messages.LAIRD_MSG_TEXT_TYPE_AGG_TEMP_RH) ||
        (message[0].value[0].humidity != "52.33") ||
        (message[0].value[0].temperature != "98.67") ||
        (message[0].value[1].humidity != "52.33") ||
        (message[0].value[1].temperature != "98.67")){
        console.log("Check " + check +  " failed!");
    }
    // 35 - Aggregate Ext Temperature
    check++;
    testData = [0x0D,0x00,0x00,0x00,0x00,0x05,0x0A,0x00,0x00,0x00,0x00,
        0x0,0x01,0x1,0x21,
        0x0,0x02,0x2,0x22,
        0x0,0x03,0x3,0x23,
        0x0,0x04,0x4,0x24,
        0x0,0x05,0x5,0x25,
        0x0,0x06,0x6,0x26,
        0x0,0x07,0x7,0x27,
        0x0,0x08,0x8,0x28,
        0x0,0x09,0x9,0x29,
        0x0,0x0A,0xA,0x2A,
    ];
    message = decode(testData);
    if ((message[0].type != messages.LAIRD_MSG_TEXT_TYPE_AGG_TEMP_EXT)||
        (message[0].value[0].temperature != "289.01") ||
        (message[0].value[1].temperature != "546.02") ||
        (message[0].value[2].temperature != "803.03") ||
        (message[0].value[3].temperature != "1060.04") ||
        (message[0].value[4].temperature != "1317.05") ||
        (message[0].value[5].temperature != "1574.06") ||
        (message[0].value[6].temperature != "1831.07") ||
        (message[0].value[7].temperature != "2088.08") ||
        (message[0].value[8].temperature != "2345.09") ||
        (message[0].value[9].temperature != "2602.1")){
        console.log("Check " + check +  " failed!");
    }
    // 36. Simple Config
    check++;
    testData = [0x5,0x0,0x0,0x0,0x1,0x5,0x0,0x1];
    message = decode(testData);
    if ((message[0].type != messages.LAIRD_MSG_TEXT_TYPE_SIMPLE_CONFIG)||
        (message[0].value.batteryType != "Unknown")||
        (message[0].value.sensorReadPeriod != 0x1)||
        (message[0].value.aggregateCount != 0x5)||
        (message[0].value.tempAlarmsEnabled != "false")||
        (message[0].value.humidityAlarmsEnabled != "true")){
        console.log("Check " + check +  " failed!");
    }
    // 37. Firmware Version
    check++;
    testData = [0x7,0x0,0x14,0xB,0x5,0x6,0x1,0x1,0x2,0x3,0x4];
    message = decode(testData);
    if ((message[0].type != messages.LAIRD_MSG_TEXT_TYPE_FW_VERSION)||
        (message[0].value.releaseDate != '20/11/5')||
        (message[0].value.releaseNumber != '6.1')||
        (message[0].value.partNumber != 16909060)){
        console.log("Check " + check +  " failed!");
    }
}

/******************************************************************************
 * Uncomment to enable module test
 *****************************************************************************/
//console.log(test())

/******************************************************************************
 * Exports
 *****************************************************************************/
module.exports = decode;
