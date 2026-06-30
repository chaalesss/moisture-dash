import spidev
import time

# -------- SPI SETUP --------
spi = spidev.SpiDev()
spi.open(0, 0)  # Bus 0, CE0
spi.max_speed_hz = 1350000


# -------- CALIBRATION VALUES --------
DRY_VALUE = 850   # sensor value when soil is completely dry
WET_VALUE = 350   # sensor value when soil is very wet
# -------- READ MCP3008 CHANNEL --------
def read_channel(channel):
    adc = spi.xfer2([1, (8 + channel) << 4, 0])
    value = ((adc[1] & 3) << 8) + adc[2]
    return value

# -------- READ AVERAGE --------
def read_average(channel, samples=10):
    total = 0
    for _ in range(samples):
        total += read_channel(channel)
        time.sleep(0.05)
    return total / samples

# -------- CONVERT TO PERCENTAGE --------
def moisture_percent(value):
    percent = (DRY_VALUE - value) / (DRY_VALUE - WET_VALUE) * 100
    percent = max(0, min(100, percent))  # clamp 0–100
    return percent


# -------- GET CURRENT SENSOR DATA --------
def get_moisture_data(sensor):
    raw_value = read_average(sensor)
    percent = moisture_percent(raw_value)
    return {
        "raw_value": round(raw_value, 1),
        "moisture": round(percent, 1)
    }
