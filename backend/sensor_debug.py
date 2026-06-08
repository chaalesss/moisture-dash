import spidev
import time

# -------- SPI SETUP --------
spi = spidev.SpiDev()
spi.open(0, 0)  # Bus 0, CE0
spi.max_speed_hz = 1350000

# -------- READ MCP3008 CHANNEL --------
def read_channel(channel):
    adc = spi.xfer2([1, (8 + channel) << 4, 0])
    value = ((adc[1] & 3) << 8) + adc[2]
    return value

# -------- MAIN LOOP --------
while True:

    raw_value = read_channel(0)  # CH0

    print(f"Raw value: {raw_value}")

    time.sleep(0.5)
    