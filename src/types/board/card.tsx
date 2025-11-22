type checklist = {
    label: string
    checked: boolean
}

export type CardType = {
    _id: string
    label: string
    status?: boolean
    columnId: string
    cover?: string
    description?: string
    attachments?:string
    checklist:checklist[]
    FE_placeholderCard?: boolean
}