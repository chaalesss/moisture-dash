> [!NOTE]
> This is just a little document that I typed up to record the tests that I did while I was figuring out how the MCP-3008 and Capacitive Soil Moisuture Sensor works. I'm leaving this here incase it could be of any use at all when calibrating the sensor.

# Value Tests

## Main tests

During these tess, we go off the basis that:
1. A lower value means more moisture
2. A higher value means less moisture

**Test 1**: Completely dry reading outside of soil
Outside of soil, the raw value read around 850. By this point, the plant will be dead.

**Test 2**: Inside of soil underwatered
Inside the soil while it was undwatered, the value read around 550. This is the point where we can assume that the plant is beggining to dry up
and needs water, and that between 550 and 850, the plant is extremely dry and will die if not watered.

**Test 3**: Inside of soil optimally watered
Inside the soil while it was optimally watered, the value read around 310. This is the point where we can assume that the plant is optimally watered, 
and that between 310 and 550, the plant is optimally watered and healthy, and that between 310 and 0, the plant is overwatered and will 
most likely drown.

**Test 4**: Inside of soil overwatered
Inside the soil while it was overwatered, the value read around 360, which is odd because the value should not go up when overwatered. But after
leaving for a while, the value has dropped down to 350, which changes the assumptions to that 350 is the real wet value and means the 
value is over watered.

**Test 5**: Inside tub of water
Inside the tub of water, the wet value also read around 350, which further solidifies the assumption that 350 means overwatered

## Trend and Anomaly

**Trend**:
when the plant was underwatered, the raw value would sit at around 550-560
After the plant was watered to the optimal level, the raw value sat at around 310-320
**Anomaly**:
When the plant was overwatered, the value went up which means drier soil