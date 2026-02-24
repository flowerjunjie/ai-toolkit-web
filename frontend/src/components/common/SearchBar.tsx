
import React, { useState, useCallback, useMemo } from 'react'
import { Input, AutoComplete } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { modules, getCommandById } from '@/data/modules'

const { Search } = Input

interface SearchOption {
  value: string
  label: string
  type: 'module' | 'command'
  moduleId?: string
  commandId?: string
}

// 防抖函数
function debounce&lt;T extends (...args: any[]) =&gt; any&gt;(
  func: T,
  wait: number
): (...args: Parameters&lt;T&gt;) =&gt; void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters&lt;T&gt;) =&gt; {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() =&gt; {
      func(...args)
    }, wait)
  }
}

const SearchBar: React.FC = () =&gt; {
  const navigate = useNavigate()
  const [options, setOptions] = useState&lt;SearchOption[]&gt;([])
  const [value, setValue] = useState('')

  // 搜索逻辑，使用useCallback优化
  const performSearch = useCallback((searchText: string) =&gt; {
    if (!searchText) {
      setOptions([])
      return
    }

    const newOptions: SearchOption[] = []
    const lowerSearchText = searchText.toLowerCase()

    // 搜索模块
    modules.forEach(module =&gt; {
      if (module.name.toLowerCase().includes(lowerSearchText) ||
          module.description.toLowerCase().includes(lowerSearchText)) {
        newOptions.push({
          value: module.name,
          label: `${module.name} - ${module.description}`,
          type: 'module',
          moduleId: module.id,
        })
      }

      // 搜索命令
      module.commands.forEach(command =&gt; {
        if (command.name.toLowerCase().includes(lowerSearchText) ||
            command.description.toLowerCase().includes(lowerSearchText)) {
          newOptions.push({
            value: command.name,
            label: `${module.name} &gt; ${command.name} - ${command.description}`,
            type: 'command',
            moduleId: module.id,
            commandId: command.id,
          })
        }
      })
    })

    setOptions(newOptions.slice(0, 10)) // 限制显示10个结果
  }, [])

  // 使用防抖的搜索函数
  const debouncedSearch = useMemo(
    () =&gt; debounce(performSearch, 300),
    [performSearch]
  )

  const handleSearch = useCallback(
    (searchText: string) =&gt; {
      debouncedSearch(searchText)
    },
    [debouncedSearch]
  )

  const handleSelect = useCallback(
    (value: string, option: SearchOption) =&gt; {
      setValue(value)

      if (option.type === 'module') {
        navigate(`/modules/${option.moduleId}`)
      } else if (option.type === 'command') {
        navigate(`/tools/${option.moduleId}/${option.commandId}`)
      }
    },
    [navigate]
  )

  return (
    &lt;AutoComplete
      style={{ width: '100%', maxWidth: '600px' }}
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      placeholder="搜索模块或命令..."
      value={value}
      onChange={setValue}
      filterOption={false} // 我们自己处理过滤
    &gt;
      &lt;Input.Search
        size="large"
        placeholder="搜索模块或命令..."
        prefix={&lt;SearchOutlined /&gt;}
        allowClear
      /&gt;
    &lt;/AutoComplete&gt;
  )
}

export default SearchBar
