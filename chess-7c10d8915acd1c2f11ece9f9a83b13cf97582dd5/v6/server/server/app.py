from mimetypes import MimeTypes
from server.webserver import *

@register(route='/', type=MIME_TYPE.HTML)
def mainpage():
    return load_file('/content/index.html')

@register(route='/style.css', type=MIME_TYPE.CSS)
def main_style():
    return load_file('/content/style.css')

@register(route='/chess.js', type=MIME_TYPE.JAVA_SCRIPT)
def chess_script():
    return load_file('/content/chess.js')

@register(route='/chess.css', type=MIME_TYPE.CSS)
def chess_style():
    return load_file('/content/chess.css')

@post_handler(route='/search',type=MIME_TYPE.HTML)
def game(args):
    print(args)
    return load_file('/content/chess.html')

    
start()
