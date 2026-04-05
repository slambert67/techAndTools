/*export interface ApplicationState {
    untransformedPayload: any[];
}*/

export interface Transformation {
    user: any,
    accounts: any[],
    portfolioSummary: any,
    alerts: any[]
}

export interface ApplicationState {
    untransformedPayload: any[],
    userSummary: any[],
    transformedPayload: Transformation[],
    selectedUser: any
}
