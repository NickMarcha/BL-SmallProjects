# BL-SmallProjects
Some small projects I did for a GTA game server called Badlands


## blmap
### Need:
  Track locations that would switch regularly and share them between groups I played with, interactive zoom to not need multiple pictures for the same location, some filtering to keep things organized.
### Result:
  Google Spreadsheet to store data, locations in x,y with an associated category, an endpoint which rendered a [leaflet.js](https://leafletjs.com/) interactive map where categories could be highlighted by preference


## bl-ledger
### Need: 
In-game a safe with money could store collective contributions, but it lacked proper logging to keep track of contributions and withdrawals, who made them for what purpose etc. Also, no editing was possible if a wrong entry was made 
### Result:
A Google spreadsheet database where the treasurer(and related) could keep track of all entries and edit. A Discord bot frontend for regular members to interact with. Commands for entering a withdrawal/deposit with amount and purpose, with new total sum calculated automatically(had to be done manually before). The bot would fill in relevant information if not explicitly provided, Who was the entry for, who entered the entry, timestamp etc. A confirmation message provided with new total and the possibility to edit the entry if an error was made by undoing the last entry all from the discord channel, so regular members did not have to deal with spreadsheets.


## bl-auction

### Need
The server provided a way to show images, through an iframe (very limited markup language). We wanted to display current auctions, with the current highest bid while members were offline. 

### Result:

A front end that dynamically rendered images based on data from a Google spreadsheet. Auctioneers would receive messages while offline in the game and could enter the new information in a spreadsheet which would be rendered whenever someone on the server opened a note*(with the image sourced from front end). The image would also update providing a countdown for when auctions ended as well as a timestamp for when the image was last rendered. 
