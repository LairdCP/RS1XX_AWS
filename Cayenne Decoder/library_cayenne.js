/******************************************************************************
 * Cayenne Low-power Payload Library
 *
 * @author Ashu Joshi @ AWS
 * Adapted & fixed from: https://gist.github.com/iPAS/e24970a91463a4a8177f9806d1ef14b8
 * Fixed issues with Accelerometer, Gyrometer and Humidity.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 *****************************************************************************/
const util = require('util');
const sensor_types_cayenne = require('./sensor_types_cayenne');

/******************************************************************************
 * Byte stream to fixed-point decimal word.
 *
 * @param stream: array of bytes.
 * @return: word of the bytes in big-endian format.
 *****************************************************************************/
function arrayToDecimal(stream, is_signed=false, decimal_point=0) {

    var value = 0;
    var edge;
    var max;

    for (var i = 0; i < stream.length; i++) {
        if (stream[i] > 0xFF)
            throw 'Byte value overflow!';
        value = (value<<8) | stream[i];
    }

    if (is_signed) {
        edge  = 1 << (stream.length  )*8;  // 0x1000..
        max   = (edge-1) >> 1;             // 0x0FFF.. >> 1
        value = (value > max) ? value - edge : value;
    }

    if (decimal_point) {
        value /= Math.pow(10, decimal_point);
    }

    return value;
}

/******************************************************************************
 * Cayenne Low-power Payload Decoder
 *
 * @param payload: array of bytes.
 * @return: JSON
 *****************************************************************************/
function decode(payload) {

    if (payload == null)
        payload = [
            0x01, 0x67, 0x00, 0xE1,  // "temperature_1"        : 22.5   (fixed point)
            0x02, 0x73, 0x29, 0xEC,  // "barometric_pressure_2": 1073.2 (fixed point)
            0x03, 0x88,              // "gps_3":
            0x02, 0xDD, 0xFC,        //          { "latitude" : 18.79,
            0x0F, 0x1A, 0x68,        //            "longitude": 98.98,
            0x00, 0x79, 0x18,        //            "altitude" : 310 }
            ]
    /**
     * @reference https://github.com/myDevicesIoT/cayenne-docs/blob/master/docs/LORA.md
     *
     * Type                 IPSO    LPP     Hex     Data Size   Data Resolution per bit
     *  Digital Input       3200    0       0       1           1
     *  Digital Output      3201    1       1       1           1
     *  Analog Input        3202    2       2       2           0.01 Signed
     *  Analog Output       3203    3       3       2           0.01 Signed
     *  Illuminance Sensor  3301    101     65      2           1 Lux Unsigned MSB
     *  Presence Sensor     3302    102     66      1           1
     *  Temperature Sensor  3303    103     67      2           0.1 °C Signed MSB
     *  Humidity Sensor     3304    104     68      1           0.5 % Unsigned
     *  Accelerometer       3313    113     71      6           0.001 G Signed MSB per axis
     *  Barometer           3315    115     73      2           0.1 hPa Unsigned MSB
     *  Gyrometer           3334    134     86      6           0.01 °/s Signed MSB per axis
     *  GPS Location        3336    136     88      9           Latitude  : 0.0001 ° Signed MSB
     *                                                          Longitude : 0.0001 ° Signed MSB
     *                                                          Altitude  : 0.01 meter Signed MSB
     */
    var sensor_types = {
            0  : {'size': 1, 'name': 'Digital Input'      , 'signed': false, 'decimal_point': 0,},
            1  : {'size': 1, 'name': 'Digital Output'     , 'signed': false, 'decimal_point': 0,},
            2  : {'size': 2, 'name': 'Analog Input'       , 'signed': true , 'decimal_point': 2,},
            3  : {'size': 2, 'name': 'Analog Output'      , 'signed': true , 'decimal_point': 2,},
            101: {'size': 2, 'name': 'Illuminance Sensor' , 'signed': false, 'decimal_point': 0,},
            102: {'size': 1, 'name': 'Presence Sensor'    , 'signed': false, 'decimal_point': 0,},
            103: {'size': 2, 'name': 'Temperature Sensor' , 'signed': true , 'decimal_point': 1,},
            104: {'size': 1, 'name': 'Humidity Sensor'    , 'signed': false, 'decimal_point': 1,},
            113: {'size': 6, 'name': 'Accelerometer'      , 'signed': true , 'decimal_point': [3,3,3]},
            115: {'size': 2, 'name': 'Barometer'          , 'signed': false, 'decimal_point': 1,},
            134: {'size': 6, 'name': 'Gyrometer'          , 'signed': true , 'decimal_point': [2,2,2]},
            136: {'size': 9, 'name': 'GPS Location'       , 'signed': true, 'decimal_point': [4,4,2], },};

    var sensors = {};
    var s_no;
    var s_type;
    var s_size;
    var s_name;
    var s_value;
    var is_signed;
    var decimal_point;

    var i = 0;
	while (i < payload.length) {
	    s_no   = payload[i++];
		s_type = payload[i++];
		if (typeof sensor_types[s_type] == 'undefined')
		    throw (util.format('Sensor type error!: %d', s_type));
		s_size = sensor_types[s_type].size;
	    s_name = sensor_types[s_type].name;

	    switch (s_type) {
            case (sensor_types_cayenne.SENSOR_TYPE_DIGITAL_INPUT):
            case (sensor_types_cayenne.SENSOR_TYPE_DIGITAL_OUTPUT):
            case (sensor_types_cayenne.SENSOR_TYPE_ANALOG_INPUT):
            case (sensor_types_cayenne.SENSOR_TYPE_ANALOG_OUTPUT):
            case (sensor_types_cayenne.SENSOR_TYPE_ILLUMINANCE):
            case (sensor_types_cayenne.SENSOR_TYPE_PRESENCE):
            case (sensor_types_cayenne.SENSOR_TYPE_TEMPERATURE):
            case (sensor_types_cayenne.SENSOR_TYPE_HUMIDITY):
            case (sensor_types_cayenne.SENSOR_TYPE_PRESSURE):
                s_value = arrayToDecimal(payload.slice(i, i+s_size),
                        is_signed     = sensor_types[s_type].signed,
                        decimal_point = sensor_types[s_type].decimal_point);
                // Resolution fix for humidity - at 0.5
                if (s_type == sensor_types_cayenne.SENSOR_TYPE_HUMIDITY) { s_value = s_value * 5};
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_ACCELEROMETER):
            case (sensor_types_cayenne.SENSOR_TYPE_GYROSCOPE):
                s_value = {
                    'x': arrayToDecimal(payload.slice(i+0, i+2),
                        is_signed=sensor_types[s_type].signed,
                        decimal_point=sensor_types[s_type].decimal_point[0]),
                    'y': arrayToDecimal(payload.slice(i+2, i+4),
                        is_signed=sensor_types[s_type].signed,
                        decimal_point=sensor_types[s_type].decimal_point[1]),
                    'z': arrayToDecimal(payload.slice(i+4, i+6),
                        is_signed=sensor_types[s_type].signed,
                        decimal_point=sensor_types[s_type].decimal_point[2]),
                };
                break;
            case (sensor_types_cayenne.SENSOR_TYPE_GPS):
                s_value = {
                        'latitude':  arrayToDecimal(payload.slice(i+0, i+3),
                            is_signed=sensor_types[s_type].signed,
                            decimal_point=sensor_types[s_type].decimal_point[0]),
                        'longitude': arrayToDecimal(payload.slice(i+3, i+6),
                            is_signed=sensor_types[s_type].signed,
                            decimal_point=sensor_types[s_type].decimal_point[1]),
                        'altitude':  arrayToDecimal(payload.slice(i+6, i+9),
                            is_signed=sensor_types[s_type].signed,
                            decimal_point=sensor_types[s_type].decimal_point[2]),};
                break;
        }

	    sensors[s_no] = {'type': s_type, 'type_name': s_name, 'value': s_value };
	    i += s_size;
	}

	return sensors;
}

