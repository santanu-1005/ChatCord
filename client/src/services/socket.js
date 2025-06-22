import {io} from 'socket.io-client';
import { HOST } from '../utils/constants';

const socket = io(HOST, {
    withCredentials: true,
    autoConnect: false,
});

export default socket;