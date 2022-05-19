export interface RadioHost {
    id: string,
    name: string,
    email: string,
    password?: string,
}

export interface RadioChannel {
    id: string,
    radioHostId: string,
    name: string,
}