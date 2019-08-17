import axios from 'axios';

const authApi = axios.create({
	baseURL: '/api',
});

export function login(req, res) {
	authApi.post('/login', {});
}

export function signup(req, res) {
	//implement
}
