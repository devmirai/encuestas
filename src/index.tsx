import { useState, useEffect } from 'react';
import { List, Card, Slider, Spin, message, Button, Modal, Input, Form, Select } from 'antd';
import axios from 'axios';
import './App.css';
import { useRole } from './RoleContext';

interface Question {
  id: number;
  titulo: string;
  contenido: string;
}

const Index: React.FC = () => {
  const { rolId, userId, nombre, apellido } = useRole();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [responses, setResponses] = useState<{ [key: number]: number }>({});
  const [newQuestion, setNewQuestion] = useState({ titulo: '', contenido: '' });

  useEffect(() => {
    axios.get('http://localhost:3000/api/questions')
      .then(response => {
        setQuestions(response.data);
        setLoading(false);
        // Initialize responses with 0 for each question
        const initialResponses: { [key: number]: number } = {};
        response.data.forEach((question: Question) => {
          initialResponses[question.id] = 0;
        });
        setResponses(initialResponses);
      })
      .catch((error: any) => {
        message.error('Error al cargar las preguntas: ' + error.message);
        setLoading(false);
      });
  }, []);

  const handleEditClick = () => {
    setIsEditModalVisible(true);
  };

  const handleQuestionChange = (id: number) => {
    const question = questions.find(q => q.id === id) || null;
    setSelectedQuestionId(id);
    setSelectedQuestion(question);
  };

  const handleSave = () => {
    if (selectedQuestion) {
      axios.put(`http://localhost:3000/api/questions/${selectedQuestion.id}`, selectedQuestion)
        .then(() => {
          message.success('Pregunta actualizada con éxito');
          setIsEditModalVisible(false);
          // Update the questions list with the updated question
          setQuestions(prevQuestions => prevQuestions.map(q => q.id === selectedQuestion.id ? selectedQuestion : q));
        })
        .catch((error: any) => {
          message.error('Error al actualizar la pregunta: ' + error.message);
        });
    }
  };

  const handleDeleteQuestion = () => {
    if (selectedQuestionId !== null) {
      axios.delete(`http://localhost:3000/api/questions/${selectedQuestionId}`)
        .then(() => {
          message.success('Pregunta eliminada con éxito');
          setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== selectedQuestionId));
          setIsEditModalVisible(false);
        })
        .catch((error: any) => {
          message.error('Error al eliminar la pregunta: ' + error.message);
        });
    }
  };

  const handleAddQuestion = () => {
    axios.post('http://localhost:3000/api/questions', newQuestion)
      .then(response => {
        message.success('Pregunta agregada con éxito');
        setQuestions(prevQuestions => [...prevQuestions, response.data]);
        setNewQuestion({ titulo: '', contenido: '' });
        setIsAddModalVisible(false);
      })
      .catch((error: any) => {
        message.error('Error al agregar la pregunta: ' + error.message);
      });
  };

  const handleSliderChange = (id: number, value: number) => {
    setResponses(prevResponses => ({ ...prevResponses, [id]: value }));
  };

  const handleSubmitSurvey = () => {
    if (userId === null) {
      message.error('Usuario no autenticado');
      return;
    }

    const fecha_respuesta = new Date().toISOString();

    const responsesToSubmit = Object.entries(responses).map(([pregunta_id, valor]) => ({
      usuario_id: userId,
      pregunta_id: Number(pregunta_id),
      valor,
      fecha_respuesta,
    }));

    const promises = responsesToSubmit.map(response => 
      axios.post('http://localhost:3000/api/responses', response)
    );

    Promise.all(promises)
      .then(() => {
        message.success('Encuesta enviada con éxito');
      })
      .catch((error: any) => {
        message.error('Error al enviar la encuesta: ' + error.message);
      });
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="App index-container">
      <div className="sidebar">
        <div className="sidebar-content">
          <span className="sidebar-text">Portal de encuestas</span>
          <a href="/login" className="logout-link">Salir</a>
        </div>
      </div>
      <div className="welcome-bar">
        <span>Bienvenido, {nombre} {apellido}</span>
      </div>
      {rolId === 1 && (
        <>
          <Button type="primary" className="edit-button" onClick={handleEditClick}>Editar/Eliminar Pregunta</Button>
          <Button type="primary" className="add-button" onClick={() => setIsAddModalVisible(true)}>Agregar Pregunta</Button>
          <Modal
            title="Editar/Eliminar Pregunta"
            visible={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            footer={[
              <Button key="delete" danger className="delete-button" onClick={handleDeleteQuestion}>Eliminar</Button>,
              <Button key="save" type="primary" className="save-button" onClick={handleSave}>Guardar</Button>,
            ]}
          >
            <Form layout="vertical">
              <Form.Item label="Seleccionar Pregunta">
                <Select
                  onChange={handleQuestionChange}
                  value={selectedQuestionId}
                >
                  {questions.map(question => (
                    <Select.Option key={question.id} value={question.id}>
                      {question.titulo}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {selectedQuestion && (
                <>
                  <Form.Item label="Título">
                    <Input
                      value={selectedQuestion.titulo}
                      onChange={e => setSelectedQuestion({ ...selectedQuestion, titulo: e.target.value })}
                    />
                  </Form.Item>
                  <Form.Item label="Contenido">
                    <Input.TextArea
                      value={selectedQuestion.contenido}
                      onChange={e => setSelectedQuestion({ ...selectedQuestion, contenido: e.target.value })}
                    />
                  </Form.Item>
                </>
              )}
            </Form>
          </Modal>
          <Modal
            title="Agregar Pregunta"
            visible={isAddModalVisible}
            onCancel={() => setIsAddModalVisible(false)}
            onOk={handleAddQuestion}
          >
            <Form layout="vertical">
              <Form.Item label="Título">
                <Input
                  value={newQuestion.titulo}
                  onChange={e => setNewQuestion({ ...newQuestion, titulo: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Contenido">
                <Input.TextArea
                  value={newQuestion.contenido}
                  onChange={e => setNewQuestion({ ...newQuestion, contenido: e.target.value })}
                />
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={questions}
        renderItem={item => (
          <List.Item>
            <Card title={item.titulo}>
              <p>{item.contenido}</p>
              <Slider min={0} max={10} defaultValue={0} onChange={(value) => handleSliderChange(item.id, value)} />
            </Card>
          </List.Item>
        )}
      />
      <Button type="primary" onClick={handleSubmitSurvey} style={{ marginTop: '20px' }}>
        Enviar Encuesta
      </Button>
    </div>
  );
};

export default Index;
