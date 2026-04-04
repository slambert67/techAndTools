export interface PayloadRecord {
    user: any,
    accounts: any[],
    portfolioSummary: any,
    alerts: any[]
}

export interface ApplicationState {
    payload: PayloadRecord[],
    notification: string | undefined
}
