import { io } from 'socket.io-client';

const socket = io('https://disastermanagement-bzga.onrender.com');

socket.on('connect', () => console.log('Connected to WebSocket'));
socket.on('disconnect', () => console.log('Disconnected from WebSocket'));

export default socket;