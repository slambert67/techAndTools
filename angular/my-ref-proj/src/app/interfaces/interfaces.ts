export interface TransformedPayloadRecord {
    name: string;
    contact: string;
    accounts: string[]
}


export interface ApplicationState {
    payload: TransformedPayloadRecord[],
    notification: string | undefined
}
