import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRole } from './RoleContext';

const { Title } = Typography;

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setRolId } = useRole();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/users');
            const user = response.data.find((user: any) => user.correo === email && user.contraseña === password);

            if (user) {
                setRolId(user.rol_id);
                message.success('Login successful');
                console.log('Rol ID:', user.rol_id);
                navigate('/encuesta'); // Redirige a /encuesta
            } else {
                message.error('Invalid email or password');
            }
        } catch (error) {
            message.error('An error occurred during login');
            console.error(error);
        }
    };

    return (
        <div style={{ maxWidth: 300, margin: '0 auto', padding: '50px 0' }}>
            <Title level={2}>Login</Title>
            <Form onFinish={handleSubmit}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;