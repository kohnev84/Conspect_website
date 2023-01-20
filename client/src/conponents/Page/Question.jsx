import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, message, Input } from 'antd';
const { TextArea } = Input;


function Question() {

    const [arrQuestion, setArr] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editQuestionInTextarea, setEditQuestionInTextarea] = useState('');
    const [saveEditQuestion, setSaveEditQuestion] = useState('');
    const [editId, setEditId] = useState(1);
    const [showIdAnswer, setShowIdAnswer] = useState("");
    const [showAnswer, setShowAnswer] = useState("");
    const showModal = (e) => {
        console.log(e)
        for (let i = 0; i < arrQuestion.length; i++) {
            if (arrQuestion[i].id === e) {
                console.log(arrQuestion[i])
                setShowIdAnswer(arrQuestion[i].id)
                setShowAnswer(arrQuestion[i].answer)
                break
            }

        }
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteQuestion = async (id) => {
        const reqComparison = await fetch(
            'http://localhost:5000/deletequestion',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'DELETE',
                body: JSON.stringify({ idDeleteQuestion: id })
            })
        const result = await reqComparison.json()
        console.log(result)
        if (result.response.length === 0) {
            let newArrQuestion = [...arrQuestion];
            let filterArrQuestion = newArrQuestion.filter(e => e.id !== id)
            filterArrQuestion.forEach((e, index) => {
                e.numberList = index + 1;
            })
            setArr(filterArrQuestion)
            message.success('Удалено успешно')
        }
    }

    useEffect(() => {
        fetch('http://localhost:5000/getquestion')
            .then(res => res.json())
            .then(res => {
                let newArr = [];
                console.log({ res })
                let result = res.response
                for (let i = 0; i < result.length; i++) {
                    let obj = {}
                    obj.numberList = i + 1;
                    obj.id = result[i].id
                    obj.question = result[i].questions
                    obj.answer = result[i].answers
                    newArr.push(obj)
                };
                setArr(newArr)
            })
    }, [])


    const editQuestion = (e) => {
        console.log(e)
        for (let i = 0; i < arrQuestion.length; i++) {
            if (arrQuestion[i].id === e) {
                console.log(arrQuestion[i])
                setEditId(e);
                setEditQuestionInTextarea(arrQuestion[i].answer)
                break
            }

        }
        setIsEditOpen(true);
    };
    const editCancel2 = () => {
        setIsEditOpen(false);
    };
    const editOk2 = async () => {
        const reqEditAnwser = await fetch(
            'http://localhost:5000/saveeditquestion',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ answer: saveEditQuestion, id: editId })
            })
        const resultEdit = await reqEditAnwser.json()
        console.log(resultEdit)
        if (resultEdit.response.length === 0) {

        }

        setIsEditOpen(false);
    };


    const columns = [
        {
            title: '№',
            dataIndex: 'numberList',
            key: 'numberList'
        },
        {
            title: 'Вопрос',
            dataIndex: 'question',
            key: 'question'
        },
        {
            title: 'Ответ',
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
                <Button type="primary" onClick={() => { console.log(id); showModal(id); }}>
                    Получить Ответ
                </Button>
            )
        },
        {
            title: 'Редактировать',
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
                <Button onClick={() => { editQuestion(id) }}>
                    Редактировать
                </Button>
            )
        },
        {
            title: 'Удалить',
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
                <Button onClick={() => { console.log(id); deleteQuestion(id); }}>
                    Удалить
                </Button>
            )
        }
    ];



    console.log({ arrQuestion })

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
        <div>
            <Table columns={columns} dataSource={arrQuestion} />
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
                {showAnswer}
            </Modal>
            <Modal title="Basic Modal" open={isEditOpen} onCancel={editCancel2} onOk={editOk2}>
                <TextArea rows={4} defaultValue={editQuestionInTextarea} maxLength={5000} onChange={(e) => {
                    setSaveEditQuestion(e.target.value);

                }} />

            </Modal>
        </div>
    );
};


export default Question