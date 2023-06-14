import { ResourceMap, ResourceIdMap } from '@/commons/internalType'

const Utils = {
  install: function (Vue) {
    class Utils {
      parseFloat(val, fixed) {
        if (fixed === undefined) fixed = 2
        if (!val || isNaN(val)) return 0
        return parseFloat(parseFloat(val).toFixed(fixed))
      }
      sum(arr) {
        if (!arr || arr.length === 0) return 0
        return arr.reduce(function (prev, curr, idx, arr) {
          return prev + curr
        })
      }
    }
    Vue.prototype.$Utils = new Utils()

    Vue.prototype.$Msg = function (msg, type) {
      this.$message({
        showClose: true, // 提示信息可关闭
        message: msg,
        type: type || 'success'
      })
    }
    Vue.prototype.$Alert = function (title, msg) {
      const h = this.$createElement
      this.$notify({
        title: title,
        message: h(
          'i',
          { style: 'color: teal' }, (msg || title)// '接口异常，服务器未返回异常信息'
        )
      })
    }
    Vue.prototype.$Confirm = function (title, ok, cancel) {
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ok()
      }).catch(() => {
        cancel()
      })
    }
    // 时间戳转时间
    Vue.prototype.$FromTimestamp = function (time) {
      var date = new Date(time * 1000 + 8 * 3600 * 1000)
      return date
    }
    // 时间转时间戳
    Vue.prototype.$ToTimestamp = function (date) {
      if (!date) return 0
      return parseInt((date.getTime() / 1000) + (8 * 3600))
    }
    // 时间戳转时间字符串
    Vue.prototype.$ToTimeString = function (time) {
      var date = new Date(time * 1000 + 8 * 3600 * 1000)
      return date.toJSON().substr(0, 19).replace('T', ' ')
    }
    Vue.prototype.$ToDateString = function (time) {
      var date = new Date(time * 1000 + 8 * 3600 * 1000)
      return date.toJSON().substr(0, 10)
    }
    // 时间转日期字符串
    Vue.prototype.$DateToString = function (date) {
      if (!date) return ''
      return new Date(date.getTime() + 8 * 3600 * 1000).toJSON().substr(0, 10)
    }
    // 时间转时间字符串
    Vue.prototype.$TimeToString = function (datetime) {
      return new Date(datetime.getTime() + 8 * 3600 * 1000).substr(0, 19).replace('T', ' ')
    }
    Vue.prototype.$Mapping = function (item, srcItem) {
      if (srcItem === null || srcItem === undefined) return false
      if (typeof srcItem !== 'object' && typeof srcItem !== 'object') {
        return true
      } else if (typeof item === 'object' && typeof srcItem === 'object') {
        for (let key in item) {
          if (this.$Mapping(item[key], srcItem[key])) {
            item[key] = srcItem[key]
          }
        }
      }
      return false
    }
    /**
     * @param {*} resourceKeys 对应资源的键值
     */
    Vue.prototype.$IsResource = function (resourceKeys) {
      let resourceIdKey = ResourceMap
      resourceKeys.split('.').forEach(k => (resourceIdKey = resourceIdKey[k]))
      let storage = localStorage.getItem('userInfo')
      let resourceId = ResourceIdMap[resourceIdKey]
      return ',' + JSON.parse(storage).resource + ','.indexOf(',' + resourceId + ',') !== -1
    }
  }
}

/**
 * @param {*} src 待拷贝对象
 * @param {*} dst 需赋值对象
 * @returns 如第二参数未传则返回一个新对象
 */
export function deepClone(src, dst) {
  const _toString = Object.prototype.toString

  // null, undefined, non-object, function
  if (!src || typeof src !== 'object') {
    return src
  }

  // DOM Node
  if (src.nodeType && 'cloneNode' in src) {
    return src.cloneNode(true)
  }

  // Date
  if (_toString.call(src) === '[object Date]') {
    return new Date(src.getTime())
  }

  // RegExp
  if (_toString.call(src) === '[object RegExp]') {
    const flags = []
    if (src.global) { flags.push('g') }
    if (src.multiline) { flags.push('m') }
    if (src.ignoreCase) { flags.push('i') }

    return new RegExp(src.source, flags.join(''))
  }
  // console.log(src, dst)
  const result = dst || (Array.isArray(src) ? [] : src.constructor ? new src.constructor() : {})

  for (const key in src) {
    result[key] = dst ? deepClone(src[key], result[key]) : deepClone(src[key])
  }

  return result
}

export function clearObject(obj, key, pObj) {
  const _toString = Object.prototype.toString
  switch (_toString.call(obj)) {
    case '[object Object]':
      if (Object.keys(obj).length > 0) {
        for (let key in obj) {
          clearObject(obj[key], key, obj)
        }
      } else {
        pObj = {}
      }
      break
    case '[object Array]':
      if (key !== undefined || pObj !== undefined) {
        pObj[key] = []
      }
      break
    case '[object Number]':
    case '[object String]':
    case '[object Boolean]':
    case '[object Date]':
      if (key !== undefined || pObj !== undefined) {
        pObj[key] = ''
      }
  }
}

export default Utils
