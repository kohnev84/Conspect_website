import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, message, Input, } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
const { TextArea } = Input;
const { Search } = Input;


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
    const [editRaw, setEditRaw] = useState(null);
    const [isDeleteFile, setIsDeleteFile] = useState(false);
    const [arrQuestionStatic, setQuestionStatic] = useState([]);

    useEffect(() => {
        console.log('Проверка номер 1')
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
                    obj.file_link = result[i].file_link
                    newArr.push(obj)
                };
                setArr(newArr)
                setQuestionStatic(newArr)
                console.log('Проверка номер 2')
            })
    }, [])

    const onSearch = (e) => {
        console.log(e)

        let strSearch = e

        let arrQuestionEdit = [...arrQuestionStatic];
        let result = arrQuestionEdit.filter(e => e.question.toLowerCase().match(strSearch.toLowerCase()) !== null)
        setArr(result)
    }


    const addFlie = (e) => {
        console.log(e)

    }

    const showModal = (e) => {
        console.log(e)
        for (let i = 0; i < arrQuestion.length; i++) {
            if (arrQuestion[i].id === e) {
                console.log(arrQuestion[i])
                setShowIdAnswer(arrQuestion[i].id)
                setShowAnswer({ answer: arrQuestion[i].answer, file_link: arrQuestion[i].file_link })
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
            setQuestionStatic(filterArrQuestion)
            message.success('Удалено успешно')
        }
    }




    const editQuestion = (e) => {
        console.log(e)
        for (let i = 0; i < arrQuestion.length; i++) {
            if (arrQuestion[i].id === e) {
                console.log(arrQuestion[i])
                setEditId(e);
                setEditQuestionInTextarea(arrQuestion[i].answer)
                console.log(arrQuestion[i].answer)
                break
            }
        }
        setIsEditOpen(true);
    };
    const editCancel2 = () => {
        setIsEditOpen(false);
        setEditQuestionInTextarea('')
    };
    const editOk2 = async () => {
        const reqEditAnwser = await fetch(
            'http://localhost:5000/saveeditquestion',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ answer: editRaw.answer, id: editRaw.id, isDeleteFile: isDeleteFile })
            })
        const resultEdit = await reqEditAnwser.json()
        console.log(resultEdit)
        if (resultEdit.response === 'success update') {
            // window.location.reload();
            let newQuestions = [...arrQuestion]
            for (let i = 0; i < newQuestions.length; i++) {
                if (newQuestions[i].id === editRaw.id) {
                    newQuestions[i].answer = editRaw.answer
                    newQuestions[i].file_link = null
                    setArr(newQuestions)
                    setQuestionStatic(newQuestions)
                    message.success('Успешно отредактированно')
                    break
                }

            }
        }
        setIsEditOpen(false);
        setEditQuestionInTextarea('')
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
            key: 'id',
            render: (record) => (
                <Button onClick={() => { setEditRaw(record); setIsEditOpen(true) }}>
                    <EditOutlined />
                </Button>
            )
        },
        {
            title: 'Удалить',
            dataIndex: 'id',
            key: 'id',
            render: (id) => (
                <Button onClick={() => { console.log(id); deleteQuestion(id); }}>
                    <DeleteOutlined />
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
    console.log(isDeleteFile);
    return (
        <div>
            <Search
                placeholder="Введите название вопроса"
                allowClear
                enterButton="Поиск"
                size="large"
                onChange={(e) => { onSearch(e.target.value) }}
            />
            <Table columns={columns} dataSource={arrQuestion} />
            <Modal title="Basic Modal" width={"80%"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
                {showAnswer.answer}
                <br />
                {showAnswer.file_link &&
                    <a href={`http://localhost:5000/download?file_link=${showAnswer.file_link}`}>Скачать файл</a>
                }
            </Modal>
            <Modal title="Редактирование" open={isEditOpen} onCancel={editCancel2} onOk={editOk2}>
                {editRaw?.answer}
                {/* <TextArea rows={4} onChange={(e) => {
                    setSaveEditQuestion(e.target.value);

                }} /> */}
                <TextArea rows={4} value={editRaw?.answer}
                    onChange={(e) => {

                        let arr = { ...editRaw }
                        arr.answer = e.target.value

                        setEditRaw(arr)
                    }}
                />
                {editRaw?.file_link &&
                    <>
                        <input type="checkbox" name="" id="idDeleteFile"
                            onChange={() => isDeleteFile ? setIsDeleteFile(false) : setIsDeleteFile(true)}
                        />
                        <label htmlFor="idDeleteFile">Удалить прикрепленный файл</label>
                    </>

                }

            </Modal>
        </div>
    );
};


export default Question