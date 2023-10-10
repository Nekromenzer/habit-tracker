/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd'
import PageWrapper from '../../components/PageWrapper'
import { MdDelete, MdEditDocument } from 'react-icons/md'

const originData = []
for (let i = 0; i < 11; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    description:
      'Defining types for component props improves reusability of your components by validating received data',
    target_value: 20 + 1
  })
}

const Habits = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  const [editingKey, setEditingKey] = useState('')
  const isEditing = record => record.key === editingKey
  const edit = record => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record
    })
    setEditingKey(record.key)
  }

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    // record,
    // index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  const cancel = () => {
    setEditingKey('')
  }

  // delete
  const handleDelete = key => {
    const dataSource = [...data]
    setData(dataSource.filter(item => item.key !== key))
  }

  // edit save function
  const save = async key => {
    try {
      const row = await form.validateFields()
      const newData = [...data]
      const index = newData.findIndex(item => key === item.key)
      if (index > -1) {
        console.log(row, 'row')
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        setData(newData)
        setEditingKey('')
      } else {
        console.log(row, 'row')
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '25%',
      editable: false
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '40%',
      editable: true
    },
    {
      title: 'Target Value',
      dataIndex: 'target_value',
      width: '15%',
      editable: true
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8
              }}
            >
              Save
            </Typography.Link>
            <Typography.Link
              onClick={() => cancel()}
              className='!text-slate-800'
            >
              Cancel
            </Typography.Link>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          >
            <MdEditDocument className='text-xl text-blue-500 hover:text-blue-400 cursor-pointer' />
          </Typography.Link>
        )
      }
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) =>
        data.length >= 1 ? (
          <Popconfirm
            title='Sure to delete?'
            onConfirm={() => handleDelete(record.key)}
          >
            <MdDelete className='text-xl text-red-500 hover:text-red-400 cursor-pointer' />
          </Popconfirm>
        ) : null
    }
  ]

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'target_value' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })
  return (
    <PageWrapper header='HABITS'>
      <Form form={form} component={false}>
        <Table
          bordered
          loading={false}
          size='small'
          components={{
            body: {
              cell: EditableCell
            }
          }}
          dataSource={data}
          columns={mergedColumns}
          rowClassName='editable-row'
          pagination={{
            onChange: cancel
          }}
        />
      </Form>
    </PageWrapper>
  )
}

export default Habits
