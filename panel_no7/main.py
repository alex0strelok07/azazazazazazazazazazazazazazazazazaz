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
# game7a/game7a2 — CityState (0–3, только растёт), задания Quest_01–09, драки только по сюжету,
#          меню ПАУЗА на ESC (сохранить/загрузить/настройки/главное меню), полное сохранение, без лавки на улице;
# game7b — улица по стадиям города (мусор, повреждения, закрытые места, перекрытия, разговоры),
#          техника по маршрутам (милиция, грузовики, БТР) со звуками;
# game7c — финальная площадь у ДК: постановочная кат-сцена из 10 этапов, реплики по присутствию героев.
# game8a — единое игровое время (день/дата/месяц/часы/минуты/время суток), заставка нового дня,
#          часы в интерфейсе, магазины/двор/остановка по времени, «слишком рано»/«опоздал» для сюжетных встреч;
# game8b — журнал «Задания» (кнопка, клавиша P, пункт меню ESC), этапы ☐/☑, уведомление «НОВОЕ ЗАДАНИЕ».
# game9a — движок дней: новый день только через сон (затемнение → 08:00 → день+1 → дата/день недели),
#          единый календарь, утренняя заставка, задания по дням, провалы/автозавершение, состояние города, сохранение;
# game9b/game9b2/game9b3/game9b4 — 46 заданий (24 основных, 22 дополнительных) на 8 дней,
#          встречи по времени, решения, отношения, 5 концовок по итогам прохождения;
# game9c — журнал АКТИВНЫЕ/ВЫПОЛНЕННЫЕ/ПРОВАЛЕННЫЕ (основные и дополнительные), отдельная кнопка «Задания»,
#          которая автоматически встаёт так, чтобы не перекрывать «Инвентарь».
# game10a — единый календарь P7.CAL (дата/день недели/время везде из одного источника, без «ПЯТНИЦА — 5»),
#          QuestManager с ID quest_day_NN_… и статусами LOCKED/ACTIVE/COMPLETED/FAILED/HIDDEN для HUD и журнала;
# game10b — SceneParticipants: проверка присутствия перед каждой репликой, одиночные/совместные действия,
#          задания с требованием присутствия, сохранение состава группы и позиций.
EXTRA = ['game2.js', 'game2b.js', 'game3.js', 'game3b.js',
         'game4.js', 'game4i.js', 'game4a.js', 'game4s.js', 'game4b.js',
         'game4c.js', 'game4c2.js', 'game4d.js', 'game4d2.js', 'game4d3.js',
         'game5.js', 'game5b.js', 'game5e.js', 'game5e2.js', 'game5c.js', 'game5d.js',
         'game5f.js', 'game5f2.js', 'game5g.js', 'game5g2.js', 'game5g3.js',
         'game5h.js', 'game5h2.js', 'game5i.js',
         'game6a.js', 'game6b_ev.js', 'game6b.js',
         'game7a.js', 'game7a2.js', 'game7b.js', 'game7c.js',
         'game8a.js', 'game8b.js',
         'game9a.js', 'game9b.js', 'game9b2.js', 'game9b3.js', 'game9b4.js', 'game9c.js',
         'game10a.js', 'game10b.js']

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
