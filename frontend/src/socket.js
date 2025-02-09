import { io } from 'socket.io-client';

const socket = io('http://localhost:5555'); // Connect to the local backend

export default socket;