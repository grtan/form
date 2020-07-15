declare module 'big.js'
declare module 'qs'

// 获取promise或者async函数返回值的实际数据类型
type Unwrap<T> = T extends Promise<infer U> ? U :
  T extends (...args: any) => Promise<infer U> ? U :
    T extends (...args: any) => infer U ? U :
      T

// 获取重载函数的返回值类型
type OverloadReturnType<T> =
    T extends { (...args: any[]): infer R, (...args: any[]): infer R, (...args: any[]): infer R, (...args: any[]): infer R } ? R :
      T extends { (...args: any[]): infer R, (...args: any[]): infer R, (...args: any[]): infer R } ? R :
        T extends { (...args: any[]): infer R, (...args: any[]): infer R } ? R :
          T extends (...args: any[]) => infer R ? R : any

// 获取泛型的类型
type GenericType<T, S> = T extends S<infer R> ? R : never
