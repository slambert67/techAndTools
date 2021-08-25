-- -----------------------------------------------------------------------------
--
--              Copyright (c) ADB SAFEGATE Airport Systems UK Ltd 2020 
--                            All rights reserved
--
-- -----------------------------------------------------------------------------
--            
-- Subsystem Name  : Automated Server Testing Framework
-- Module          : auto_test_pkg body   
-- Original Author : Steve Lambert                
--
-- -----------------------------------------------------------------------------
--
-- Description
-- -----------
-- Packaged routines used for framework self testing
--
--
-- Modification History
-- --------------------
-- AIMS-3270 - Steve Lambert - 17/04/20 - Miscellaneous cosmetic changes
-- AIMS-3460 - Steve Lambert - 27/05/20 - Handle Booleans
-- AIMS-3884 - Steve Lambert - 22/09/20 - Implement today and now plus offsets as options 
--                                        for specifiying dates
-- AIMS-4467 - Steve Lambert - 11/01/21 - Handle procedures with no parameters
-- -----------------------------------------------------------------------------

CREATE OR REPLACE PACKAGE BODY 
-- Identifier: AIMS-4467

auto_test_pkg IS

PROCEDURE pkgProc(pIn1  IN NUMBER,  pIn2 IN VARCHAR2,   pIn3 IN DATE, pIn4 IN BOOLEAN,
                  pOut1 OUT NUMBER, pOut2 OUT VARCHAR2, pOut3 OUT DATE, pOut4 OUT BOOLEAN)
IS
BEGIN
  pOut1 := pIn1;
  pOut2 := pIn2;
  pOut3 := pIn3;
  pOut4 := pIn4;
END;

FUNCTION pkgStringFunc(pIn1  IN NUMBER,  pIn2 IN VARCHAR2,   pIn3 IN DATE,
                       pOut1 OUT NUMBER, pOut2 OUT VARCHAR2, pOut3 OUT DATE) RETURN VARCHAR2
IS
BEGIN
  pOut1 := pIn1;
  pOut2 := pIn2;
  pOut3 := pIn3;

  RETURN 'String value';
END;

FUNCTION pkgNumberFunc(pIn1  IN NUMBER,  pIn2 IN VARCHAR2,   pIn3 IN DATE,
                       pOut1 OUT NUMBER, pOut2 OUT VARCHAR2, pOut3 OUT DATE) RETURN NUMBER
IS
BEGIN
  pOut1 := pIn1;
  pOut2 := pIn2;
  pOut3 := pIn3;

  RETURN 666;
END;

FUNCTION pkgDateFunc(pIn1  IN NUMBER,  pIn2 IN VARCHAR2,   pIn3 IN DATE,
                     pOut1 OUT NUMBER, pOut2 OUT VARCHAR2, pOut3 OUT DATE) RETURN DATE
IS
BEGIN
  pOut1 := pIn1;
  pOut2 := pIn2;
  pOut3 := pIn3;

  RETURN pIn3;
END;

FUNCTION pkgBooleanFunc(pIn1 IN BOOLEAN, pOut1 OUT BOOLEAN) RETURN BOOLEAN
IS
BEGIN
  pOut1 := pIn1;

  RETURN TRUE;
END;

FUNCTION pkgClobFunc(pOut1 OUT CLOB) RETURN CLOB
IS
  returnVal CLOB;
BEGIN

  pOut1 :=
    '{
       "num1"    : 1,
       "str1"    : "string1",
       "bool1"   : true,
       "bool2"   : false,
       "obj1"    : {"num2":2, "str2":"string2", "bool3":true, "arr1":[3, "string3", false, {"str4":"string4"}, [4, "string5", true, {"str6":"string6"}] ]},
       "arr2"    : [ 5, "string7", true, {"num6":6, "str8":"string8", "bool4":false}, [7, "string9", false] ],
       "arr3"    : [[[[[[[[[[{"num7":7, "str10":"string10", "bool5":true}]]]]]]]]]],
       "num8"    : null,
       "str11"   : null,
       "bool6"   : null,
       "null1"   : null,
       "empty_object": {}
     }';

  returnVal := '[
    {
        "direction": "arrival",
        "airport": "HKG",
        "id": 750231,
        "actualInBlockTime": "2020-09-25T06:56:12Z",
        "carrierIATACode": "BA",
        "carrierICAOCode": "BAW",
        "codeShareStatus": "00",
        "displayRollOff": {
            "displayBaggage": "A",
            "displayPublic": "Y",
            "displayStaff": "A"
        },
        "flightClassificationCode": "AGR",
        "flightIdentity": "BA003",
        "flightNatureCode": "CGO",
        "flightNumber": "003",
        "flightOriginDate": "2020-09-22",
        "flightRepeatCount": 0,
        "flightSectorCode": "I",
        "flightServiceTypeIATACode": "F",
        "flightStatusCode": "DB",
        "flightTerminal": "1",
        "gates": [
            {
                "gate": "1",
                "gateCloseTime": "2020-09-24T14:26:00Z",
                "gateOpenTime": "2020-09-26T21:56:00Z"
            },
            {
                "gate": "2"
            }
        ], "handlingAgentCode": "BAC",
        "ICAOFlightIdentity": "BAW003",
        "isTransit": true,
        "landedSignal": "L",
        "latestKnownTime": "2020-09-25T06:56:12Z",
        "originIATACode": "BHX",
        "originICAOCode": "EGBB",
        "publicCarrierCode": "BA",
        "publicFlightIdentity": "BA003",
        "remarkCodeBaggage": "ARR",
        "remarkCodeGeneral": "ARR",
        "remarkCodePublic": "ARR",
        "scheduledDate": "2020-09-22",
        "scheduledTime": "2020-09-22T23:26:12Z",
        "vias": [
            {
                "viaIATACode": "LHR",
                "viaICAOCode": "EGLL"
            },
            {
                "viaIATACode": "ARN",
                "viaICAOCode": "ESSA"
            },
            {},
            {
                "viaIATACode": "TPA",
                "viaICAOCode": "KTPA"
            },
            {},
            {}
        ],
        "links": [
            {
                "rel": "self",
                "href": "/flights/750231"
            }
        ]
    }
]';

  RETURN returnVal;
END;

FUNCTION pkgNoParamsFunc RETURN VARCHAR2
IS
BEGIN
  RETURN 'No parameters';
END;

PROCEDURE pkgNoParamsProc
IS
BEGIN
  NULL;
END;

BEGIN
NULL;
END;
/

