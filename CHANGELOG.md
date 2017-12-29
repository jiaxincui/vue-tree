# Release Notes
## 2.3.0
(2017-12-29)

重写核心计算方法，减少不必要的计算，大幅减小代码体积

### Added

- 新增 `handle` 事件，单击节点名称触发，操作节点作为参数传递

### Changed

- 修改 `options` 设置项 ~~itemName~~ 为 `label`
- 修改 `options` 设置项 ~~openClass~~ 为 `openIcon`
- 修改 `options` 设置项 ~~closeClass~~ 为 `closeIcon`
- 修改 `options` 设置项 ~~checkedClass~~ 为 `checkedIcon`
- 修改 `options` 设置项 ~~unCheckedClass~~ 为 `uncheckedIcon`
- 删除 `options` 设置项 ~~showAdd~~ 
- 删除 `options` 设置项 ~~showEdit~~ 
- 删除 `options` 设置项 ~~showDelete~~ 
- 删除 `options` 设置项 ~~addClass~~ 
- 删除 `options` 设置项 ~~editClass~~ 
- 删除 `options` 设置项 ~~deleteClass~~ 
- 简化了 `html` 代码结构
- 重命名了部分 `class` 类名
## v2.2.0

(2017-12-16)

优化核心计算方法，添加 `label` 可控制选择框样式
### Added

- 新增 `halfCheckedClass` 、 `checkedClass`、 `unCheckedClass` 选项，可定制选择框样式

### Changed

- 样式调整，优化显示
---

## v2.1.1

(2017-11-23)

### Fixed

- 修复兼容v2.0

---

## v2.1.0

(2017-11-23)

### Added

- 新增配置选项`idsWithParent`,复选是否包含目录
- 新增`depthOpen`,初始化展开层级
- 新增`v-model`双向绑定复选选项ids

### Changed

- 配置项`checkedIds`不再使用