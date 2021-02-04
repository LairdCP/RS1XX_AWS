[![Laird Connectivity](images/Laird_Logo.jpg)](https://www.lairdconnect.com/)
# RS1XX AWS IoT Core for LoRaWAN Lambda functions
[![AWS Qualified Device](images/AWS_Qualified_Device.jpg)](https://devices.amazonaws.com/)
[![Sentrius RS1XX](images/RS1xx.jpg)](https://www.lairdconnect.com/wireless-modules/lorawan-solutions/sentrius-rs1xx-lora-enabled-sensors)

This is a collection of Lambda functions for use within AWS IoT Core for LoRaWAN. They are developed in NodeJS 10.x.

# Content

Two sets of Lambda functions are included as follows.

* Cayenne Decoder: This allows messages received in the Cayenne LPP Packet Format to be decoded into JSON messages.

* Laird Decoder: This allows messages received in the Laird and Laird 2 Packet Formats to be decoded into JSON messages.

Refer to the RS1XX Configuration Guide [1] for details of configuring the Packet Format.

# Adding the Lambda functions to an application

The Lambda functions can be added to an application in one of three ways.

* The content of the appropriate files can be copied and pasted into AWS' Lambda creation console in newly created files using the same names as the original files.

* The appropriate Decoder files can be downloaded and added to a zip file. The zip file can then be uploaded in AWS' Lambda console.

* The appropriate Decoder files can be downloaded and added to a zip file, then added to an AWS S3 account. The zip file can then be downloaded from the S3 account in AWS' Lambda console.

Refer to [2] for more details of the AWS Lambda console. More details of AWS S3 are available at [3].

# File details

The following files are included in the Cayenne Decoder folder.

* index.js - This is the entry point for the Lambda function.

* library_cayenne.js - Contains the Cayenne protocol decoding logic.

* sensor_types_cayenne.js - Contains constant data associated with the Cayenne LPP.

The following files are included in the Laird Decoder folder.

* index.js - This is the entry point for the Lambda function.

* library_laird.js - Contains the Laird & Laird 2 protocol decoding logic.

* messages_laird.js - Contains constant data associated with the Laird & Laird 2 Packet Formats.

[1]: https://www.lairdconnect.com/documentation/sentrius-rs1xx-configuration-guide-v112 "RS1XX Configuration Guide"

[2]: https://aws.amazon.com/lambda/ "AWS Lambda"

[3]: https://aws.amazon.com/s3/ "AWS S3"
