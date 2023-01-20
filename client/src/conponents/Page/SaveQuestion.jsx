import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Form, Input, message, Space } from 'antd';
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
                        <TextArea rows={4} placeholder="Введите ответ" maxLength={5000} />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
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