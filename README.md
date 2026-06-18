# Moisture-Dash

**A web application application that runs on Raspberry Pi for adding plants and monitoring their moisture through moisture sensors attached to the Raspberry Pi, the application runs on a Python backend using a flask library. It is not at a current state where it can be used as a fully working application, it's just a proof of concept that Python can be used as a backend**

## Getting started

### Prerequisites

- A Raspberry Pi 5 with Ubuntu Server or any other Debian based Linux Distro
- An MCP3008 Microchip wired up to the Pi on a breadboard
- Capacitive Soil 2.0.0 moisture sensors connected to the MCP3008 channels

> [!NOTE]
> If you don't own one or more of these requirements, there is a mode which can be run without the need for the Raspberry Pi or Moisture Sensors. This is a debug mode which can also be used to take the MCP3008 and moisture sensors out of the equation which could be useful for anyone trying to figure out whats wrong.
> 
> Wiring the MCP3008 can be hard, you can find a guide on how to wire it to the Raspberry Pi with this link:
>  https://randomnerdtutorials.com/raspberry-pi-analog-inputs-python-mcp3008/#wire-mcp3008-raspberry-pi
>
> To wire the Capacitive soil moisture sensor, you need to wire it like this:
> - VCC (Voltage): Connect this pin to the 5V output of your microcontroller or external power source.
> - GND (Ground): Connect this pin to the ground (GND) of your microcontroller.
> - AOUT (Analog Output): Connect this pin to an analog input pin on your MCP3008
>
> Refer to the pin diagram and table for the MCP3008 to wire it correctly found here:
> https://randomnerdtutorials.com/raspberry-pi-analog-inputs-python-mcp3008/#introducing-mcp3008

### Downloading and the application

Downloading and getting the application working is fairly simple, start by downloading the ZIP file from the 'Code' button, then extract the files into a seperate folder on your computer.

For example, create a folder in your documents folder called 'moisture-dash' and then extract the contents of ZIP file there.

> [!WARNING]
> **DO NOT** try to run any of the python files individually using the 'python' command, you will only run into errors and make it harder for yourself.

### Running the application

Open up a new terminal and start by navigating inside the folder where you extracted the files to using the command

```bash
cd /path/to/application/folder
```

then you need to run the file called `run.sh` using whichever shell you use normally

#### If you have a Raspberry Pi fully setup with the moisture sensors

You need to run the main run shellscript

**Bash:**

```bash
bash run.sh
```

**Zsh:**

```bash
zsh run.sh
```

#### If you are on MacOS, don't have any of the requirements or are trying to debug the application

you need to run the debug shellscript

**Bash:**

```bash
bash run_dbg.sh
```

**Zsh:**

```bash
zsh run_dbg.sh
```

#### If you're on Windows

I made a Powershell script to run the debug version, I haven't tested it out but you can run it by simply double clicking `run_dbg.ps1` in the file explorer.

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

This tells us which IP and port the application is running on. by default, the IP will be 0.0.0.0 (listens on all network interfaces) and the port will be 5000.

**If you want to change the IP and port**, navigate the the backend folder and open the python file called `dashboard_main.py` in your text editor. Then scroll all the way down to the bottom until you find this block of code:

```python
if __name__ == "__main__":
    # Change host IP and port here (Default: host='127.0.0.1', port='5000')
    app.run(host='127.0.0.1', port=5000, debug=True)
```

Here you can change the `host` and `port` variables, if port 5000 is occupied, change it to another port between 5000 and 6000

**You have two options for the `host` variable**:

1. **`127.0.0.1`** - Listens on only localhost, meaning the website can only be accessed from the device that the server is running on. This is the IP that you will put into your searchbar.
2. **`0.0.0.0`** - Listens on all network interfaces, this will show up as your routers IP when you run the application, which is the IP that you will put into your searchbar, and it means that other devices that are on the same network can connect the the website.

> [!IMPORTANT]
> Make sure to save and overwrite the changes if you change either of these variables

---

Now, go to your browser of choice and type:

```
https://{your.chosen.ip.here}:{your chosen port here}
```

If everything is working properly, this should direct you to a login page. You wont have an account yet, but you can create one by clicking the green register button in the top right of the navbar, or by clicking the link that says 'Dont have an account? Register'.

Once you have created an account and logged in, you will now be able to view the main dashboard, where you can add and monitor plants.