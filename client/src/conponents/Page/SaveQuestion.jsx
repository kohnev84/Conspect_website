import React, { useState, useEffect } from 'react';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Space, Upload } from 'antd';
import SendFileAntdUpload from './SendFileAntdUpload';
const { TextArea } = Input;
function SaveQuestion() {

    const [messageApi, contextHolder] = message.useMessage()

    const onFinish = async (values) => {
        console.log('Success:', values);

        const createQuestionRequest = await fetch('http://localhost:5000/savequestion',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: "POST",
                body: JSON.stringify(values)
            })

        const createQuestionRespons = await createQuestionRequest.json();
        console.log(createQuestionRespons);
        if (createQuestionRespons.response === "success") {
            message.success('Сохранено успешно')
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // const props = {
    //     name: 'file',
    //     action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    //     headers: {
    //         authorization: 'authorization-text',
    //     },
    //     onChange(info) {
    //         if (info.file.status !== 'uploading') {
    //             console.log(info.file, info.fileList);
    //         }
    //         if (info.file.status === 'done') {
    //             message.success(`${info.file.name} файл сохранен`);
    //         } else if (info.file.status === 'error') {
    //             message.error(`${info.file.name} file upload failed.`);
    //         }
    //     },
    // };

    // const normFile = (e) => {
    //     console.log('Upload event:', e);
    //     if (Array.isArray(e)) {
    //         return e;
    //     }
    //     return e?.fileList;
    // };

    return (
        <>
            <div className='container'>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Вопрос"
                        name="question"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your question!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Ответ"
                        name="answer"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your answer!',
                            },
                        ]}
                    >
                        <TextArea rows={4} placeholder="Введите ответ" />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        {/* <div style={{ marginBottom: '15px' }}>
                            <Upload {...props}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </div> */}

                        {/* <Form.Item label="Dragger">
                            <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                                <Upload.Dragger name="files" onChange={(e) => { console.log(e) }}
                                    beforeUpload={() => {
                                        return false;
                                    }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Выбирите файл</p>
                                    <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                                </Upload.Dragger>
                            </Form.Item>
                        </Form.Item> */}

                        <SendFileAntdUpload />
                        <Button type="primary" htmlType="submit">
                            Сохранить
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}

export default SaveQuestion