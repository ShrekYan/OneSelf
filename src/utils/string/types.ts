/**
 * 去除字符串两端的空白字符
 */
export type Trim<T extends string> = T extends ` ${infer U}`
  ? Trim<U>
  : T extends `${infer U} `
    ? Trim<U>
    : T;

/**
 * 首字母大写
 */
export type Capitalize<T extends string> =
  T extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : T;

/**
 * 首字母小写
 */
export type Uncapitalize<T extends string> =
  T extends `${infer First}${infer Rest}` ? `${Lowercase<First>}${Rest}` : T;

/**
 * 判断是否为字符串字面量类型
 */
export type IsStringLiteral<T> = T extends string
  ? string extends T
    ? false
    : true
  : false;
