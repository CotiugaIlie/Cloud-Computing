import json
import requests
import flask
from flask import jsonify
import sqlite3
from sqlite3 import Error
import asyncio
from concurrent.futures import ThreadPoolExecutor


def request(session, url, params, table, headers, id):
    if  headers=="":
        with session.get(url=url, params=params) as data:
            conn = sqlite3.connect('db/tema1.db')
            status = data.status_code
            elapsed = data.elapsed
            try:
                cur = conn.cursor()
                insert = "insert into "+table+" values(?, ?, ?, ?, ?, ?);"
                task = (id, str(data.url), int(status), str(elapsed), str(data.request), str(data.text))
                cur.execute(insert, task)
                conn.commit()
            except Error as e:
                print(e)
            conn.close()
            return data
    else:
        with session.get(url=url, params=params, headers=headers) as data:
            conn = sqlite3.connect('db/tema1.db')
            status = data.status_code
            elapsed = data.elapsed
            try:
                cur = conn.cursor()
                insert = "insert into "+table+" values(?, ?, ?, ?, ?, ?);"
                task = (id, str(data.url), int(status), str(elapsed), str(data.request), str(data.text))
                cur.execute(insert, task)
                conn.commit()
            except Error as e:
                print(e)
            conn.close()
            return data


async def start_async_process(url, params, table, headers):
    with ThreadPoolExecutor(max_workers=50) as executor:
        with requests.Session() as session:
            loop = asyncio.get_event_loop()
            tasks = [
                loop.run_in_executor(
                    executor,
                    request,
                    *(session ,url, params, table, headers, id)
                )
                for id in range(500)
            ]
            for response in await asyncio.gather(*tasks):
                pass



app = flask.Flask(__name__)
app.config["DEBUG"] = True
conn = None
try:
    conn = sqlite3.connect('db/tema1.db')
    print(sqlite3.version)
    c = conn.cursor()
    delvar1 = """DROP TABLE IF EXISTS var1;"""
    c.execute(delvar1)
    var1 = """ CREATE TABLE IF NOT EXISTS var1 (
                                            id integer PRIMARY KEY ,
                                            url text,
                                            status_code integer,
                                            elapsed str,
                                            request text,
                                            response text
                                        ); """

    c.execute(var1)
    delvar2 = """DROP TABLE IF EXISTS var2;"""
    c.execute(delvar2)
    var2 = """ CREATE TABLE IF NOT EXISTS var2 (
                                                id integer PRIMARY KEY ,
                                                url text,
                                                status_code integer,
                                                elapsed str,
                                                request text,
                                                response text
                                            ); """

    c.execute(var2)
    delvar3 = """DROP TABLE IF EXISTS var3;"""
    c.execute(delvar3)
    var3 = """ CREATE TABLE IF NOT EXISTS var3 (
                                                    id integer PRIMARY KEY ,
                                                    url text,
                                                    status_code integer,
                                                    elapsed str,
                                                    request text,
                                                    response text
                                                ); """

    c.execute(var3)
except Error as e:
    print(e)
finally:
    if conn:
        conn.close()


@app.route('/', methods=['GET'])
def home():
    return '''<h1>Home</h1> <p>Test prototype</p>'''


@app.route('/var1', methods=['GET'])
def api_var1():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    future = asyncio.ensure_future(start_async_process(url="https://api.agify.io/", params={"name": "Alex"}, table="var1", headers=""))
    loop.run_until_complete(future)
    conn = sqlite3.connect('db/tema1.db')
    if conn:
        cur = conn.cursor()
        var1 = cur.execute('SELECT * FROM var1;').fetchall()
        return jsonify(var1)







@app.route('/var2', methods=['GET'])
def api_var2():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    future = asyncio.ensure_future(start_async_process(url="http://www.splashbase.co/api/v1/images/random", params="", table="var2", headers=""))
    loop.run_until_complete(future)
    conn = sqlite3.connect('db/tema1.db')
    if conn:
        cur = conn.cursor()
        var1 = cur.execute('SELECT * FROM var2;').fetchall()
        return jsonify(var1)



@app.route('/var3', methods=['GET'])
def api_var3():
    querystring = {"meme": "Condescending-Wonka", "bottom": "", "top": "", "font_size": "50",
                   "font": "Impact"}
    conn = sqlite3.connect('db/tema1.db')
    if conn:
        cur = conn.cursor()
        var1 = cur.execute('SELECT response FROM var1 where id=20;').fetchall()
        querystring["top"] = str(var1)
        var2 = cur.execute('SELECT response FROM var2 where id=20;').fetchall()
        querystring["bottom"] = str(var2)


    with open('config.json', 'r') as f:
        headers = json.load(f)
    url = "https://ronreiter-meme-generator.p.rapidapi.com/meme"
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    future = asyncio.ensure_future(start_async_process(url=url, params=querystring, table="var3", headers=headers))
    loop.run_until_complete(future)


    if conn:
        cur = conn.cursor()
        var3 = cur.execute('SELECT * FROM var3;').fetchall()
        return jsonify(var3)



app.run()
