import { type FC, useEffect, useState } from 'react'
import { useLocation, useLoaderData, useNavigate } from 'react-router-dom'

import type { Rule } from 'antd/es/form'
import {
  Button,
  Card,
  Spin,
  Input,
  Form,
  Upload,
  UploadProps,
  UploadFile,
  message,
  Select,
  InputNumber,
  Radio
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { postUpdateOfferWallOffer, uploadImage, postOfferDetailById } from '@/api'

import { uploadImgToBase64 } from '@/utils/image'
const InformationEdit: FC = () => {
  const router = useNavigate()
  let id = useLocation()?.state?.id
  if (id === undefined) {
    id = (useLoaderData() as { id: any }).id
  }
  const [informationDetail, setInformationDetail] = useState<API.OfferWallOfferType | null>({
    id: 1,
    sourceOfferId: '',
    state: 1,
    description: '',
    source: 0,
    platform: '',
    url: '',
    percent: 70,
    displayName: '',
    blockSimulator: 0,
    blockVpn: 0,
    currentCap: 0,
    data: {
      app_name: '',
      app_desc: '',
      click_url: '',
      countries: '',
      daily_cap: '',
      offer_id: '',
      offer_name: '',
      package_name: '',
      payout: '',
      payout_type: '',
      platform: '',
      preview_link: '',
    }
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [searchId, setSearchId] = useState<string>('')
  const [form] = Form.useForm()
  const [listImgs, setListImgs] = useState<UploadFile[]>([])

  useEffect(() => {

  }, [])

  useEffect(() => {
    if (informationDetail) {
      form.setFieldsValue({
        ...informationDetail,
        coverImageUrl: informationDetail.url || ''
      })
    }
  }, [informationDetail, form])

  const formRules: Record<string, Rule[]> = {
    all: [
      { required: true, message: '内容不能为空' }
    ],
  }
  const onFinish = (values: any) => {
    if (loading) return
    setLoading(true)

    // update
    postUpdateOfferWallOffer({
      id,
      description: values.description,
      state: 1,
      url: values.coverImageUrl,
      percent: Number(values.percent),
      displayName: values.displayName,
      blockSimulator: Number(values.blockSimulator),
      blockVpn: Number(values.blockVpn)
      // 其他逻辑,
    }).then((res: any) => {
      if (res.code === 0) {
        message.success('修改成功')
      } else {
        message.error(res.msg || '修改失败')
      }
    }).catch((err: any) => {
      message.error(err.msg || '修改失败')
    }).finally(() => {
      setLoading(false)
    })

  }


  const resetForm = () => {
    form.resetFields()
  }
  useEffect(() => {
    if (id && id !== 'add') {
      setSearchId(id)
    }
  }, [id])

  useEffect(() => {
    if (searchId) {
      loadData(Number(searchId))
    }
  }, [searchId])

  const loadData = (id: number) => {
    setLoading(true)
    postOfferDetailById({ id }).then((res: any) => {
      let resData = res.data.offer

      setInformationDetail({ ...resData })

      if (resData.url) {
        setListImgs([{
          uid: '-1',
          name: resData.url,
          status: 'done',
          url: resData.url,
          thumbUrl: resData.url
        }])
        // 设置表单的 coverImageUrl 字段
        form.setFieldValue('coverImageUrl', resData.url)
      } else {
        setListImgs([])
        form.setFieldValue('coverImageUrl', '')
      }
    }).catch((err: any) => {
      message.error(err.msg || '加载失败')
    }).finally(() => {
      setLoading(false)
    })
  }


  const handleChangeListImgs: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setListImgs(newFileList)
    form.setFieldValue("coverImageUrl", newFileList[0]?.response?.data?.url || "")
  }

  const customUploadListImgs: UploadProps['customRequest'] = async (e) => {
    // 将图片转换为base64
    const base64 = await uploadImgToBase64(e.file as File) as { result: string }
    uploadImage({ image: base64.result.replace(/.*;base64,/, '') }).then((res) => {
      if (res.code !== 0) {
        e.onError?.({
          status: res.code,
          message: '上传失败',
          name: ""
        })
        return message.error("上传图片失败,错误码:" + res.code)
      }
      e.onSuccess?.({
        data: {
          url: res.data.imageUrl + "/wideThumbnail",
          name: '',
          status: "done",
          thumbUrl: res.data.imageUrl + "/wideThumbnail"
        }
      });
      form.setFieldValue("coverImageUrl", res.data.imageUrl + "/wideThumbnail")
    }).catch((err) => {
      message.error('上传失败')
      e.onError?.({
        status: 500,
        message: '上传失败',
        name: 'baidu.png'
      })
    });
  }

  return (
    <>
      <Spin spinning={loading} tip="加载中..." >
        {(searchId) && (
          <Card bordered={false} >
            <div style={{ overflowX: 'scroll' }}>
              <Form
                form={form}
                labelCol={{ span: 4 }}
                initialValues={{ ...informationDetail }}
                onFinish={onFinish}
                style={{ width: '1200px', margin: '0 auto' }}
              >
                <Form.Item label={<h3 style={{ whiteSpace: 'nowrap' }}>Offer编号</h3>} name='sourceOfferId' rules={formRules.all}>
                  <Input disabled placeholder='请输入内容' />
                </Form.Item>
                <Form.Item label={<h3 style={{ whiteSpace: 'nowrap' }}>OfferName</h3>} name={['data', 'app_name']}>
                  <Input disabled placeholder='请输入内容' value={informationDetail?.data?.app_name} />
                </Form.Item>
                <Form.Item label={<h3 style={{ whiteSpace: 'nowrap' }}>App端显示名字</h3>} name='displayName'>
                  <Input placeholder='请输入内容' value={informationDetail?.displayName} />
                </Form.Item>
                <Form.Item label="block模拟器" name='blockSimulator'>
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="blockVPN" name='blockVpn'>
                  <Radio.Group>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label={<h3 style={{ whiteSpace: 'nowrap' }}>分成比例</h3>}
                  name='percent'
                  rules={[
                    { required: true, message: '请输入分成比例' },
                    { type: 'number', min: 0, max: 100, message: '请输入0-100之间的数字' }
                  ]}>
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: '100%' }}
                    placeholder="请输入内容0-100"
                  />
                </Form.Item>

                {informationDetail && <Form.Item label={<h3 style={{ whiteSpace: 'nowrap' }}>offer封面</h3>} name='coverImageUrl' rules={formRules.all}>
                  <Card title='' bordered={false} bodyStyle={{ height: '150px' }} >
                    <Upload
                      fileList={listImgs}
                      accept='.jpg, .jpeg, .gif, .png, .bmp, .svg'
                      listType='picture-card'
                      className='list-upload'
                      style={{ height: '100px', width: 'auto' }}
                      onChange={handleChangeListImgs}
                      maxCount={1}
                      customRequest={customUploadListImgs}
                    >
                      {listImgs.length === 0 && (
                        <div>
                          <PlusOutlined rev={undefined} />
                          <div style={{ marginTop: '8px' }}>点击上传（建议尺寸: W:278px H:157px）</div>
                        </div>
                      )}
                    </Upload>
                  </Card>
                </Form.Item>}

                <Form.Item label={<h3 style={{ whiteSpace: 'nowrap' }}>任务描述</h3>} name='description' rules={formRules.all}>
                  <Input.TextArea rows={5} style={{ width: '100%' }} placeholder='请输入任务描述' />
                </Form.Item>


                <Form.Item wrapperCol={{ span: 12, offset: 12 }}>

                  <Button disabled={loading} style={{ marginLeft: '12px' }} type='primary' htmlType='submit'>
                    保存
                  </Button>
                  <Button disabled={loading} style={{ marginLeft: '12px' }} onClick={resetForm}>
                    重置
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Card>
        )}
      </Spin>
    </>
  )
}

export default InformationEdit
