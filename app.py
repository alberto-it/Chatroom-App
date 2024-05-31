from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit, join_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret-key'
socketio = SocketIO(app)

rooms = {}

@app.route('/')
def index():
    return render_template('join_room.html')

@socketio.on('connect')
def handle_connect():
  emit('update_rooms', list(rooms.keys()))

@socketio.on('create_room')
def handle_create_room(data):
    room = data['room']
    username = data['username']
    if room in rooms:
        emit('show_alert', "Room " + room + " already exists.")
    else:
        rooms[room] = []
        join_room(room)
        rooms[room].append(username)
        emit('room_created', room, broadcast=True)
        send(username + ' has created and joined the room ' + room, room=room)

@socketio.on('join')
def handle_join(data):
    room = data['room']
    username = data['username']
    if room in rooms:
        join_room(room)
        rooms[room].append(username)
        send(username + ' has entered the room ' + room, to=room)
        emit('update_rooms', list(rooms.keys())) 
    else:
        emit('show_alert',"Room " + room + " does not exist.")

if __name__ == "__main__": socketio.run(app, debug=True)
