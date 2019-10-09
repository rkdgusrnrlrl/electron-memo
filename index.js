/* eslint-disable indent */
const {app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain} = require('electron')
const Dropbox = require('dropbox').Dropbox
const dbx = new Dropbox({
	accessToken: '--',
	fetch: require('isomorphic-fetch')
})

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

async function getNoteList () {
	try {
		const res = await dbx.filesListFolder({ path: '' })
		if (hasOwnProperty.call(res, 'entries')) {
			const ll = res.entries
			for (let i = 0; i < ll.length; i++) {
				console.log(ll[i].name)
			}
		}
	} catch (e) {
		console.error(e)
	}
}

function showMain () {
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
	newWin.loadFile('./main.html')
	// open devtool
	// newWin.webContents.openDevTools()
}

let data = []
let trayIcon = null

async function saveNote (memo) {
	const ii = data.findIndex((el) => {
		return el.id === memo.id
	})
	data[ii] = memo
	await dbx.filesUpload({path: `/${memo.id}`, contents: memo.memo, mode: 'overwrite'})
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
		},
		{
			label: 'main',
			click: showMain
		}
	])

	trayIcon.setContextMenu(contextMenu)

	data = getNoteList()

	globalShortcut.register('Control+Shift+n', () => {
		newNote()
	})
})
