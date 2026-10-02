# Moisture-Dash

A web application that runs on Raspberry Pi for adding plants and monitoring their moisture through moisture sensors attached to the Raspberry Pi, the application runs on a Python backend using a flask library. It is not at a current state where it can be used as a fully working application, it's just a proof of concept that Python can be used as a backend

## Extra Documentation

1. [Project Overview](/docs/overview.md)
2. [Calibrating the Sensors](/docs/calibration.md)
3. [Value Tests](/docs/value-tests.md)
4. [Wiring and SPI](/docs/hardware-setup.md)
5. [Routes/Endpoints](/docs/api.md)

## Getting started

### Prerequisites

- A Raspberry Pi 5 with Ubuntu Server or any other Debian based Linux Distro
- An MCP3008 Microchip wired up to the Pi on a breadboard
- [Capacitive Soil Moisture Sensor 2.0.0](https://thepihut.com/products/capacitive-soil-moisture-sensor?variant=32137736421438&country=GB&currency=GBP&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&gad_source=1&gad_campaignid=11673057096&gbraid=0AAAAADfQ4GGfXd-Q6EcTrRtpYx0sD_aVy&gclid=CjwKCAjwifjVBhBKEiwAYx4K9Liytz59oILRDi6OLtQSTe5LhvIezgZoHDDL8-lYNhbBKRml0fdCFxoCL8YQAvD_BwE) connected to the MCP3008 channels

> [!NOTE]
> If you don't own one or more of these requirements, there is a mode which can be run without the need for the Raspberry Pi or Moisture Sensors. This is a debug mode which can also be used to take the MCP3008 and moisture sensors out of the equation which could be useful for anyone trying to figure out what's wrong.
>
> Wiring the MCP3008 can be hard, you can find a guide on how to wire it to the Raspberry Pi with this link:
>
> [MCP3008 Wiring Guide](https://randomnerdtutorials.com/raspberry-pi-analog-inputs-python-mcp3008/#wire-mcp3008-raspberry-pi)
>
> To wire the Capacitive soil moisture sensor, you need to wire it like this:
>
> - VCC (Voltage): Connect this pin to the 5V output of your microcontroller or external power source.
> - GND (Ground): Connect this pin to the ground (GND) of your microcontroller.
> - AOUT (Analog Output): Connect this pin to an analog input pin on your MCP3008
>
> Refer to the pin diagram and table for the MCP3008 to wire it correctly found here:
>
> [MCP3008 Pin Diagram](https://randomnerdtutorials.com/raspberry-pi-analog-inputs-python-mcp3008/#introducing-mcp3008)

### Downloading and the application

Downloading and getting the application working is fairly simple, start by downloading the ZIP file from the 'Code' button, then extract the files into a separate folder on your computer.

For example, create a folder in your documents folder called 'moisture-dash' and then extract the contents of ZIP file there.

> [!WARNING]
> **DO NOT** try to run any of the python files individually using the 'python' command, you will only run into errors and make it harder for yourself.

### Running the application

Open up a new terminal and start by navigating inside the folder where you extracted the files to using the command.

```bash
cd /path/to/application/folder
```

Then you need to run the file called `run.sh` using whichever shell you use normally.

#### If you have a Raspberry Pi fully setup with the moisture sensors

You need to run the main shellscript

**Bash:**

```bash
bash run.sh
```

**Zsh:**

```bash
zsh run.sh
```

#### If you are on macOS, don't have any of the requirements or are trying to debug the application

you need to run the debug shellscript

**Bash:**

```bash
bash run_dbg.sh
```

**Zsh:**

```bash
zsh run_dbg.sh
```

If everything is working correctly, your command line should return something like:

```bash
Starting Flask server...
 * Serving Flask app 'backend/dashboard_main.py'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

This means that everything has installed properly and you can now access the website.

## Using the website

The important part of that output from before that we need to focus on here is:

```bash
* Running on http://127.0.0.1:5000
```

This tells us which IP and port the application is running on. By default, the IP will be 0.0.0.0 (listens on all network interfaces) and the port will be 5000.

**If you want to change the IP and port**, navigate the backend folder and open the python file called `dashboard_main.py` in your text editor. Then scroll all the way down to the bottom until you find this block of code:

```python
if __name__ == "__main__":
    # Change host IP and port here (Default: host='127.0.0.1', port='5000')
    app.run(host='127.0.0.1', port=5000, debug=True)
```

Here you can change the `host` and `port` variables, if port 5000 is occupied, change it to another port between 5000 and 6000

**You have two options for the `host` variable**:

1. **`127.0.0.1`** - Listens on only localhost, meaning the website can only be accessed from the device that the server is running on. This is the IP that you will put into your search bar.
2. **`0.0.0.0`** - Listens on all network interfaces, this will show up as your routers IP when you run the application, which is the IP that you will put into your search bar, and it means that other devices that are on the same network can connect the website.

> [!IMPORTANT]
> Make sure to save and overwrite the changes if you change either of these variables.

---

Now, go to your browser of choice and type:

https://{your.chosen.ip.here}:{your chosen port here}

If everything is working properly, this should direct you to a login page. You won't have an account yet, but you can create one by clicking the green register button in the top right of the navbar, or by clicking the link that says 'Don't have an account? Register'.

Once you have created an account and logged in, you will now be able to view the main dashboard, where you can add and monitor plants.

![The home page of the app](/assets/imgs/homepage.png)

## How to use the application

When you reach the main dashboard, you should see a screen that doesn't have any plant cards yet. Instead, you will see the text:

"It seems that you don't have any plants added yet, to get started, add a plant, and it will show up here."

## Adding a plant

There will also be a blue "Add plant" button, clicking this button will take you to the following page:

![The add page for the app](/assets/imgs/add_page.png)

On here, you can add your own plant, give it a name, specify the species of plant and assign a sensor number.

### Assigning a sensor number

Assigning a sensor number can be difficult, but if you have wired the sensors up correctly, you can easily label each one physically and use that to assign a number.

The application supports up to five sensors at a time. If you have wired them correctly, they should correspond to channels 0–4, so label your sensors accordingly using that information, then you can assign a sensor number.

> [!Important]
> Trying to assign 2 plants to the same sensor will **NOT** work

## Viewing the plants dashboard

Once you have added a plant, click the `"Moisture-Dash"` label in the top left corner of the screen to go back to the homepage, you should now see a card containing the name of your plant, the species, moisture level and raw moisture value. If you click on this card, you should see the dashboard for that plant:

![The dashboard for "Plant 1"](/assets/imgs/plant_dashboard.png)

Here you can see more detailed information on the plant, like status and last watered information. You will also see an upload area for a photo of the plant. If you drag an image onto that area, it will automatically be uploaded and saved to that plant. Alternatively, if you click on the upload area, you can upload the image from the file explorer.

On the right of the screen is the history chart, which will show you the moisture level of a plant at a given time. This is every 10 seconds in debug mode, or every 6 hours using a Pi with a moisture sensor
