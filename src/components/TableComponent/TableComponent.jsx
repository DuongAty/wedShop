import { Button, Table, Tooltip } from 'antd'
import React, { useState } from 'react'
import { DownOutlined } from '@ant-design/icons';


const TableComponent = (props) => {
  const handleDelete = () => {
    handleDeleteMany(rowSelectedKey)
  }
  const [rowSelectedKey, setRowSelectedKey] = useState([])
  const { selectionType = 'checkbox', data = [], isLoading = false, columns = [], handleDeleteMany } = props

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKey(selectedRowKeys)
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  };
  return (
    <div>
      {rowSelectedKey.length > 0 && (
        <Tooltip title={'Xoá mục được chọn'} color='gray'>
          <button style={{
            marginTop: '10px',
            fontSize: '15px',
            fontWeight: 'bold',
            color: 'red',
            cursor: 'pointer',
            backgroundColor: 'white',
            border: '1px solid',
            borderRadius: '10px'
          }} onClick={handleDelete}>
            Xoá tất cả
          </button>
        </Tooltip>

      )}

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </div>
  )
}

export default TableComponent