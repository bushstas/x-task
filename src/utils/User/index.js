let project = null,
	user = null,
	projects = [],
	rights = [];

export const set = (data) => {
	const {
		user: u,
		rights: r,
		project: p
	} = data;
	if (u instanceof Object) {
		user = u;
	}
	if (r instanceof Object) {
		rights = r;
	}
	if (p instanceof Object) {
		project = p;
	}
}

export const isAuthorized = () => {
	return user instanceof Object;
}

export const isCurrentUser = (u) => {
	const userToken = getToken();
	if (userToken) {
		if (typeof u == 'string') {
			return u == userToken;
		} else if (u instanceof Object && u.token) {
			return u.token == userToken;
		}
	}
}

export const getToken = () => {
	if (isAuthorized()) {
		return user.token;
	}
} 

export const hasRight = (code) => {
	return rights.indexOf(code) > -1;
}

export const isAdmin = () => {
	return isAuthorized() && user.role == 'admin';
}

export const isHead = () => {
	return isAuthorized() && user.role == 'head';
}

export const isAdminLike = () => {
	return isAdmin() || isHead();
}

export const getData = () => {
	return user;
}

export const isCurrentProject = (token) => {
	return project instanceof Object && token == project.token;
}

export const inProject = (token) => {
	return isAdminLike() || projects.indexOf(token) > -1;
}

export const getRole = () => {
	return user.role;
}

export const getRoleId = () => {
	return user.role_id;
}

export const getProjectName = () => {
	return project instanceof Object ? project.name : '';
}

export const getProjectColor = () => {
	return project instanceof Object ? project.color : '';
}