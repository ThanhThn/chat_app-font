const constant = {
    auth: {
        owner: 1,
        editor: 2,
        viewer: 3,
    },
}

type DotNotation<T> = T extends object
  ? { [K in keyof T]: `${K & string}${DotNotation<T[K]> extends never ? '' : `.${DotNotation<T[K]>}`}` }[keyof T]
  : never;

type ConstantKeys = DotNotation<typeof constant>;

const config = (key: ConstantKeys) => {
    const keys = key.split('.') as string[];
    return keys.reduce((obj: any, key: string) => obj?.[key], constant);
}

export default config;
