interface ClassnamesOptions {
    [index: string]: boolean;
}

export function classnames(options: ClassnamesOptions): string {
    const list = Object.entries(options).map(([key, value]) => (value ? key : ""));

    return list.join(" ");
}

export function detectMobile() {
    const agent = window.navigator.userAgent;
    return /(Android|iPhone|iPad)/i.test(agent);
}
