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
	// newWin.webContents.openDevTools()
}

const data = []
let trayIcon = null

async function saveNote (memo) {
	const ii = data.findIndex((el) => {
		return el.id === memo.id
	})
	data[ii] = memo
	await dbx.filesUpload({ path: `/${memo.id}`, contents: memo.memo, mode: 'overwrite' })
		.then((response) => {
			console.log(response)
		})
		.catch((error) => {
			console.log(error.error.error)
		})
}

ipcMain.on('save-memo', async (e, arg) => {
	await saveNote(arg)
	console.log(data)
})

app.on('ready', () => {
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
