import { useEffect, useState } from 'react'
import PageWrapper from '../../components/PageWrapper'
import { Table, notification } from 'antd'
import { FaSadCry } from 'react-icons/fa'
import handleApiCall from '../../api/handleApiCall'


const AdminContact = () => {
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)

  const openNotification = () => {
    notification.open({
      message: 'Something went wrong!',
      icon: <FaSadCry className='text-yellow-500' />,
      description:
        'Try again with valid credentials or check your internet connection.',
      onClick: () => {
        console.log('Notification Clicked!')
      }
    })
  }

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
      width: '15rem'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '15rem'
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question'
    }
  ]

  const handleFetchData = () => {
    handleApiCall({
      urlType: 'getUsersQuestions',
      variant: 'habit',
      setLoading,
      cb: (data, status) => {
        if (status === 200) {
          const modifiedData = data?.data?.map(item => ({
            ...item,
            key: item._id
          }))
          // update table
          setTableData(modifiedData)
        } else {
          openNotification()
        }
      }
    })
  }

  useEffect(() => {
    handleFetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <PageWrapper header='User Contacts'>
      <Table dataSource={tableData} columns={columns} loading={loading} />
    </PageWrapper>
  )
}

export default AdminContact
