import Big from 'big.js'

// schema格式
export type Schema<T extends {[prop: string]: any} = any> = {
  title: string
  type: 'object'|'array'|'string'|'number'|'boolean'|'address'|'range'
  description?: string
  readonly?: boolean
  validator?: (value: any, callback: (e?: Error) => void) => void
} & (
  // object类型才有的属性
  T extends Record<'type', 'object'> ? {
    properties: {
      [KEY in keyof T['properties']]: Schema<T['properties'][KEY]>;
    }
    // 限定为properties的属性
    required?: Array<keyof T['properties']>
    default?: {[prop: string]: any}
  } : never
) & (
  T extends Record<'type', 'array'> ? {
    items: Schema<T['items']>
    minItems?: number
    maxItems?: number
    uniqueItems?: boolean|string[]|((item: any) => string)
    default?: any[]
  } : never
) & (
  T extends Record<'type', 'string'> ? {
    format?: 'color'|'image'|'video'|'file'
    minLength?: number
    maxLength?: number
    component?: 'textarea'|'richtext'|'select'
    default?: string
  } : never
) & (
  T extends Record<'type', 'number'> ? {
    minimum?: number
    maximum?: number
    multipleOf?: number
    component?: 'select'
    default?: number
  } : never
) & (
  T extends Record<'type', 'boolean'> ? {
    component?: 'switch'
    default?: boolean
  } : never
) & (
  T extends Record<'type', 'range'> ? {
    format?: 'time'|'datetime'|'date'|'month'
    valueFormat: string
    default?: [string, string]
  } : never
) & (
  T extends Record<'type', 'address'> ? {
    format?: 'province'|'city'|'area'|'detail'
    fetcher?: (cb: (address: string[]) => void) => void
    filter?: boolean
    minLength?: number
    maxLength?: number
    component?: 'select'
    default?: [string, string?, string?, string?]
  } : never
)

/**
 * 遍历表单schema，对每一个表单项进行回调，方便用户做些处理
 * @param schema
 * @param callback
 * item为当前遍历到的某个表单项的子schema
 * path[].key为item的各级属性路径
 * path[].type为item的各级属性路径所属的数据类型
 */
export function travel (schema: Schema, callback: (itemSchema: typeof schema, props: Array<{
  prop: string
  schema: typeof schema
}>) => any) {
  type Schema = typeof schema
  let stop = false

  function iterate (schema: Schema, props: Parameters<typeof callback>[1]) {
    // 停止遍历
    if (stop) {
      return
    }

    const continueIterate = callback(schema, props)

    /**
     * 如果回调函数返回false，说明不需要再遍历任何属性
     * 返回true，只不遍历后代属性，其他属性还是会遍历
     */
    if ([true, false].includes(continueIterate)) {
      stop = !continueIterate
      return
    }

    switch (schema.type) {
      case 'object':
        Object.entries(schema.properties).forEach(([prop, schema]) => {
          iterate(schema, [...props, {
            prop,
            schema
          }])
        })

        break
      case 'array':
        iterate(schema.items, [...props, {
          prop: '', // 数组元素属性名为空
          schema
        }])
        break
    }
  }

  iterate(schema, [])
}

// 将校验schema值得到的各级属性名拼接成完整路径
function generatePath (props: Array<{
  prop: string
}>) {
  const list = []

  for (let i = 0; i < props.length; i++) {
    if (props[i].prop) {
      list.push(`.${props[i].prop}`)
    } else { // 数组元素
      break
    }
  }

  return list.join('')
}

