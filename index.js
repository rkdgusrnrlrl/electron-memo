const {app, BrowserWindow} = require('electron')

// hot loader config
require('electron-reload')(__dirname)

app.on('ready', () => {
	const win = new BrowserWindow({
		frame: false,
		width: 400,
		height: 400
	})
	win.loadFile('./memo.html')
})
