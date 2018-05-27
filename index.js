const {app, BrowserWindow, Tray} = require('electron')

// hot loader config
require('electron-reload')(__dirname)

app.on('ready', () => {
	const win = new BrowserWindow({
		width: 400,
		height: 400
	})

	win.setMenu(null)
	win.loadFile('./memo.html')

	const trayIcon = new Tray('sticky-note.png')
	console.log(trayIcon)
	// opem devtool
	// win.webContents.openDevTools()
})
