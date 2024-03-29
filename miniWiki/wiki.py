import sys
import os
import codecs
import uuid

fileToSave = "index.html" 
folderCounter = 0
entryCounter = 0

def main():
	rootdir = os.getcwd()

	fullHtml = getHtml(rootdir)
	writeToFile(rootdir, fullHtml)

	print("Generation completed")

def getHtml(root):
	# Head and includes
	html = "<html>\n\n<head>\n<title>miniWiki</title>\n"
	html += "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>\n";
	html += "<link rel='stylesheet' type='text/css' href='style.css'/>\n"
	html += "<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js'></script>\n"
	html += "<script type='text/javascript' src='script.js'></script>\n"
	html += "</head>\n\n<body>\n\n"

	# Create guid for checking localstorage validity
	html += "<label id='guid' style='display:none;'>{0}</label>\n\n".format(uuid.uuid1())

	# Main title and expand buttons
	html += "<div id='titleArea'>\n<label class='mainTitleP1'>mini</label><label class='mainTitleP2'>Wiki</label>\n"
	html += "<label id='toggleSubFolders' class='smallText' action='up'>[ s ]</label>\n"
	html += "<label id='toggleAllEntries' class='smallText' action='up'>[ e ]</label>\n"
	html += "</div>\n\n"

	## Skip root folder files
	for item in os.listdir(root):
		if os.path.isfile(os.path.join(root, item)) == False:
			html += processFolder(os.path.join(root, item))

	html += "</body>\n</html>"

	return html

def processFolder(root):
	print(root)
	global folderCounter
	global entryCounter
	
	folderCounter += 1

	html = "<!-- Start of {0} -->\n\n".format(os.path.basename(root))

	html += "<div class='subFolder'>\n\n"
	html += "<div class='subFolderTitle' fId='{0}'>\n".format(str(folderCounter))
	html += "<label class='titleText hideSubFolder fId_{0}'>{1}</label>\n".format(str(folderCounter), os.path.basename(root))
	html += "<label class='minimizeEntries smallText' action='down'>[ e ]</label>\n</div>\n\n"
	html += "<div class='subFolderEntries fId_{0}'>\n\n".format(str(folderCounter))

	for item in os.listdir(root):
		if os.path.isfile(os.path.join(root, item)) == False:
			html += processFolder(os.path.join(root, item))
		else:
			print(os.path.join(root,item))
			# Show only filename in header (drop extension)
			entryCounter += 1
			name, extension = os.path.splitext(item)

			html += "<!-- Start of {0} -->\n".format(name)
			html += "<div class='entry' eId='{0}'>\n<label class='entryTitle hideEntry'>{1}</label>\n".format(str(entryCounter), name)

			with codecs.open(os.path.join(root,item), 'r', 'utf-8') as f:
				html += "<div class='entryText hidden eId_{0}'>\n".format(str(entryCounter))
				html += "<pre>\n{0}\n</pre>\n".format(f.read())
				html += "<label class='closeEntry smallText'>[ close ]</label>\n"
				html += "</div>\n</div>\n<!-- End of {0} --> \n\n".format(name)
		
	html += "</div>\n</div>\n\n"
	html += "<!-- End of {0} -->\n\n".format(os.path.basename(root))
		
	return html;

def writeToFile(folder, html):
	with codecs.open(os.path.join(folder, fileToSave), 'w', 'utf-8') as f:
		f.write(html)

if __name__=="__main__":
	main()