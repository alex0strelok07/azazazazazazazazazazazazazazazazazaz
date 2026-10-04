"""Панель № 7: запускает локальную визуальную новеллу без внешних зависимостей."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os, threading, webbrowser

ROOT = Path(__file__).resolve().parent
# Дополнения игры. Подключаются к index.html при запуске, в этом порядке.
# game2/game2b — кухня, коридор, инвентарь, деньги; game3/game3b — город, нападения, взаимодействия.
# game4* — единый стиль сцен, чибики NPC, иллюстрации действий и нападений, отображение персонажей,
# отношения/квесты/журнал/сохранение, новые локации и случайные события.
# game5* — группа персонажей, совместное передвижение, анимации, лужа, улица без машины;
# game5b/game5c — диалоги в стиле референса (крупные персонажи, эмоции, подсветка говорящего);
# game5e/game5e2 — единый живописный стиль всех персонажей, 15 эмоций, смена выражения, PNG из chars/;
# game5d — раздельные и совместные взаимодействия, анимации реакций, предметы и характер NPC;
# game5f/game5f2 — память NPC (разговоры, помощь, отказы, предметы, квесты) и живые случайные события;
# game5g/game5g2/game5g3 — 22 новых интерактивных предмета с отдельными реакциями Жени, Кирилла и обоих;
# game5h — единая система персонажей (одна модель в мире, диалогах, действиях, сценах, нападениях),
#          прозрачные чибики без белого фона и ореола;
# game5h2 — единая система коллизий: невидимые области отдельно от графики, учёт обоих персонажей;
# game5i — иллюстрации нападений на тех же моделях и плавные переходы между локациями.
# game6a — экран 16+, главное меню и настройки, 3 слота сохранения, музыка (7 тем, одна за раз, плавная смена), звуки;
# game6b_ev/game6b — в диалоге только присутствующие, двор без машины, лужа по составу группы,
#          сюжет из 6 глав с выборами и 4 концовки, журнал (J).
EXTRA = ['game2.js', 'game2b.js', 'game3.js', 'game3b.js',
         'game4.js', 'game4i.js', 'game4a.js', 'game4s.js', 'game4b.js',
         'game4c.js', 'game4c2.js', 'game4d.js', 'game4d2.js', 'game4d3.js',
         'game5.js', 'game5b.js', 'game5e.js', 'game5e2.js', 'game5c.js', 'game5d.js',
         'game5f.js', 'game5f2.js', 'game5g.js', 'game5g2.js', 'game5g3.js',
         'game5h.js', 'game5h2.js', 'game5i.js',
         'game6a.js', 'game6b_ev.js', 'game6b.js']

class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(ROOT),**kwargs)
    def log_message(self,fmt,*args): pass
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()
    def do_GET(self):
        if self.path.split('?')[0] in ('/', '/index.html'):
            html=(ROOT/'index.html').read_text(encoding='utf-8')
            tags=''.join(f'<script src="{n}"></script>' for n in EXTRA if (ROOT/n).exists() and n not in html)
            html=html.replace('</body>',tags+'</body>',1) if '</body>' in html else html+tags
            data=html.encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type','text/html; charset=utf-8')
            self.send_header('Content-Length',str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        super().do_GET()

if __name__ == '__main__':
    os.chdir(ROOT)
    server = ThreadingHTTPServer(('127.0.0.1',0),Handler)
    url=f'http://127.0.0.1:{server.server_port}/index.html'
    print('Панель № 7 запущена:',url)
    print('Для выхода нажмите Ctrl+C')
    threading.Timer(.5,lambda:webbrowser.open(url)).start()
    try: server.serve_forever()
    except KeyboardInterrupt: print('\nДо встречи.')
