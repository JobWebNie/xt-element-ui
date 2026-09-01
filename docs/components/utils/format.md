## 格式化工具函数

## 概述

提供常用的数据格式化工具函数，包括数字格式化、日期格式化、金额格式化等。

## 数字安全转换

### toSafeNumber(value, fallback)

将任意值安全转换为数字，空值 / `Infinity` / `NaN` 等非法值一律返回 `fallback`。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `value` | Any | 是 | 待转换的值 |
| `fallback` | Number | 否 | 转换失败时的兜底值，默认 `0` |

```vue
<template>
  <div>
    <XtText>{{ toSafeNumber('123.45') }}</XtText>
    <XtText>{{ toSafeNumber(null, -1) }}</XtText>
    <XtText>{{ toSafeNumber('abc') }}</XtText>
  </div>
</template>

<script>
import { toSafeNumber } from 'xt-element-ui'

export default {
  methods: {
    toSafeNumber
  }
}
</script>
```

**转换规则**：

| 输入 | 输出 |
|------|------|
| `'123.45'` | `123.45` |
| `null` / `undefined` / `''` | `fallback`（默认 `0`） |
| `Infinity` / `-Infinity` | `fallback`（默认 `0`） |
| `'abc'`（非数字字符串） | `fallback`（默认 `0`） |

## 数字格式化

### formatNumber(value, options)

通用数字格式化函数。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `value` | Number / String | 是 | 要格式化的数字 |
| `options` | Object | 否 | 格式化选项 |

**options 参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `decimals` | Number | 2 | 小数位数 |
| `thousand` | Boolean | true | 是否千分位分隔 |
| `prefix` | String | '' | 前缀 |
| `suffix` | String | '' | 后缀 |
| `showSign` | Boolean | false | 正数是否显示正号 |

```vue
<template>
  <div>
    <XtText>{{ formatNumber(12345.6789) }}</XtText>
    <XtText>{{ formatNumber(12345.6789, { decimals: 0 }) }}</XtText>
    <XtText>{{ formatNumber(0.1234, { suffix: '%', decimals: 1 }) }}</XtText>
  </div>
</template>

<script>
import { formatNumber } from 'xt-element-ui'

export default {
  methods: {
    formatNumber
  }
}
</script>
```

### formatThousand(value, decimals)

千分位格式化，简化版的 formatNumber。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `value` | Number / String | 是 | 要格式化的数字 |
| `decimals` | Number | 否 | 小数位数，默认 2 |

```vue
<template>
  <div>
    <XtText>{{ formatThousand(1234567.89) }}</XtText>
    <XtText>{{ formatThousand(1234567.89, 0) }}</XtText>
  </div>
</template>

<script>
import { formatThousand } from 'xt-element-ui'

export default {
  methods: {
    formatThousand
  }
}
</script>
```

### formatPercent(value, decimals)

百分比格式化，自动将小数转换为百分比。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `value` | Number / String | 是 | 要格式化的数字（小数形式） |
| `decimals` | Number | 否 | 小数位数，默认 2 |

```vue
<template>
  <div>
    <XtText>{{ formatPercent(0.1234) }}</XtText>
    <XtText>{{ formatPercent(0.5, 1) }}</XtText>
  </div>
</template>

<script>
import { formatPercent } from 'xt-element-ui'

export default {
  methods: {
    formatPercent
  }
}
</script>
```

## 日期格式化

### formatDate(date, format)

日期格式化函数，支持多种格式。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `date` | Date / Number / String | 是 | 日期对象、时间戳、日期字符串 |
| `format` | String | 否 | 格式字符串，默认 `yyyy-MM-dd` |

**格式占位符**：