export function validateValue (schema: Schema, value: any) {
  let result = {
    valid: true,
    path: '' // 出错的位置（属性路径）
  }

  travel(schema, (itemSchema, props) => {
    let isArrayChild = false // 是否为数组元素
    const itemPath = generatePath(props) // 当前表单项的路径（当前表单项为数组时为路径前部分）
    const itemValue = (() => {
      // 最后一个属性名为空字符串
      isArrayChild = !!props.length && !props[props.length - 1].prop

      // eslint-disable-next-line no-new-func
      return new Function('value', `return value${itemPath}`)(value)
    })()

    function fail (path = itemPath) {
      result = {
        valid: false,
        path
      }

      // 停止遍历所有属性
      return false
    }

    // 为数组元素时递归处理
    if (isArrayChild) {
      let path = ''
      const index = itemValue.findIndex((value: any) => {
        const result = validateValue(itemSchema, value)

        path = result.path

        return !result.valid
      })

      // 如果数组元素中存在非法的值
      if (index !== -1) {
        return fail(`${itemPath}[${index}]${path}`)
      }

      // 停止遍历数组元素的后代属性
      return true
    }

    // 自定义校验函数
    if (typeof itemSchema.validator === 'function') {
      let error: any

      itemSchema.validator(itemValue && JSON.parse(JSON.stringify(itemValue)), (e) => {
        error = e
      })

      if (error instanceof Error) {
        return fail()
      }
    }

    // 为undefined时默认校验通过，json schema就是这样处理的
    if (itemValue === undefined) {
      // 停止遍历后代属性
      return true
    }

    try {
      switch (itemSchema.type) {
        case 'object':
          if (Object.prototype.toString.call(itemValue) !== '[object Object]') {
            return fail()
          }

          // required属性为undefined
          if ((itemSchema.required instanceof Array) && itemSchema.required.findIndex(key => {
            return itemValue[key] === undefined
          }) !== -1) {
            return fail()
          }

          break
        case 'array':
          if (!(itemValue instanceof Array)) {
            return fail()
          }

          if (Number.isInteger(itemSchema.minItems!) && itemSchema.minItems! > 0) {
            if (itemValue.length < itemSchema.minItems!) {
              return fail()
            }
          }

          if (Number.isInteger(itemSchema.maxItems!) && itemSchema.maxItems! >= 0) {
            if (itemValue.length > itemSchema.maxItems!) {
              return fail()
            }
          }

          if (itemSchema.uniqueItems) {
            const list: any[] = []
            let keyGenerator: any

            switch (true) {
              case itemSchema.uniqueItems instanceof Array:
                keyGenerator = function (value: any) {
                  const key: any[] = []

                  ;(itemSchema.uniqueItems as string[]).forEach(function (name) {
                    key.push(value[name])
                  })

                  return JSON.stringify(key)
                }
                break
              case typeof itemSchema.uniqueItems === 'function':
                keyGenerator = function (value: any) {
                  return (itemSchema.uniqueItems as (item: any) => string)(value)
                }
                break
              default:
                keyGenerator = function (value: any) {
                  return JSON.stringify(value)
                }
                break
            }

            if (itemValue.some(function (value: any) {
              const key = keyGenerator(value)
              const exist = list.includes(key)

              list.push(key)

              return exist
            })) {
              return fail()
            }
          }

          break
        case 'string':
          if (typeof itemValue !== 'string') {
            return fail()
          }

          if (Number.isInteger(itemSchema.minLength!) && itemSchema.minLength! > 0) {
            if (itemValue.length < itemSchema.minLength!) {
              return fail()
            }
          }

          if (Number.isInteger(itemSchema.maxLength!) && itemSchema.maxLength! >= 0) {
            if (itemValue.length > itemSchema.maxLength!) {
              return fail()
            }
          }

          break
        case 'number':
          if (typeof itemValue !== 'number') {
            return fail()
          }

          if (typeof itemSchema.minimum === 'number' && itemValue < itemSchema.minimum) {
            return fail()
          }

          if (typeof itemSchema.maximum === 'number' && itemValue > itemSchema.maximum) {
            return fail()
          }

          if (typeof itemSchema.multipleOf === 'number' && new Big(itemValue).mod(itemSchema.multipleOf).toString() !== '0') {
            return fail()
          }

          break
        case 'boolean':
          if (typeof itemValue !== 'boolean') {
            return fail()
          }

          break
        case 'range':
          if (!(itemValue instanceof Array) || itemValue.length !== 2) {
            return fail()
          }

          break
        case 'address':
          enum FormatLength {
            province = 1,
            city,
            area,
            detail
          }

          if (!(itemValue instanceof Array)) {
            return fail()
          }

          // 数组长度与format不匹配
          if (itemValue.length !== FormatLength[itemSchema.format ?? 'detail']) {
            return fail()
          }

          if (itemValue.findIndex(function (item, index) {
            // 非字符串或者省市区为空
            return typeof item !== 'string' || (!item && index < FormatLength.detail - 1)
          }) !== -1) {
            return fail()
          }

          // 地址详情长度不符
          if ((itemSchema.format ?? 'detail') === 'detail') {
            if (Number.isInteger(itemSchema.minLength!) && itemSchema.minLength! > 0) {
              if (itemValue[3].length < itemSchema.minLength!) {
                return fail()
              }
            }

            if (Number.isInteger(itemSchema.maxLength!) && itemSchema.maxLength! >= 0) {
              if (itemValue[3].length > itemSchema.maxLength!) {
                return fail()
              }
            }
          }

          break
      }
    } catch (e) {
      return fail()
    }
  })

  return result
}
