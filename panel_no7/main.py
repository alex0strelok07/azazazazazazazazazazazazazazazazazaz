"""Панель № 7: запускает локальную визуальную новеллу без внешних зависимостей."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os, threading, webbrowser

ROOT = Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(ROOT),**kwargs)
    def log_message(self,fmt,*args): pass

if __name__ == '__main__':
    os.chdir(ROOT)
    server = ThreadingHTTPServer(('127.0.0.1',0),Handler)
    url=f'http://127.0.0.1:{server.server_port}/index.html'
    print('Панель № 7 запущена:',url)
    print('Для выхода нажмите Ctrl+C')
    threading.Timer(.5,lambda:webbrowser.open(url)).start()
    try: server.serve_forever()
    except KeyboardInterrupt: print('\nДо встречи.')
