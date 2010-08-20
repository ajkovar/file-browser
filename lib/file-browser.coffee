sys: require "sys"
fs: require "fs"

class FileBrowser
	constructor: (directory) ->
		@directory: directory

	eachFile: (options) ->
		directory: options.directory
		callback: options.callback
		onFile: options.onFile
		onDirectory: options.onDirectory
		onInode: options.onInode
		onFinish: options.onFinish
		recursive: options.recursive

		#total number of files that need to be checked, starts off at 1	(the directory being checked)
		totalFiles: 1
		numberChecked: 0

		readDirectory: (directory) ->

			fs.readdir directory, (err, fileNames) ->
				#directory has been checked
				numberChecked++

				if !fileNames?
					sys.puts "List of filenames for directory " + directory + " is coming back undefined."
					if numberChecked==totalFiles
						onFinish()
				else
					totalFiles+=fileNames.length
					fileNames.forEach (fileName)->
						fullPath: directory + "/" + fileName
						fs.stat fullPath, (err, stat)->
							if stat.isDirectory()
								#if they set this to true, recursively search it
								if recursive
									readDirectory fullPath
								else numberChecked++

								onDirectory fullPath if onDirectory?
								onInode fullPath if onInode?
							#otherwise count it as a file and increase the total number of files checked
							else
								#file has been checked
								numberChecked++
								if onFile?
									onFile fullPath
								if onInode?
									onInode fullPath

							if numberChecked>=totalFiles
								onFinish()

		readDirectory @directory

exports.FileBrowser = FileBrowser
