export function localSync(type: string, data: any[]) {
    localStorage.setItem(type, JSON.stringify(data));
}

export function localFetch(type: string): any[] {
    const data = localStorage.getItem(type);
    return data ? JSON.parse(data) : [];
}

export function localFlush() {
    localStorage.clear();
}