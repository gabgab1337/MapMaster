import { io } from 'socket.io-client';

const socket = io('https://mapmasteronline.vercel.app'); // Replace with your actual backend URL

export default socket;