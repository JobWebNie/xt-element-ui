/**
 * 生成虚拟滚动演示数据
 * @param {number} count 数据条数，默认 10000
 * @returns {Array}
 */
export function createVirtualScrollData(count = 10000) {
  const departments = ['研发部', '产品部', '运营部', '财务部', '市场部']
  const positions = ['工程师', '产品经理', '运营专员', '财务主管', '市场经理']
  const statuses = ['在职', '休假', '离职']

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    department: departments[i % departments.length],
    position: positions[i % positions.length],
    email: `user${i + 1}@example.com`,
    phone: `13800138${String(i).padStart(4, '0')}`,
    address: `北京市朝阳区第${i + 1}号街道`,
    salary: 5000 + Math.floor(Math.random() * 10000),
    status: statuses[i % statuses.length]
  }))
}

/** 虚拟滚动演示列配置 */
export const virtualScrollColumns = [
  { prop: 'id', label: 'ID', fixed: 'left', width: 80 },
  { prop: 'name', label: '姓名', fixed: 'left', width: 120 },
  { prop: 'department', label: '部门', width: 150 },
  { prop: 'position', label: '职位', width: 150 },
  { prop: 'email', label: '邮箱', width: 200 },
  { prop: 'phone', label: '电话', width: 130 },
  { prop: 'address', label: '地址', width: 200 },
  { prop: 'salary', label: '薪资', width: 120 },
  { prop: 'status', label: '状态', fixed: 'right', width: 100 }
]
