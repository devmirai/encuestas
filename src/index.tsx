import { useState, useEffect } from 'react';
import { List, Card, Slider, Spin, message, Button, Modal, Select, Input, Form } from 'antd';
import axios from 'axios';
import './App.css';
import { useRole } from './RoleContext';

interface Question {
  id: number;
  titulo: string;
  contenido: string;
}

const Index: React.FC = () => {
  const { rolId } = useRole();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [responses, setResponses] = useState<{ [key: number]: number }>({});

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
    setIsModalVisible(true);
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
          setIsModalVisible(false);
          // Update the questions list with the updated question
          setQuestions(prevQuestions => prevQuestions.map(q => q.id === selectedQuestion.id ? selectedQuestion : q));
        })
        .catch((error: any) => {
          message.error('Error al actualizar la pregunta: ' + error.message);
        });
    }
  };

  const handleSliderChange = (id: number, value: number) => {
    setResponses(prevResponses => ({ ...prevResponses, [id]: value }));
  };

  const handleSubmitSurvey = () => {
    console.log('Survey responses:', responses);
    message.success('Encuesta enviada con éxito');
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="App">
      <h1>Encuesta</h1>
      {rolId === 1 && <Button type="primary" onClick={handleEditClick}>Editar Pregunta</Button>}
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
      <Modal
        title="Editar Pregunta"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
      >
        <Form layout="vertical">
          <Form.Item label="Seleccionar Pregunta">
            <Select onChange={handleQuestionChange} value={selectedQuestionId}>
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
    </div>
  );
};

export default Index;
