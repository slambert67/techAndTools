export interface User {
    id: number,
    name: string
}

export interface UserDetails {
    id: string,
    name: string,
    status2:string,
    email: string,
    role: string,
    words: string[],
    lastlogin: string
}

export interface ApplicationState {
    users: User[],
    allUserDetails: UserDetails[],
    selectedUser: UserDetails | undefined,
    loading: boolean
}