| 占位符 | 说明 | 示例 |
|--------|------|------|
| `yyyy` | 4位年份 | 2026 |
| `MM` | 2位月份 | 07 |
| `M` | 1位月份 | 7 |
| `dd` | 2位日期 | 08 |
| `d` | 1位日期 | 8 |
| `HH` | 24小时制（2位） | 14 |
| `H` | 24小时制（1位） | 14 |
| `hh` | 12小时制（2位） | 02 |
| `h` | 12小时制（1位） | 2 |
| `mm` | 分钟（2位） | 30 |
| `m` | 分钟（1位） | 30 |
| `ss` | 秒（2位） | 45 |
| `s` | 秒（1位） | 45 |
| `w` | 星期几（简写） | 一 |
| `W` | 星期几（完整） | 星期一 |

```vue
<template>
  <div>
    <XtText>{{ formatDate(new Date()) }}</XtText>
    <XtText>{{ formatDate(new Date(), 'yyyy年MM月dd日') }}</XtText>
    <XtText>{{ formatDate(new Date(), 'MM-dd HH:mm') }}</XtText>
    <XtText>{{ formatDate(new Date(), 'yyyy-MM-dd W') }}</XtText>
  </div>
</template>

<script>
import { formatDate } from 'xt-element-ui'

export default {
  methods: {
    formatDate
  }
}
</script>
```

### formatDateTime(date, format)

日期时间格式化，默认格式为 `yyyy-MM-dd HH:mm:ss`。

```vue
<template>
  <div>
    <XtText>{{ formatDateTime(new Date()) }}</XtText>
    <XtText>{{ formatDateTime(new Date(), 'yyyy/MM/dd HH:mm') }}</XtText>
  </div>
</template>

<script>
import { formatDateTime } from 'xt-element-ui'

export default {
  methods: {
    formatDateTime
  }
}
</script>
```

### formatTime(date, format)

时间格式化，默认格式为 `HH:mm:ss`。

```vue
<template>
  <div>
    <XtText>{{ formatTime(new Date()) }}</XtText>
    <XtText>{{ formatTime(new Date(), 'HH:mm') }}</XtText>
  </div>
</template>

<script>
import { formatTime } from 'xt-element-ui'

export default {
  methods: {
    formatTime
  }
}
</script>
```

### formatRelativeTime(date)

相对时间格式化，返回"几分钟前"、"几小时前"等格式。

```vue
<template>
  <div>
    <XtText>{{ formatRelativeTime(Date.now() - 3600000) }}</XtText>
    <XtText>{{ formatRelativeTime(Date.now() - 86400000) }}</XtText>
    <XtText>{{ formatRelativeTime(Date.now() - 604800000) }}</XtText>
  </div>
</template>

<script>
import { formatRelativeTime } from 'xt-element-ui'

export default {
  methods: {
    formatRelativeTime
  }
}
</script>
```

**相对时间对照表**：

| 时间范围 | 显示格式 |
|----------|----------|
| < 1分钟 | 刚刚 |
| < 1小时 | X分钟前 |
| < 1天 | X小时前 |
| < 1周 | X天前 |
| < 1月 | X周前 |
| < 1年 | X个月前 |
| >= 1年 | X年前 |

## 金额格式化

### formatMoney(value, options)

通用金额格式化函数。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `value` | Number / String | 是 | 金额数字 |
| `options` | Object | 否 | 格式化选项 |

**options 参数**：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `currency` | String | 'CNY' | 货币类型 |
| `decimals` | Number | 2 | 小数位数 |
| `prefix` | String | '' | 前缀 |
| `suffix` | String | '' | 后缀 |
| `showSign` | Boolean | false | 正数是否显示正号 |

**支持的货币类型**：

| 货币 | 符号 | 说明 |
|------|------|------|
| CNY | ¥ | 人民币 |
| USD | $ | 美元 |
| EUR | € | 欧元 |
| JPY | ¥ | 日元 |
| GBP | £ | 英镑 |
| AUD | A$ | 澳元 |
| CAD | C$ | 加元 |

```vue
<template>
  <div>
    <XtText>{{ formatMoney(12345.67) }}</XtText>
    <XtText>{{ formatMoney(12345.67, { currency: 'USD' }) }}</XtText>
    <XtText>{{ formatMoney(12345.67, { currency: 'EUR', decimals: 0 }) }}</XtText>
  </div>
</template>

<script>
import { formatMoney } from 'xt-element-ui'

export default {
  methods: {
    formatMoney
  }
}
</script>
```

