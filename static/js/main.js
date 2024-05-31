const socket = io();
let currentRoom = null;

socket.on('show_alert', (errMsg) => {
    alert(errMsg);
});

socket.on('message', (roomMsg) => {
    let msg = document.createElement('li')
    msg.className = 'list-group-item'
    msg.innerHTML = roomMsg
    let msgs = document.getElementById('messages')
    msgs.append(msg)
})

socket.on('room_created', (room) => {
    let roomsList = document.getElementById('rooms');
    let lst = document.createElement('li');
    lst.className = 'list-group-item';
    lst.appendChild(document.createTextNode(room));
    roomsList.appendChild(lst);
    currentRoom = room;  
});

socket.on('update_rooms', (rooms) => {
    let roomsList = document.getElementById('rooms');
    roomsList.innerHTML = '';
    rooms.forEach(function (room) {
        let lst = document.createElement('li');
        lst.className = 'list-group-item';
        lst.appendChild(document.createTextNode(room));
        roomsList.appendChild(lst);
    });
});

function createRoom() {
    let username = document.getElementById('username').value;
    let room = document.getElementById('room').value;
    if (username && room) {
        socket.emit('create_room', { username: username, room: room });
        document.getElementById('username').readOnly = true;
    } else {
        alert('To create a room, please enter Your Name & Room Name');
    }
}

function joinRoom() {
    let username = document.getElementById('username').value;
    let room = document.getElementById('join-room').value;
    if (username && room) {
        socket.emit('join', { username: username, room: room });
        currentRoom = room;
        document.getElementById('username').readOnly = true;
    } else {
        alert('To to join a room, please enter Your Name & Available Room');
    }
}