/******************************************************************************
 * Test code for the above
 *
 * @param
 * @return:
 *****************************************************************************/
function test() {
    var check = 0;
    var message = [];

    // Test arrayToDecimal()
    var arrTest = [ 0xFF ];
    var is_signed;
    console.log(arrayToDecimal(arrTest) + ' -> ' + arrayToDecimal(arrTest, is_signed=true));  // -1
    arrTest = [ 0xFF, 0xFF ];
    console.log(arrayToDecimal(arrTest) + ' -> ' + arrayToDecimal(arrTest, is_signed=true));  // -1

    // Test decode()
    // 1. 1 Temperature
    check++;
    arrayTest = [0x1, 0x67, 0x01, 0x10];
    message = decode(arrayTest);
    if ((message[1].type != 103)||
        (message[1].type_name != "Temperature Sensor")||
        (message[1].value != 27.2)){
        console.out("Check " + check + " failed!\n");
    }
    // 2. 1 Voltage
    check++;
    arrayTest = [0x1, 0x3, 0x3, 0xED];
    message = decode(arrayTest);
    if ((message[1].type != 3)||
        (message[1].type_name != "Analog Output")||
        (message[1].value != 10.05)){
        console.out("Check " + check + " failed!\n");
    }
    // 3. 1 Temperature, 1 Voltage
    check++;
    arrayTest = [0x1, 0x67, 0x01, 0x10,0x2, 0x3, 0x3, 0xED];
    message = decode(arrayTest);
    if ((message[1].type != 103)||
        (message[1].type_name != "Temperature Sensor")||
        (message[1].value != 27.2)||
        (message[2].type != 3)||
        (message[2].type_name != "Analog Output")||
        (message[2].value != 10.05)){
        console.out("Check " + check + " failed!\n");
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
