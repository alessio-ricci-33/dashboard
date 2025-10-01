export type Widen<T> = T extends StringConstructor
	? string
	: T extends NumberConstructor
	? number
	: T extends BooleanConstructor
	? boolean
	: T;

export type ParamsToProps<T extends typeof params> = {
	// @ts-ignore
	[K in keyof T]: Widen<T[K]['type']>;
};
