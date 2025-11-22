export function generatePlaceholdeCard(column: any) {
    return {
        _id: column._id+'-placeholder-card',
        label: '',
        FE_placeholderCard: true,
        columnId: column._id,
        checklist:[]
    }
}

export function slugtify(val: string) {
    if (!val) return ''
    return val
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g,'-')
    .replace(/-+/g,'-')
}