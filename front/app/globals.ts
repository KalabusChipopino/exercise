import classNames from 'classnames';

export function cn(...classes: any[]) {
  return classNames(classes);
}

export const context = {};

export function mapObj(
  obj: Record<string, any>,
  callback_val: (key: string, value: any) => any = (key, value) => value,
  callback_key: (key: string, value: any) => any = (key, value) => key,
): Record<string, any> {
  const res: any = {};
  Object.keys(obj).forEach(key => { res[callback_key(key, obj[key])] = callback_val(key, obj[key]) });
  return res;
}