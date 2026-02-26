#!/usr/bin/env python3
import time, json
from urllib import request, parse

# Simple Telegram poller that mirrors incoming messages to a local inbox file
# and supports session start/end triggers.

TOKEN=open('./secrets/telegram_bot_token.txt').read().strip()
API=f'https://api.telegram.org/bot{TOKEN}'
last_update_id=None
INBOX_PATH='./inbox/telegram_inbox.jsonl'
SESSION_STATE_PATH='./inbox/telegram_session.json'

START_TRIGGER='/assistir'
END_TRIGGER='/fim'

def get(url, params=None, timeout=60):
    if params:
        url = url + '?' + parse.urlencode(params)
    with request.urlopen(url, timeout=timeout) as r:
        return json.loads(r.read().decode())

def post_json(url, payload):
    data = json.dumps(payload).encode()
    req = request.Request(url, data=data, headers={'Content-Type':'application/json'})
    with request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())

def append_inbox(item):
    try:
        open('./inbox','a').close()
    except Exception:
        pass
    with open(INBOX_PATH, 'a', encoding='utf-8') as f:
        f.write(json.dumps(item, ensure_ascii=False) + '\n')

def write_session(state):
    with open(SESSION_STATE_PATH, 'w', encoding='utf-8') as f:
        json.dump(state, f)

# load session
try:
    s = json.load(open(SESSION_STATE_PATH))
except Exception:
    s = {'active': False, 'chat_id': None}

print('Starting Telegram polling (mirror-only mode)...')
while True:
    try:
        params={'timeout':60}
        if last_update_id is not None:
            params['offset']=last_update_id+1
        data = get(API + '/getUpdates', params=params, timeout=65)
        if not data.get('ok'):
            time.sleep(5)
            continue
        for upd in data.get('result', []):
            last_update_id = upd['update_id']
            msg = upd.get('message') or upd.get('edited_message')
            if not msg:
                continue
            chat = msg['chat']
            text = msg.get('text','')
            sender = (chat.get('first_name','') + ' ' + (chat.get('last_name') or '')).strip()
            item = {'chat_id': chat['id'], 'sender': sender, 'text': text, 'date': msg.get('date')}
            append_inbox(item)
            print('Mirrored:', item)

            # handle triggers
            if text and text.strip() == START_TRIGGER:
                s['active']=True
                s['chat_id']=chat['id']
                write_session(s)
                # notify user that session is active
                try:
                    post_json(API + '/sendMessage', {'chat_id': chat['id'], 'text': 'Sessão iniciada com o agente. Agora você pode conversar e eu responderei quando acionado da sessão web.'})
                except Exception as e:
                    print('Notify error', e)
            elif text and text.strip() == END_TRIGGER:
                if s.get('chat_id')==chat['id']:
                    s['active']=False
                    s['chat_id']=None
                    write_session(s)
                    try:
                        post_json(API + '/sendMessage', {'chat_id': chat['id'], 'text': 'Sessão encerrada. As mensagens agora serão apenas espelhadas.'})
                    except Exception as e:
                        print('Notify error', e)

        time.sleep(0.5)
    except Exception as e:
        print('Error', e)
        time.sleep(5)
