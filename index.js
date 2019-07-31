/* eslint-disable indent */
const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron')

// hot loader config
require('electron-reload')(__dirname)

function newNote () {
	const newWin = new BrowserWindow({
		width: 400,
		height: 400
	})

	newWin.setMenu(null)
	newWin.loadFile('./memo.html')
}

app.on('ready', () => {
	const win = new BrowserWindow({
		width: 400,
		height: 400
	})

	win.setMenu(null)
	win.loadFile('./memo.html')

	const trayIcon = new Tray('sticky-note.png')
	console.log(trayIcon)

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'new note',
			click: () => {
				newNote()
			}
		}
	])

	trayIcon.setContextMenu(contextMenu)

	globalShortcut.register('Control+Shift+n', () => {
		newNote()
	})

	// opem devtool
	// win.webContents.openDevTools()
})
