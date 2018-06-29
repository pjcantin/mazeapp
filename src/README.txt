MAZE GAME


I. Setup

	1) Setup your ReactJS environment and create a new app; include the REPOSITORY'S index.js and index.css within the app's
	   project directory.
	2) Go to www.mazegenerator.net.
	3) Select desired width and height of the maze.
	4) At the drop-down box located just above the maze preview, select 'SVG', and click 'Download'.
	5) Within Visual Studio 20XX, create a new project, and copy the contents of the REPOSITORY'S Program.cs to the Program.cs
	   file created in VS.
	6) Copy the SVG file to the same directory as the .sln file.
	7) Run the Visual Studio application; this will generate a JSON file that will represent the borders of the maze.
	8) Copy the JSON file to the app's project directory, and run the app.

II. TODO (?)

	1) Need to fix updating 'hidden' squares when the user moves a space (comment out first line of UpdateHiddenSquares() to test).
		a. Not enough squares are set visible
		b. Incorrect squares are set visible
		c. Borders won't show up properly
	2) Would like to find out how to read keystroke input without using an HTML <input> tag and having user click within.
	3) Lots of code cleanup
	4) Nice to Haves
		a. Checkbox to show/hide exit
		b. Checkboxes to set different difficulty levels
			b1. Easy - just show maze as-is
			b2. Medium - hide squares that aren't within a given radius
			b3. Hard - only show squares that are within two units of person, and do NOT show squares past borders
		c. Better victory event than just showing 'WINNER!'