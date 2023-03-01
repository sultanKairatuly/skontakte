export type UserDB = {
    name: string,
    email: string,
    photoURL: string,
    comments: object,
    id: string
}

export type profileListItem = {
    icon: string;
    title: string;
    action: (...args: any[]) => any;
    id: string;
};

export type sidebarItem = Omit<profileListItem, 'action'> & { route: string }


export type User = {
    name: string,
    email: string,
    password: string,
    photoURL: string,
}