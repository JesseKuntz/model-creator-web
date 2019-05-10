# model-creator-web
Web component for the Model Creator system. This was first developed as a senior project at Calvin College. It's a developer tool right now, not a product, so keep that in mind. If you would like to see the app component, go here: https://github.com/JesseKuntz/model-creator-app

##  Vision

![resources](https://docs.google.com/drawings/d/e/2PACX-1vTSGtvEB-2kYkFJZNt5dKaUkE3jsi5QUbPQCxuwisvKpch-NztI2-fnEJ4bIkQ0n6RYHw58-SWANbU2/pub?w=1392&h=699)

You have an app on your smartphone. Using the accelerometer (with the assistance of the gyroscope), you can track position relative to where you started recording position. The position is recorded in two axes, x and y, and the system is meant to record the position of larger objects (from the top of a table to the perimeter of a small room).



Once all of the position points have been collected, you can send the data to a web server that will graph your points for you, as well as give you the option to export your data to a Blender-compatible file to be further edited.

## Dependencies
* Git (but hopefully you have that already): https://git-scm.com/
* Node.js: https://nodejs.org/en/
* A Plotly.js account: https://plot.ly/Auth/login/?next=%2Fsettings

## Get Started

Clone the repo. Rename the .env-template file as .env, and follow the instructions in the file, filling in your own information in place of the dummy data.

Then, go to 'public/script.js' and replace the URL in the 'src' attribute of the iframe with the URL for your graph from Plotly. When you send the data over, it will tell you what the URL is in the terminal/console output.

After that, run:

`npm install`

Then, you can start the site up by running:

`npm start`

After that, visit the site at http://localhost:3000

## How it Works

When the points are sent from the app, the leftmost box will display the graph from Plotly, but you may need to refresh the page in order for the graph to update. The top-right box gives you the option to choose an exporter (you must do this in order to export), and you can name your file if you want. When you click export, the file will be downloaded, which you can then import into Blender using the Collada importer. Very straightforward!