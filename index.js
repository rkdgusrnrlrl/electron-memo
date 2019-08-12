/* eslint-disable indent */
const { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain } = require('electron')
const Dropbox = require('dropbox').Dropbox
const dbx = new Dropbox({ accessToken: 'accessToken', fetch: require('isomorphic-fetch') })

// hot loader config
require('electron-reload')(__dirname)

function newNote () {
	const newWin = new BrowserWindow({
		width: 400,
		height: 400,
		webPreferences: {
			nodeIntegration: true,
			backgroundThrottling: false
		}
	})
	const lastId = newWin.id
	data.push({
		id: lastId,
		memo: ''
	})
	newWin.setMenu(null)
	newWin.loadFile('./memo.html')
	// open devtool
	newWin.webContents.openDevTools()
}

const data = []
let trayIcon = null

ipcMain.on('save-memo', (e, arg) => {
	const ii = data.findIndex((el) => {
		return el.id === arg.id
	})
	data[ii] = arg
	dbx.filesUpload({ path: '/note', contents: arg.memo })
		.then((response) => {
			console.log(response)
		})
		.catch((error) => {
			console.error(error)
		})
	console.log(data)
})

app.on('ready', () => {
	// newNote()

	trayIcon = new Tray('sticky-note.png')

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
})
