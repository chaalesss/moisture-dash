# Moisture-Dash

**A web application application that runs on Raspberry Pi for adding plants and monitoring their moisture through moisture sensors attached to the Raspberry Pi, the application runs on a Python backend using a flask library. It is not at a current state where it can be used as a fully working application, it's just a proof of concept that Python can be used as a backend**

## Getting started with setting up the database

> [!NOTE]
> Please note that this guide may change as the application is updated and compiled.

Downloading and getting the application working is fairly simple, start by downloading the ZIP file from the 'Code' button, then extract the files into a seperate folder on your computer.

For example, create a folder in your documents folder called 'moisture-dash' and then extract the contents of ZIP file there.

> [!WARNING]
> **DO NOT** try to run any of the python files individually using the 'python' command, you will only run into errors and make it harder for yourself.

### To run the application

Open up a new terminal and start by navigating inside the folder where you extracted the files to using the command

```bash
cd /path/to/application/folder
```

then you need to run the file called `run.sh` using whichever shell you use normally

**Bash:**

```bash
bash run.sh
```

**Zsh:**

```bash
zsh run.sh
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