import React, { useState } from 'react'
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

const SearchBar: React.FC = () => {
  const navigate = useNavigate()
  const [options, setOptions] = useState<SearchOption[]>([])
  const [value, setValue] = useState('')

  const handleSearch = (searchText: string) => {
    if (!searchText) {
      setOptions([])
      return
    }

    const newOptions: SearchOption[] = []

    // 搜索模块
    modules.forEach(module => {
      if (module.name.toLowerCase().includes(searchText.toLowerCase()) ||
          module.description.toLowerCase().includes(searchText.toLowerCase())) {
        newOptions.push({
          value: module.name,
          label: `${module.name} - ${module.description}`,
          type: 'module',
          moduleId: module.id,
        })
      }

      // 搜索命令
      module.commands.forEach(command => {
        if (command.name.toLowerCase().includes(searchText.toLowerCase()) ||
            command.description.toLowerCase().includes(searchText.toLowerCase())) {
          newOptions.push({
            value: command.name,
            label: `${module.name} > ${command.name} - ${command.description}`,
            type: 'command',
            moduleId: module.id,
            commandId: command.id,
          })
        }
      })
    })

    setOptions(newOptions.slice(0, 10)) // 限制显示10个结果
  }

  const handleSelect = (value: string, option: SearchOption) => {
    setValue(value)

    if (option.type === 'module') {
      navigate(`/modules/${option.moduleId}`)
    } else if (option.type === 'command') {
      navigate(`/tools/${option.moduleId}/${option.commandId}`)
    }
  }

  return (
    <AutoComplete
      style={{ width: '100%', maxWidth: '600px' }}
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      placeholder="搜索模块或命令..."
      value={value}
      onChange={setValue}
    >
      <Input.Search
        size="large"
        placeholder="搜索模块或命令..."
        prefix={<SearchOutlined />}
        allowClear
      />
    </AutoComplete>
  )
}

export default SearchBar