### formatCNY(value, decimals)

人民币格式化，简化版的 formatMoney。

```vue
<template>
  <div>
    <XtText>{{ formatCNY(12345.67) }}</XtText>
    <XtText>{{ formatCNY(12345.67, 0) }}</XtText>
  </div>
</template>

<script>
import { formatCNY } from 'xt-element-ui'

export default {
  methods: {
    formatCNY
  }
}
</script>
```

### formatUSD(value, decimals)

美元格式化，简化版的 formatMoney。

```vue
<template>
  <div>
    <XtText>{{ formatUSD(12345.67) }}</XtText>
    <XtText>{{ formatUSD(12345.67, 0) }}</XtText>
  </div>
</template>

<script>
import { formatUSD } from 'xt-element-ui'

export default {
  methods: {
    formatUSD
  }
}
</script>
```

## 文件大小格式化

### formatFileSize(bytes)

文件大小格式化，自动转换单位。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `bytes` | Number / String | 是 | 文件字节数 |

```vue
<template>
  <div>
    <XtText>{{ formatFileSize(1024) }}</XtText>
    <XtText>{{ formatFileSize(1024 * 1024) }}</XtText>
    <XtText>{{ formatFileSize(1024 * 1024 * 1024) }}</XtText>
  </div>
</template>

<script>
import { formatFileSize } from 'xt-element-ui'

export default {
  methods: {
    formatFileSize
  }
}
</script>
```

**单位对照表**：

| 范围 | 单位 |
|------|------|
| < 1KB | B |
| < 1MB | KB |
| < 1GB | MB |
| < 1TB | GB |
| >= 1TB | TB |

## 综合示例

```vue
<template>
  <XtCard>
    <XtCardItem title="数字格式化">
      <XtFlexBox>
        <XtText>千分位：{{ formatThousand(1234567.89) }}</XtText>
        <XtText>百分比：{{ formatPercent(0.75) }}</XtText>
      </XtFlexBox>
    </XtCardItem>
    
    <XtCardItem title="日期格式化">
      <XtFlexBox>
        <XtText>日期：{{ formatDate(new Date()) }}</XtText>
        <XtText>时间：{{ formatTime(new Date()) }}</XtText>
        <XtText>相对时间：{{ formatRelativeTime(Date.now() - 3600000) }}</XtText>
      </XtFlexBox>
    </XtCardItem>
    
    <XtCardItem title="金额格式化">
      <XtFlexBox>
        <XtText>人民币：{{ formatCNY(12345.67) }}</XtText>
        <XtText>美元：{{ formatUSD(12345.67) }}</XtText>
      </XtFlexBox>
    </XtCardItem>
    
    <XtCardItem title="文件大小">
      <XtFlexBox>
        <XtText>{{ formatFileSize(524288) }}</XtText>
        <XtText>{{ formatFileSize(1073741824) }}</XtText>
      </XtFlexBox>
    </XtCardItem>
  </XtCard>
</template>

<script>
import { 
  formatThousand, 
  formatPercent, 
  formatDate, 
  formatTime, 
  formatRelativeTime,
  formatCNY,
  formatUSD,
  formatFileSize
} from 'xt-element-ui'

export default {
  methods: {
    formatThousand,
    formatPercent,
    formatDate,
    formatTime,
    formatRelativeTime,
    formatCNY,
    formatUSD,
    formatFileSize
  }
}
</script>
```

## 注意事项

1. 所有格式化函数对 `null`、`undefined`、空字符串返回空字符串
2. 对无法转换为数字的值，返回原值的字符串形式
3. 时间戳支持 10 位（秒）和 13 位（毫秒）两种格式
4. 日期字符串支持 `yyyy-MM-dd`、`yyyy/MM/dd` 等常见格式