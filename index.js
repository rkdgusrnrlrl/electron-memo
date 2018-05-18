const {app, BrowserWindow} = require('electron')

app.on('ready', () => {
	const win = new BrowserWindow({
		frame: false,
		width: 400,
		height: 400
	})
	win.loadFile('./memo.html')
})
