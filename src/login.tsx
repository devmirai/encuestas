import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRole } from './RoleContext';
import { FaWhatsapp } from 'react-icons/fa';
import { MdOutlinePhone } from 'react-icons/md';
import { IoIosArrowDroprightCircle } from "react-icons/io";

import './App.css'; // Asegúrate de importar los estilos

const { Title } = Typography;

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setRolId, setUserId, setNombre, setApellido } = useRole();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/users/login', { email, password });
            const user = response.data.user;

            if (user) {
                setRolId(user.rol_id); // Asegúrate de que el backend devuelva `rol_id`
                setUserId(user.id); // Almacena el ID del usuario
                setNombre(user.nombre); // Almacena el nombre del usuario
                setApellido(user.apellido); // Almacena el apellido del usuario
                message.success(`Login successful. Welcome ${user.nombre} ${user.apellido}`);
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
        <div className="content-container">
            {/* Barra superior con logo y texto */}
            <div className="top-bar">
                <div className="logo-container">
                    <img src="https://encuestas.utp.edu.pe/Imagenes/logologo.png" alt="Logo" className="logo" />
                    <div className="logo-text">Portal de encuestas</div>
                </div>
            </div>

            {/* Contenedor del login */}
            <div className="login-container">
                <Title level={2} style={{ color: 'var(--primary-color)' }}>Ingresa a tu cuenta</Title>
                <Form onFinish={handleSubmit}>
                    <Form.Item
                        label="Codigo"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                        labelCol={{ style: { color: 'var(--primary-color)' } }}
                    >
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--accent-color)' }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Contraseña"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        labelCol={{ style: { color: 'var(--primary-color)' } }}
                    >
                        <Input.Password
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--accent-color)' }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--secondary-color)' }}>
                            <IoIosArrowDroprightCircle /> Ingresar
                        </Button>
                    </Form.Item>
                </Form>
                
            </div>
            <div className="footer">
                <div>
                    <FaWhatsapp />
                    <span>WhatsApp: 960 252 970 </span>

                    <MdOutlinePhone />
                    <span>Teléfono: Lima (01) 315 9600</span>
                </div>
                <hr />
                <p>Nivel Nacional 0801 19 600 (opción 1).</p>
                <div>
                    &copy; {new Date().getFullYear()} devmirai. Todos los derechos reservados.
                </div>
            </div>
        </div>
    );
};

export default Login;
